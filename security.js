/**
 * ApexWallet Security & Cryptography Engine
 * 
 * Cryptographic Architecture & Threat Model:
 * 
 * 1. Native Android Architecture (High Security - Hardware Keystore Bound):
 *    - Master Vault Encryption: AES-256-GCM authenticated encryption.
 *    - Key Derivation: PBKDF2-HMAC-SHA256 with 100,000 iterations and a cryptographically secure 16-byte salt.
 *    - Biometric Protection: Handled natively via AndroidKeyStore (TEE / StrongBox).
 *      An AES-256-GCM key is generated with setUserAuthenticationRequired(true) and invalidatedByBiometricEnrollment(true).
 *      PIN decryption is impossible without a valid BiometricPrompt.CryptoObject hardware match.
 *      No plaintext bioKey or PIN is stored in localStorage or WebKit disk storage.
 *    - SMS Queue Protection: BankSmsQueue is protected by Android Keystore MasterKey (AES-256-GCM EncryptedSharedPreferences).
 *    - Recovery Guarantee: Manual 4-digit PIN unlock is completely independent from biometrics.
 *      If biometric credentials are changed, invalidated, or deleted in Android OS Settings,
 *      the user simply unlocks with their manual PIN with 0 data loss and can re-enroll biometrics.
 * 
 * 2. Web / Browser PWA Architecture (Standard Browser Security & Documented Boundaries):
 *    - Master Vault Encryption: WebCrypto AES-256-GCM with 100,000 PBKDF2 iterations.
 *    - Biometric Verification: WebAuthn (FIDO2 / Platform Authenticator) confirms physical user presence.
 *    - Browser Boundary & Honest Limitations: Pure browsers (PWA) lack hardware Keystore access for custom key wrapping
 *      without the experimental WebAuthn PRF extension. In web mode, the manual PIN is the primary cryptographic root
 *      of trust. The WebAuthn key confirms user presence, while the vault remains securely encrypted by the PIN-derived key.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'apexwallet_security_vault_v1';
  const BIOMETRIC_KEY = 'apexwallet_biometrics_v1';
  const BIOMETRIC_QUARANTINE_KEY = 'apexwallet_biometrics_quarantine_v1';
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

  function getNativeSmsPlugin() {
    if (typeof window !== 'undefined' &&
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform() &&
        window.Capacitor.Plugins &&
        window.Capacitor.Plugins.BankSms) {
      return window.Capacitor.Plugins.BankSms;
    }
    return null;
  }

  class WalletSecurityEngine {
    constructor() {
      this.activeKey = null;
      this.isLocked = true;
      this.onLockStateChange = null;
      this.lastActiveTime = Date.now();
      const savedTimeout = localStorage.getItem(AUTOLOCK_KEY);
      this.autoLockTimeoutMs = savedTimeout !== null ? parseInt(savedTimeout, 10) : 3 * 60 * 1000;
      this._migrateLegacyInsecureBiometrics();
      this._initAutoLock();
    }

    /**
     * Item 5: Migrate and purge legacy insecure web biometrics storing bioKey in localStorage
     */
    _migrateLegacyInsecureBiometrics() {
      try {
        if (typeof localStorage === 'undefined') return;
        const bioRaw = localStorage.getItem(BIOMETRIC_KEY);
        if (bioRaw) {
          const bioData = JSON.parse(bioRaw);
          // If record has stored bioKey or is not backed by Keystore or WebAuthn PRF:
          if (bioData && (bioData.bioKey || (!bioData.isKeystoreBound && !bioData.isWebAuthnPrf))) {
            localStorage.removeItem(BIOMETRIC_KEY);
            localStorage.setItem('apexwallet_bio_migrated_notice', 'true');
            console.warn('Security migration: Purged legacy insecure biometric record from localStorage.');
          }
        }
      } catch (e) {
        console.warn('Biometric migration notice:', e);
      }
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
          const nativePlugin = getNativeSmsPlugin();
          if (nativePlugin && typeof nativePlugin.setupBiometricPin === 'function') {
            await nativePlugin.setupBiometricPin({
              pin: newPin,
              title: 'تحديث رمز PIN للبصمة',
              subtitle: 'المس مستشعر البصمة لحفظ رمز الـ PIN الجديد في عتاد الجهاز',
              negativeButtonText: 'إلغاء'
            });
          } else {
            // In web mode, updating PIN clears biometric cache; user re-enables with their biometric sensor
            localStorage.removeItem(BIOMETRIC_KEY);
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
      localStorage.removeItem(BIOMETRIC_QUARANTINE_KEY);
      localStorage.removeItem(AUTOLOCK_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      if (this.onLockStateChange) this.onLockStateChange(true);
    }

    isBiometricsQuarantined() {
      const raw = localStorage.getItem(BIOMETRIC_QUARANTINE_KEY);
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        return !!(parsed && parsed.quarantined === true);
      } catch (e) {
        return true;
      }
    }

    _setBiometricsQuarantine(reason) {
      localStorage.setItem(BIOMETRIC_QUARANTINE_KEY, JSON.stringify({
        quarantined: true,
        updatedAt: new Date().toISOString(),
        reason: String(reason || 'cleanup_failed')
      }));
    }

    _clearBiometricsQuarantine() {
      localStorage.removeItem(BIOMETRIC_QUARANTINE_KEY);
    }

    /**
     * Check if Biometrics is currently enabled by user (fail-closed if quarantined)
     */
    isBiometricsEnabled() {
      if (this.isBiometricsQuarantined()) return false;
      const raw = localStorage.getItem(BIOMETRIC_KEY);
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed) return false;
        // Native Android Keystore bound
        if (parsed.credId === 'native_android_keystore' || parsed.isKeystoreBound) {
          return true;
        }
        // WebAuthn PRF hardware-derived key bound
        if (parsed.isWebAuthnPrf && parsed.credId && parsed.prfSalt && parsed.encryptedPin) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }

    /**
     * Check if device supports Biometrics (Native Android BiometricPrompt or Web WebAuthn)
     */
    async isBiometricsAvailable() {
      const nativePlugin = getNativeSmsPlugin();
      if (nativePlugin && typeof nativePlugin.isBiometricAvailable === 'function') {
        try {
          const res = await nativePlugin.isBiometricAvailable();
          return !!(res && res.isAvailable);
        } catch (e) {
          console.warn('Native biometric check error:', e);
          return false;
        }
      }

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
     * Enable Biometrics (Hardware Keystore on Android or WebAuthn on Browser)
     */
    async enableBiometrics(currentPin) {
      if (!this.isConfigured()) {
        return { success: false, error: 'Security PIN is not set up' };
      }
      if (this.isBiometricsQuarantined()) {
        return { success: false, quarantined: true, error: 'Biometric cleanup pending retry' };
      }

      // Verify current PIN first against PBKDF2 verifier
      const rawVault = localStorage.getItem(STORAGE_KEY);
      const securityRecord = JSON.parse(rawVault);
      const calculatedVerifier = await this._computeVerifier(currentPin, securityRecord.salt);
      if (calculatedVerifier !== securityRecord.verifier) {
        return { success: false, error: 'Incorrect PIN' };
      }

      const nativePlugin = getNativeSmsPlugin();
      if (nativePlugin && typeof nativePlugin.setupBiometricPin === 'function') {
        try {
          const authRes = await nativePlugin.setupBiometricPin({
            pin: currentPin,
            title: 'تفعيل فتح المحفظة بالبصمة',
            subtitle: 'المس مستشعر البصمة لحماية مفتاح فك التشفير في عتاد الجهاز',
            negativeButtonText: 'إلغاء'
          });

          if (!authRes || !authRes.success) {
            return {
              success: false,
              error: (authRes && authRes.error) || 'تم إلغاء المصادقة بالبصمة'
            };
          }

          // Hardware Keystore binding:
          // The PIN is encrypted with AES-256 inside AndroidKeyStore requiring biometric authentication.
          // No bioKey or plaintext PIN is stored in localStorage.
          const bioRecord = {
            credId: 'native_android_keystore',
            isKeystoreBound: true,
            enabledAt: new Date().toISOString()
          };

          localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(bioRecord));
          return { success: true };
        } catch (err) {
          console.error('Native biometric Keystore enable error:', err);
          return { success: false, error: err.message || 'فشل إعداد البصمة' };
        }
      }

      // WebAuthn Browser Fallback
      if (typeof navigator === 'undefined' || !navigator.credentials || !navigator.credentials.create) {
        return { success: false, error: 'Biometric WebAuthn not supported on this browser' };
      }

      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const userId = crypto.getRandomValues(new Uint8Array(16));

        const prfSalt = crypto.getRandomValues(new Uint8Array(32));
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
            attestation: 'none',
            extensions: {
              prf: {
                eval: {
                  first: prfSalt
                }
              }
            }
          }
        });

        if (!credential) {
          return { success: false, error: 'Biometric registration was cancelled' };
        }

        const extResults = credential.getClientExtensionResults ? credential.getClientExtensionResults() : {};
        const prfKeyBytes = extResults.prf && extResults.prf.results && extResults.prf.results.first;

        // If authenticator hardware does not support PRF key derivation:
        if (!prfKeyBytes) {
          return {
            success: false,
            error: 'عتاد البصمة أو المتصفح الحالي لا يدعم مفاتيح WebAuthn PRF المشفرة. لحماية أمان بياناتك، يرجى استخدام رمز الـ PIN للدخول.'
          };
        }

        // Import PRF hardware-derived key (NEVER stored on disk / in localStorage)
        const bioCryptoKey = await crypto.subtle.importKey(
          'raw',
          prfKeyBytes,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const enc = new TextEncoder();
        const encryptedPinBuffer = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv },
          bioCryptoKey,
          enc.encode(currentPin)
        );

        // Pack IV + ciphertext
        const packed = new Uint8Array(iv.length + encryptedPinBuffer.byteLength);
        packed.set(iv);
        packed.set(new Uint8Array(encryptedPinBuffer), iv.length);

        // NOTICE: ZERO bioKey is stored in localStorage!
        const bioRecord = {
          credId: bufToB64(credential.rawId),
          prfSalt: bufToB64(prfSalt),
          encryptedPin: bufToB64(packed),
          isWebAuthnPrf: true,
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
     * Disable Biometrics with verified native cleanup and fail-closed quarantine on failure
     */
    async disableBiometrics() {
      let existingRecord = null;
      try {
        const rawBio = localStorage.getItem(BIOMETRIC_KEY);
        existingRecord = rawBio ? JSON.parse(rawBio) : null;
      } catch (e) {}

      const isNativeEnv = (typeof window !== 'undefined' &&
        window.Capacitor &&
        typeof window.Capacitor.isNativePlatform === 'function' &&
        window.Capacitor.isNativePlatform());
      const wasKeystoreBound = !!(existingRecord && (existingRecord.isKeystoreBound || existingRecord.credId === 'native_android_keystore'));
      const wasQuarantined = this.isBiometricsQuarantined();
      const nativePlugin = getNativeSmsPlugin();

      if (nativePlugin && typeof nativePlugin.clearBiometricPin === 'function') {
        try {
          const res = await nativePlugin.clearBiometricPin();
          let aliasPresent = res ? res.aliasPresent : undefined;
          let recordPresent = res ? res.recordPresent : undefined;

          if (recordPresent === undefined && typeof nativePlugin.hasBiometricPin === 'function') {
            const checkRes = await nativePlugin.hasBiometricPin();
            recordPresent = checkRes ? !!checkRes.hasRecord : true;
          }

          if (res && res.success === true && aliasPresent === false && recordPresent === false) {
            localStorage.removeItem(BIOMETRIC_KEY);
            this._clearBiometricsQuarantine();
            return { success: true, aliasPresent: false, recordPresent: false };
          }

          const errMsg = (res && res.error) ? String(res.error) : 'Native biometric cleanup not verified';
          localStorage.removeItem(BIOMETRIC_KEY);
          this._setBiometricsQuarantine(errMsg);
          return {
            success: false,
            quarantined: true,
            aliasPresent: aliasPresent !== false,
            recordPresent: recordPresent !== false,
            error: errMsg
          };
        } catch (e) {
          const errMsg = (e && e.message) ? String(e.message) : 'Error clearing native biometric pin';
          console.warn('Error clearing native biometric pin:', errMsg);
          localStorage.removeItem(BIOMETRIC_KEY);
          this._setBiometricsQuarantine(errMsg);
          return { success: false, quarantined: true, error: errMsg };
        }
      }

      // If native platform/keystore-bound/quarantined state requires native cleanup but module is absent -> fail closed
      if (isNativeEnv || wasKeystoreBound || wasQuarantined) {
        const errMsg = 'Native biometric module unavailable for cleanup';
        localStorage.removeItem(BIOMETRIC_KEY);
        this._setBiometricsQuarantine(errMsg);
        return { success: false, quarantined: true, error: errMsg };
      }

      // Web-only / unit-test mode (no native keystore record)
      localStorage.removeItem(BIOMETRIC_KEY);
      this._clearBiometricsQuarantine();
      return { success: true };
    }

    async retryBiometricCleanup() {
      if (!this.isBiometricsQuarantined()) {
        return { success: true, quarantined: false };
      }
      return await this.disableBiometrics();
    }

    /**
     * Unlock using Biometrics (Native Android Keystore-bound BiometricPrompt or Web WebAuthn)
     */
    async unlockWithBiometrics() {
      if (this.isBiometricsQuarantined()) {
        return { success: false, quarantined: true, error: 'Biometrics is disabled pending cleanup' };
      }
      if (!this.isBiometricsEnabled()) {
        return { success: false, error: 'Biometrics is not enabled' };
      }

      const rawBio = localStorage.getItem(BIOMETRIC_KEY);
      const bioData = rawBio ? JSON.parse(rawBio) : {};
      const nativePlugin = getNativeSmsPlugin();

      // Native Android Keystore CryptoObject Route
      if (nativePlugin && typeof nativePlugin.unlockWithBiometricPin === 'function') {
        try {
          const authRes = await nativePlugin.unlockWithBiometricPin({
            title: 'فتح محفظة ApexWallet',
            subtitle: 'استخدم بصمة الإصبع أو الوجه لفك تشفير المحفظة',
            negativeButtonText: 'استخدام رمز PIN'
          });

          if (!authRes || !authRes.success) {
            if (authRes && authRes.invalidated) {
              // Biometric credentials changed in Android Settings (Condition B)
              // Safe recovery without data loss: delete invalid record and route user to manual PIN
              localStorage.removeItem(BIOMETRIC_KEY);
              return {
                success: false,
                invalidated: true,
                error: authRes.error || 'تم تغيير بصمات الجهاز في إعدادات النظام. يرجى الدخول برمز الـ PIN يدوياً.'
              };
            }
            return {
              success: false,
              error: (authRes && authRes.error) || 'تم إلغاء المصادقة'
            };
          }

          if (!authRes.pin) {
            return { success: false, error: 'لم يتم استرجاع رمز PIN من العتاد الآمن' };
          }

          // Unlock vault with decrypted PIN
          const pin = authRes.pin;
          authRes.pin = null; // immediately zero out in memory
          return await this.unlock(pin);
        } catch (err) {
          console.error('Native biometric Keystore unlock error:', err);
          return { success: false, error: err.message || 'فشلت المصادقة بالبصمة' };
        }
      }

      // WebAuthn Browser Fallback with PRF (Item 5)
      if (typeof navigator === 'undefined' || !navigator.credentials || !navigator.credentials.get) {
        return { success: false, error: 'WebAuthn not supported' };
      }

      if (!bioData.isWebAuthnPrf || !bioData.prfSalt) {
        localStorage.removeItem(BIOMETRIC_KEY);
        return {
          success: false,
          error: 'تم تحديث نظام حماية البصمة لنسخة الويب. يرجى الدخول برمز الـ PIN وإعادة تفعيل البصمة.'
        };
      }

      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const credIdBytes = b64ToBuf(bioData.credId);
        const prfSalt = b64ToBuf(bioData.prfSalt);

        const assertion = await navigator.credentials.get({
          publicKey: {
            challenge: challenge,
            rpId: window.location.hostname,
            allowCredentials: [{
              id: credIdBytes,
              type: 'public-key',
              transports: ['internal']
            }],
            userVerification: 'required',
            timeout: 60000,
            extensions: {
              prf: {
                eval: {
                  first: prfSalt
                }
              }
            }
          }
        });

        if (!assertion) {
          return { success: false, error: 'Biometric verification cancelled' };
        }

        const extResults = assertion.getClientExtensionResults ? assertion.getClientExtensionResults() : {};
        const prfKeyBytes = extResults.prf && extResults.prf.results && extResults.prf.results.first;

        if (!prfKeyBytes) {
          return { success: false, error: 'لم يتمكن مستشعر البصمة من استرجاع مفتاح فك التشفير الآمن' };
        }

        const bioCryptoKey = await crypto.subtle.importKey(
          'raw',
          prfKeyBytes,
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
        console.error('WebAuthn unlock error:', err);
        return { success: false, error: err.message || 'Biometric authentication failed' };
      }
    }

    /**
     * Item 4: Encrypt backup file with strong PBKDF2 + AES-256-GCM using user passphrase
     */
    async encryptBackup(dataObject, passphrase) {
      if (!passphrase || !passphrase.trim()) {
        return {
          app: 'ApexWallet',
          version: '1.4.8',
          encrypted: false,
          format: 'apexwallet_plaintext_backup_v2',
          exportedAt: new Date().toISOString(),
          data: dataObject
        };
      }

      const enc = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(passphrase.trim()),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      const aesKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      const plaintext = enc.encode(JSON.stringify(dataObject));
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        aesKey,
        plaintext
      );

      return {
        app: 'ApexWallet',
        version: '1.4.8',
        encrypted: true,
        format: 'apexwallet_encrypted_backup_v2',
        exportedAt: new Date().toISOString(),
        kdf: {
          algorithm: 'PBKDF2',
          hash: 'SHA-256',
          iterations: 100000,
          salt: bufToB64(salt)
        },
        cipher: {
          algorithm: 'AES-GCM',
          iv: bufToB64(iv),
          ciphertext: bufToB64(ciphertext)
        }
      };
    }

    /**
     * Item 4: Decrypt backup file using passphrase (or return plaintext / legacy v1)
     */
    async decryptBackup(backupEnvelope, passphrase) {
      if (!backupEnvelope) {
        throw new Error('ملف النسخة الاحتياطية فارغ أو غير صالح.');
      }

      // Plaintext v2 format
      if (backupEnvelope.format === 'apexwallet_plaintext_backup_v2' || backupEnvelope.encrypted === false) {
        return backupEnvelope.data || backupEnvelope;
      }

      // Encrypted v2 format
      if (backupEnvelope.format === 'apexwallet_encrypted_backup_v2' || (backupEnvelope.encrypted === true && backupEnvelope.cipher)) {
        if (!passphrase || !passphrase.trim()) {
          throw new Error('هذه النسخة الاحتياطية مشفرة بعبارة مرور. يرجى إدخال عبارة المرور لفك التشفير.');
        }

        const salt = b64ToBuf(backupEnvelope.kdf.salt);
        const iv = b64ToBuf(backupEnvelope.cipher.iv);
        const iterations = (backupEnvelope.kdf && backupEnvelope.kdf.iterations) || 100000;
        const ciphertext = b64ToBuf(backupEnvelope.cipher.ciphertext);

        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
          'raw',
          enc.encode(passphrase.trim()),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );

        const aesKey = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        try {
          const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            aesKey,
            ciphertext
          );
          const dec = new TextDecoder();
          return JSON.parse(dec.decode(decrypted));
        } catch (e) {
          throw new Error('عبارة المرور غير صحيحة أو تم التلاعب بملف النسخة الاحتياطية.');
        }
      }

      // Legacy v1 backup format
      if (backupEnvelope.securityVault || backupEnvelope.userStore) {
        return backupEnvelope;
      }

      throw new Error('تنسيق ملف النسخة الاحتياطية غير مدعوم أو تالف.');
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
  window.walletSecurity = window.WalletSecurity; // Parity alias for lowercase references

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WalletSecurity: window.WalletSecurity, WalletSecurityEngine };
  }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
