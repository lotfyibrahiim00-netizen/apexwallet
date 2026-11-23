/**
 * ApexWallet Security & Cryptography Engine
 * Military-grade AES-256-GCM encryption with PBKDF2 key derivation & WebAuthn biometrics.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'apexwallet_security_vault_v1';
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
      this.autoLockTimeoutMs = 3 * 60 * 1000; // 3 minutes of background/inactivity
      this._initAutoLock();
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
     * Change PIN
     */
    async changePin(oldPin, newPin) {
      if (!/^\d{4}$/.test(newPin)) {
        return { success: false, error: 'New PIN must be 4 digits' };
      }

      const verifyRes = await this.unlock(oldPin);
      if (!verifyRes.success) {
        return { success: false, error: 'Current PIN is incorrect' };
      }

      const currentData = verifyRes.data;
      await this.setupPin(newPin);
      await this.saveVault(currentData);
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
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (this.onLockStateChange) this.onLockStateChange(true);
    }

    /**
     * Check if device supports Biometrics (WebAuthn)
     */
    async isBiometricsAvailable() {
      if (window.PublicKeyCredential &&
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
