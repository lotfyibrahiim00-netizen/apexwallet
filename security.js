/**
 * ApexWallet Security & Cryptography Engine
 * Military-grade AES-256-GCM encryption with PBKDF2 key derivation & WebAuthn biometrics.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'apexwallet_security_vault_v1';
  const BIOMETRIC_KEY = 'apexwallet_biometrics_v1';
  const AUTOLOCK_KEY = 'apexwallet_autolock_ms';
  const LEGACY_STORAGE_KEY = 'apexwallet_user_vault_v1';
  const PBKDF2_ITERATIONS = 100000;

  // Helper: Hex & Base64 encoders/decoders
  function bufToB64(buf) {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function b64ToBuf(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function bufToHex(buf) {
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  class WalletSecurityEngine {
    constructor() {
      this.activeKey = null;
      this.isLocked = true;
      this.onLockStateChange = null;
      this.lastActiveTime = Date.now();
      const savedTimeout = localStorage.getItem(AUTOLOCK_KEY);
      this.autoLockTimeoutMs = savedTimeout !== null ? parseInt(savedTimeout, 10) : 3 * 60 * 1000;
      this._initAutoLock();
    }

    getAutoLockTimeout() {
      return this.autoLockTimeoutMs;
    }

    setAutoLockTimeout(ms) {
      this.autoLockTimeoutMs = parseInt(ms, 10);
      localStorage.setItem(AUTOLOCK_KEY, String(this.autoLockTimeoutMs));
    }

    /**
     * Check if the user has already configured a security PIN
     */
    isConfigured() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return false;
      try {
        const parsed = JSON.parse(data);
        return !!(parsed.salt && parsed.verifier);
      } catch (e) {
        return false;
      }
    }

    /**
     * Hash PIN with salt for quick verification
     */
    async _computeVerifier(pin, saltHex) {
      const enc = new TextEncoder();
      const combined = enc.encode(pin + ':' + saltHex);
      const digest = await crypto.subtle.digest('SHA-256', combined);
      return bufToHex(digest);
    }

    /**
     * Derive AES-GCM 256-bit encryption key from PIN and Salt via PBKDF2
     */
    async _deriveKey(pin, saltBytes) {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(pin),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltBytes,
          iterations: PBKDF2_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    }

    /**
     * Encrypt JSON payload with active key
     */
    async _encryptPayload(payloadObj, key) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const encoded = enc.encode(JSON.stringify(payloadObj));

      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoded
      );

      // Pack IV (12 bytes) + Ciphertext into single base64 string
      const packed = new Uint8Array(iv.length + ciphertext.byteLength);
      packed.set(iv);
      packed.set(new Uint8Array(ciphertext), iv.length);
      return bufToB64(packed);
    }

    /**
     * Decrypt base64 packed payload with active key
     */
    async _decryptPayload(packedB64, key) {
      const raw = b64ToBuf(packedB64);
      const iv = raw.slice(0, 12);
      const ciphertext = raw.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      return JSON.parse(dec.decode(decrypted));
    }

    /**
     * First-time PIN setup
     */
    async setupPin(pin) {
      if (!/^\d{4}$/.test(pin)) {
        throw new Error('PIN must be exactly 4 digits');
      }

      // Generate 16 bytes random salt
      const saltBytes = crypto.getRandomValues(new Uint8Array(16));
      const saltHex = bufToHex(saltBytes);
      const verifier = await this._computeVerifier(pin, saltHex);
      const key = await this._deriveKey(pin, saltBytes);

      // Check if existing unencrypted legacy data exists to migrate
      let initialData = { banks: [], cards: [], transactions: [] };
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          if (parsed && (parsed.banks || parsed.cards || parsed.transactions)) {
            initialData = parsed;
          }
        } catch (e) {}
      }

      // Encrypt initial vault
      const encryptedVault = await this._encryptPayload(initialData, key);

      const securityRecord = {
        version: 1,
        salt: saltHex,
        verifier: verifier,
        vault: encryptedVault,
        hasBiometrics: false,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(securityRecord));
      // Remove legacy unencrypted storage key for security
      localStorage.removeItem(LEGACY_STORAGE_KEY);

      this.activeKey = key;
      this.isLocked = false;
      this.lastActiveTime = Date.now();

      if (this.onLockStateChange) this.onLockStateChange(false);
      return initialData;
    }

    /**
     * Verify PIN and unlock vault
     */
    async unlock(pin) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) throw new Error('Security vault not found');

      const securityRecord = JSON.parse(raw);
      const calculatedVerifier = await this._computeVerifier(pin, securityRecord.salt);

      if (calculatedVerifier !== securityRecord.verifier) {
        return { success: false, error: 'Incorrect PIN' };
      }

      // Deriving key from hex salt
      const saltArr = new Uint8Array(securityRecord.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const key = await this._deriveKey(pin, saltArr);

      try {
        const decryptedData = await this._decryptPayload(securityRecord.vault, key);
        this.activeKey = key;
        this.isLocked = false;
        this.lastActiveTime = Date.now();

        if (this.onLockStateChange) this.onLockStateChange(false);
        return { success: true, data: decryptedData };
      } catch (err) {
        console.error('Decryption failed despite verifier match:', err);
        return { success: false, error: 'Failed to decrypt vault' };
      }
    }

    /**
     * Save updated wallet data into encrypted vault
     */
    async saveVault(dataObj) {
      if (this.isLocked || !this.activeKey) {
        console.warn('Cannot save vault: wallet is locked');
        return false;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const securityRecord = JSON.parse(raw);
      securityRecord.vault = await this._encryptPayload(dataObj, this.activeKey);
      securityRecord.updatedAt = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(securityRecord));
      this.lastActiveTime = Date.now();
      return true;
    }

    /**
     * Check if a given PIN matches without modifying lock state
     */
    async verifyPinOnly(pin) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      try {
        const securityRecord = JSON.parse(raw);
        const calculatedVerifier = await this._computeVerifier(pin, securityRecord.salt);
        return calculatedVerifier === securityRecord.verifier;
      } catch (e) {
        return false;
      }
    }

    /**
     * Change PIN
     */
    async changePin(oldPin, newPin) {
      if (!/^\d{4}$/.test(newPin)) {
        return { success: false, error: 'New PIN must be 4 digits' };
      }

      const isValid = await this.verifyPinOnly(oldPin);
      if (!isValid) {
        return { success: false, error: 'Current PIN is incorrect' };
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      const securityRecord = JSON.parse(raw);
      const oldSaltArr = new Uint8Array(securityRecord.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const oldKey = await this._deriveKey(oldPin, oldSaltArr);

      let currentData = { banks: [], cards: [], transactions: [] };
      try {
        currentData = await this._decryptPayload(securityRecord.vault, oldKey);
      } catch (e) {
        console.error('Failed to decrypt vault during PIN change:', e);
        return { success: false, error: 'Failed to decrypt current vault' };
      }

      // Generate fresh salt and new key for new PIN
      const newSaltBytes = crypto.getRandomValues(new Uint8Array(16));
      const newSaltHex = bufToHex(newSaltBytes);
      const newVerifier = await this._computeVerifier(newPin, newSaltHex);
      const newKey = await this._deriveKey(newPin, newSaltBytes);

      // Re-encrypt vault with new key
      const newEncryptedVault = await this._encryptPayload(currentData, newKey);

      securityRecord.salt = newSaltHex;
      securityRecord.verifier = newVerifier;
      securityRecord.vault = newEncryptedVault;
      securityRecord.updatedAt = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(securityRecord));

      // If biometrics is active, update the encrypted PIN stored for biometrics
      if (this.isBiometricsEnabled()) {
        try {
          const bioRaw = localStorage.getItem(BIOMETRIC_KEY);
          if (bioRaw) {
            const bioData = JSON.parse(bioRaw);
            const bioKeyBytes = b64ToBuf(bioData.bioKey);
            const enc = new TextEncoder();
            const bioCryptoKey = await crypto.subtle.importKey(
              'raw',
              bioKeyBytes,
              { name: 'AES-GCM' },
              false,
              ['encrypt']
            );
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encryptedPinBuffer = await crypto.subtle.encrypt(
              { name: 'AES-GCM', iv: iv },
              bioCryptoKey,
              enc.encode(newPin)
            );
            const packed = new Uint8Array(iv.length + encryptedPinBuffer.byteLength);
            packed.set(iv);
            packed.set(new Uint8Array(encryptedPinBuffer), iv.length);
            bioData.encryptedPin = bufToB64(packed);
            bioData.updatedAt = new Date().toISOString();
            localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(bioData));
          }
        } catch (bioErr) {
          console.warn('Note: Could not refresh biometric pin record:', bioErr);
        }
      }

      this.activeKey = newKey;
      this.isLocked = false;
      this.lastActiveTime = Date.now();
      return { success: true };
    }

    /**
     * Lock wallet immediately
     */
    lock() {
      this.activeKey = null;
      this.isLocked = true;
      if (this.onLockStateChange) this.onLockStateChange(true);
    }

    /**
     * Clear all security data (Factory Reset)
     */
    clearAll() {
      this.activeKey = null;
      this.isLocked = true;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BIOMETRIC_KEY);
      localStorage.removeItem(AUTOLOCK_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (this.onLockStateChange) this.onLockStateChange(true);
    }

    /**
     * Check if Biometrics is currently enabled by user
     */
    isBiometricsEnabled() {
      const raw = localStorage.getItem(BIOMETRIC_KEY);
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        return !!(parsed && parsed.credId && parsed.encryptedPin && parsed.bioKey);
      } catch (e) {
        return false;
      }
    }

    /**
     * Check if device supports Biometrics (WebAuthn)
     */
    async isBiometricsAvailable() {
      if (typeof window !== 'undefined' &&
          window.PublicKeyCredential &&
          typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        try {
          return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch (e) {
          return false;
        }
      }
      return false;
    }

    /**
     * Enable Biometrics (Face ID / Touch ID / Fingerprint / Windows Hello)
     */
    async enableBiometrics(currentPin) {
      if (!this.isConfigured()) {
        return { success: false, error: 'Security PIN is not set up' };
      }

      // Verify current PIN first
      const rawVault = localStorage.getItem(STORAGE_KEY);
      const securityRecord = JSON.parse(rawVault);
      const calculatedVerifier = await this._computeVerifier(currentPin, securityRecord.salt);
      if (calculatedVerifier !== securityRecord.verifier) {
        return { success: false, error: 'Incorrect PIN' };
      }

      if (typeof navigator === 'undefined' || !navigator.credentials || !navigator.credentials.create) {
        return { success: false, error: 'Biometric WebAuthn not supported on this browser' };
      }

      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const userId = crypto.getRandomValues(new Uint8Array(16));

        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: challenge,
            rp: {
              name: 'ApexWallet',
              id: window.location.hostname
            },
            user: {
              id: userId,
              name: 'apexwallet-owner',
              displayName: 'ApexWallet User'
            },
            pubKeyCredParams: [
              { alg: -7, type: 'public-key' },
              { alg: -257, type: 'public-key' }
            ],
            authenticatorSelection: {
              authenticatorAttachment: 'platform',
              userVerification: 'required',
              residentKey: 'preferred'
            },
            timeout: 60000,
            attestation: 'none'
          }
        });

        if (!credential) {
          return { success: false, error: 'Biometric registration was cancelled' };
        }

        // Generate 256-bit local secret to encrypt PIN
        const bioKeyBytes = crypto.getRandomValues(new Uint8Array(32));
        const enc = new TextEncoder();
        const bioCryptoKey = await crypto.subtle.importKey(
          'raw',
          bioKeyBytes,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encryptedPinBuffer = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv },
          bioCryptoKey,
          enc.encode(currentPin)
        );

        // Pack IV + ciphertext
        const packed = new Uint8Array(iv.length + encryptedPinBuffer.byteLength);
        packed.set(iv);
        packed.set(new Uint8Array(encryptedPinBuffer), iv.length);

        const bioRecord = {
          credId: bufToB64(credential.rawId),
          encryptedPin: bufToB64(packed),
          bioKey: bufToB64(bioKeyBytes),
          enabledAt: new Date().toISOString()
        };

        localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(bioRecord));
        return { success: true };
      } catch (err) {
        console.error('Biometric enable error:', err);
        return { success: false, error: err.message || 'Biometric registration failed' };
      }
    }

    /**
     * Disable Biometrics
     */
    disableBiometrics() {
      localStorage.removeItem(BIOMETRIC_KEY);
      return { success: true };
    }

    /**
     * Unlock using Biometrics (Face ID / Touch ID)
     */
    async unlockWithBiometrics() {
      if (!this.isBiometricsEnabled()) {
        return { success: false, error: 'Biometrics is not enabled' };
      }

      const bioData = JSON.parse(localStorage.getItem(BIOMETRIC_KEY));
      if (typeof navigator === 'undefined' || !navigator.credentials || !navigator.credentials.get) {
        return { success: false, error: 'WebAuthn not supported' };
      }

      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const credIdBytes = b64ToBuf(bioData.credId);

        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge: challenge,
            rpId: window.location.hostname,
            allowCredentials: [{
              id: credIdBytes,
              type: 'public-key'
            }],
            userVerification: 'required',
            timeout: 60000
          }
        });

        if (!assertion) {
          return { success: false, error: 'Biometric verification cancelled' };
        }

        // Decrypt PIN
        const bioKeyBytes = b64ToBuf(bioData.bioKey);
        const bioCryptoKey = await crypto.subtle.importKey(
          'raw',
          bioKeyBytes,
          { name: 'AES-GCM' },
          false,
          ['decrypt']
        );

        const packed = b64ToBuf(bioData.encryptedPin);
        const iv = packed.slice(0, 12);
        const ciphertext = packed.slice(12);

        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          bioCryptoKey,
          ciphertext
        );

        const dec = new TextDecoder();
        const pin = dec.decode(decryptedBuffer);

        // Unlock vault with decrypted PIN
        return await this.unlock(pin);
      } catch (err) {
        console.error('Biometric assertion error:', err);
        return { success: false, error: err.message || 'Biometric authentication cancelled' };
      }
    }

    /**
     * Setup auto-lock listeners
     */
    _initAutoLock() {
      let hiddenTimestamp = null;

      if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            hiddenTimestamp = Date.now();
          } else {
            if (hiddenTimestamp && (Date.now() - hiddenTimestamp > this.autoLockTimeoutMs)) {
              if (!this.isLocked && this.isConfigured()) {
                this.lock();
              }
            }
            hiddenTimestamp = null;
          }
        });
      }

      // Track user interactions
      const markActive = () => {
        this.lastActiveTime = Date.now();
      };
      if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('click', markActive, { passive: true });
        window.addEventListener('touchstart', markActive, { passive: true });
        window.addEventListener('keydown', markActive, { passive: true });
      }
    }
  }

  window.WalletSecurity = new WalletSecurityEngine();
})(window);
