package com.apexwallet.app.sms;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyPermanentlyInvalidatedException;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;
import org.json.JSONException;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executor;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/**
 * Capacitor bridge plugin for Bank SMS Transaction Import.
 * Exposes Keystore-backed queue, permission states, sender allowlists,
 * and candidate transaction review to JavaScript.
 */
@CapacitorPlugin(
        name = "BankSms",
        permissions = {
                @Permission(
                        strings = { Manifest.permission.RECEIVE_SMS },
                        alias = "receiveSms"
                ),
                @Permission(
                        strings = { Manifest.permission.READ_SMS },
                        alias = "readSms"
                )
        }
)
public class BankSmsPlugin extends Plugin {

    private BankSmsQueue mQueue;

    @Override
    public void load() {
        super.load();
        mQueue = BankSmsQueue.getInstance(getContext());

        // Register listener for live notifications to foreground webview
        BankSmsReceiver.setListener(candidate -> {
            if (candidate != null) {
                try {
                    JSObject ret = JSObject.fromJSONObject(candidate.toJsonObject());
                    notifyListeners("onNewCandidate", ret);
                } catch (JSONException ignored) {}
            }
        });
    }

    @PluginMethod
    public void checkPermission(PluginCall call) {
        boolean receiveGranted = ContextCompat.checkSelfPermission(
                getContext(),
                Manifest.permission.RECEIVE_SMS
        ) == PackageManager.PERMISSION_GRANTED;

        boolean readGranted = ContextCompat.checkSelfPermission(
                getContext(),
                Manifest.permission.READ_SMS
        ) == PackageManager.PERMISSION_GRANTED;

        JSObject ret = new JSObject();
        ret.put("status", receiveGranted ? "granted" : "prompt");
        ret.put("granted", receiveGranted);
        ret.put("receiveSms", receiveGranted);
        ret.put("readSms", readGranted);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED) {
            JSObject ret = new JSObject();
            ret.put("status", "granted");
            ret.put("granted", true);
            call.resolve(ret);
            return;
        }

        requestPermissionForAlias("receiveSms", call, "permissionCallback");
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        boolean granted = ContextCompat.checkSelfPermission(
                getContext(),
                Manifest.permission.RECEIVE_SMS
        ) == PackageManager.PERMISSION_GRANTED;

        JSObject ret = new JSObject();
        ret.put("status", granted ? "granted" : "denied");
        ret.put("granted", granted);
        call.resolve(ret);
    }

    @PluginMethod
    public void requestReadSmsPermission(PluginCall call) {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED) {
            JSObject ret = new JSObject();
            ret.put("status", "granted");
            ret.put("granted", true);
            call.resolve(ret);
            return;
        }

        requestPermissionForAlias("readSms", call, "readSmsPermissionCallback");
    }

    @PermissionCallback
    private void readSmsPermissionCallback(PluginCall call) {
        boolean granted = ContextCompat.checkSelfPermission(
                getContext(),
                Manifest.permission.READ_SMS
        ) == PackageManager.PERMISSION_GRANTED;

        JSObject ret = new JSObject();
        ret.put("status", granted ? "granted" : "denied");
        ret.put("granted", granted);
        call.resolve(ret);
    }

    @PluginMethod
    public void openAppSettings(PluginCall call) {
        try {
            android.content.Intent intent = new android.content.Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            intent.setData(android.net.Uri.fromParts("package", getContext().getPackageName(), null));
            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not open settings: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void openBatterySettings(PluginCall call) {
        try {
            android.content.Intent intent = new android.content.Intent();
            intent.setAction(android.provider.Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } catch (Exception e) {
            openAppSettings(call);
        }
    }

    /**
     * Queries past SMS from device inbox with strict bank allowlist filtering,
     * in-memory OTP/promo rejection, SHA-256 deduplication, and safe non-skipping batching.
     * Raw message text is NEVER retained or logged.
     */
    @PluginMethod
    public void queryHistoricalSms(PluginCall call) {
        boolean hasReadPermission = ContextCompat.checkSelfPermission(
                getContext(),
                Manifest.permission.READ_SMS
        ) == PackageManager.PERMISSION_GRANTED;

        if (!hasReadPermission) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", "PERMISSION_DENIED");
            ret.put("message", "صلاحية قراءة الرسائل (READ_SMS) غير ممنوحة.");
            call.resolve(ret);
            return;
        }

        int days = call.getInt("days", 30);
        int batchLimit = call.getInt("limit", 20);

        JSArray excludeArray = call.getArray("excludeFingerprints");
        Set<String> excludeSet = new HashSet<>();
        if (excludeArray != null) {
            for (int i = 0; i < excludeArray.length(); i++) {
                try {
                    excludeSet.add(excludeArray.getString(i));
                } catch (JSONException ignored) {}
            }
        }

        long cutoffTimestamp = System.currentTimeMillis() - (days * 24L * 60L * 60L * 1000L);
        Set<String> allowlist = mQueue.getBankAllowlist();

        List<JSObject> candidates = new ArrayList<>();
        List<CandidateTransaction> candidatesToEnqueue = new ArrayList<>();
        int rejectedOtpOrPromo = 0;
        int duplicateCount = 0;
        boolean hasMore = false;

        android.content.ContentResolver cr = getContext().getContentResolver();
        android.net.Uri inboxUri = android.net.Uri.parse("content://sms/inbox");

        String[] projection = new String[] { "_id", "address", "body", "date" };
        String selection = "date >= ?";
        String[] selectionArgs = new String[] { String.valueOf(cutoffTimestamp) };
        String sortOrder = "date DESC";

        try (android.database.Cursor cursor = cr.query(inboxUri, projection, selection, selectionArgs, sortOrder)) {
            if (cursor != null && cursor.moveToFirst()) {
                int addressIdx = cursor.getColumnIndex("address");
                int bodyIdx = cursor.getColumnIndex("body");
                int dateIdx = cursor.getColumnIndex("date");

                do {
                    String sender = cursor.getString(addressIdx);
                    if (sender == null || sender.trim().isEmpty()) continue;

                    // 1. Strict Allowlist Filter
                    if (!BankSmsParser.isSenderAllowed(sender, allowlist)) {
                        continue;
                    }

                    String body = cursor.getString(bodyIdx);
                    if (body == null || body.trim().isEmpty()) continue;

                    // 2. Parse strictly in memory (rejects OTP, promo, balance-only)
                    CandidateTransaction candidate = BankSmsParser.parse(sender, body);
                    if (candidate == null) {
                        rejectedOtpOrPromo++;
                        continue;
                    }

                    String fp = candidate.getFingerprint();

                    // 3. Skip if already processed in queue history
                    if (mQueue.isDuplicate(fp)) {
                        duplicateCount++;
                        continue;
                    }

                    // 4. Skip if currently pending in user's review inbox
                    if (excludeSet.contains(fp)) {
                        continue;
                    }

                    // Collect up to batchLimit
                    if (candidates.size() < batchLimit) {
                        try {
                            candidates.add(JSObject.fromJSONObject(candidate.toJsonObject()));
                            candidatesToEnqueue.add(candidate);
                        } catch (JSONException ignored) {}
                    } else {
                        // Found at least one more un-reviewed transaction in window
                        hasMore = true;
                        break;
                    }

                } while (cursor.moveToNext());
            }

            // Persist the newly imported batch into the native Keystore-backed queue
            // so they survive app restarts without silent drops
            if (!candidatesToEnqueue.isEmpty()) {
                mQueue.enqueueBatch(candidatesToEnqueue);
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            JSArray arr = new JSArray();
            for (JSObject obj : candidates) {
                arr.put(obj);
            }
            ret.put("candidates", arr);
            ret.put("batchCount", arr.length());
            ret.put("hasMore", hasMore);
            ret.put("rejectedCount", rejectedOtpOrPromo);
            ret.put("duplicateCount", duplicateCount);
            call.resolve(ret);

        } catch (Exception e) {
            Log.e("BankSmsPlugin", "Error scanning historical SMS inbox", e);
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void isSmsImportEnabled(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("enabled", mQueue.isSmsImportEnabled());
        ret.put("keystoreProtected", mQueue.isKeystoreProtected());
        call.resolve(ret);
    }

    @PluginMethod
    public void setSmsImportEnabled(PluginCall call) {
        Boolean enabled = call.getBoolean("enabled");
        if (enabled == null) {
            call.reject("Missing required parameter: enabled");
            return;
        }
        mQueue.setSmsImportEnabled(enabled);

        JSObject ret = new JSObject();
        ret.put("enabled", enabled);
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void getPendingTransactions(PluginCall call) {
        JSONArray pendingJson = mQueue.peekPendingJson();
        JSArray arr = new JSArray();
        for (int i = 0; i < pendingJson.length(); i++) {
            try {
                arr.put(JSObject.fromJSONObject(pendingJson.getJSONObject(i)));
            } catch (JSONException ignored) {}
        }

        JSObject ret = new JSObject();
        ret.put("pending", arr);
        ret.put("count", arr.length());
        call.resolve(ret);
    }

    @PluginMethod
    public void acknowledgeTransactions(PluginCall call) {
        JSArray idsArray = call.getArray("ids");
        if (idsArray == null) {
            call.reject("Missing required parameter: ids");
            return;
        }

        List<String> ids = new ArrayList<>();
        for (int i = 0; i < idsArray.length(); i++) {
            try {
                ids.add(idsArray.getString(i));
            } catch (JSONException ignored) {}
        }

        int removed = mQueue.acknowledge(ids);

        JSObject ret = new JSObject();
        ret.put("acknowledgedCount", removed);
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void getAllowlist(PluginCall call) {
        Set<String> list = mQueue.getBankAllowlist();
        JSArray arr = new JSArray();
        for (String s : list) {
            arr.put(s);
        }

        JSObject ret = new JSObject();
        ret.put("allowlist", arr);
        call.resolve(ret);
    }

    @PluginMethod
    public void setAllowlist(PluginCall call) {
        JSArray arr = call.getArray("allowlist");
        if (arr == null) {
            call.reject("Missing required parameter: allowlist");
            return;
        }

        Set<String> set = new HashSet<>();
        for (int i = 0; i < arr.length(); i++) {
            try {
                set.add(arr.getString(i));
            } catch (JSONException ignored) {}
        }
        mQueue.setBankAllowlist(set);

        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("count", set.size());
        call.resolve(ret);
    }

    @PluginMethod
    public void getStats(PluginCall call) {
        try {
            JSObject ret = JSObject.fromJSONObject(mQueue.getStats());
            call.resolve(ret);
        } catch (JSONException e) {
            call.reject("Error retrieving stats", e);
        }
    }

    @PluginMethod
    public void clearQueue(PluginCall call) {
        mQueue.clear();
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    /**
     * Testing and simulation endpoint: parses fabricated SMS without cellular reception.
     */
    @PluginMethod
    public void simulateSms(PluginCall call) {
        String sender = call.getString("sender", "CIB");
        String body = call.getString("body");

        if (body == null || body.trim().isEmpty()) {
            call.reject("Missing body parameter");
            return;
        }

        CandidateTransaction candidate = BankSmsParser.parse(sender, body);
        JSObject ret = new JSObject();
        if (candidate != null) {
            boolean enqueued = mQueue.enqueue(candidate);
            ret.put("parsed", true);
            ret.put("enqueued", enqueued);
            try {
                ret.put("candidate", JSObject.fromJSONObject(candidate.toJsonObject()));
            } catch (JSONException ignored) {}
        } else {
            ret.put("parsed", false);
            ret.put("enqueued", false);
            ret.put("reason", "Rejected: Non-transaction, OTP, promo, or unparseable format");
        }
        call.resolve(ret);
    }

    private static final String BIOMETRIC_KEY_ALIAS = "ApexWalletBiometricAuthKey_v1";

    private SecretKey getOrCreateBiometricKey() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        if (!keyStore.containsAlias(BIOMETRIC_KEY_ALIAS)) {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(
                    KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
            KeyGenParameterSpec.Builder builder = new KeyGenParameterSpec.Builder(
                    BIOMETRIC_KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .setKeySize(256)
                    .setUserAuthenticationRequired(true);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                builder.setUserAuthenticationParameters(0, KeyProperties.AUTH_BIOMETRIC_STRONG);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                builder.setInvalidatedByBiometricEnrollment(true);
            }
            keyGenerator.init(builder.build());
            keyGenerator.generateKey();
        }
        return (SecretKey) keyStore.getKey(BIOMETRIC_KEY_ALIAS, null);
    }

    /**
     * Safely migrates and enqueues candidate transactions into the Keystore queue.
     */
    @PluginMethod
    public void enqueueCandidates(PluginCall call) {
        JSArray arr = call.getArray("candidates");
        if (arr == null) {
            call.reject("candidates array is required");
            return;
        }
        List<CandidateTransaction> list = new ArrayList<>();
        for (int i = 0; i < arr.length(); i++) {
            try {
                list.add(CandidateTransaction.fromJsonObject(arr.getJSONObject(i)));
            } catch (JSONException ignored) {}
        }
        List<String> confirmed = mQueue.enqueueBatch(list);
        JSObject ret = new JSObject();
        ret.put("success", true);
        ret.put("addedCount", confirmed.size());
        JSArray confirmedArr = new JSArray();
        for (String fp : confirmed) {
            confirmedArr.put(fp);
        }
        ret.put("confirmedFingerprints", confirmedArr);
        call.resolve(ret);
    }

    /**
     * Check if hardware biometric authentication (Fingerprint / Face ID) is supported and enrolled.
     */
    @PluginMethod
    public void isBiometricAvailable(PluginCall call) {
        try {
            BiometricManager biometricManager = BiometricManager.from(getContext());
            int strongAuth = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG);
            int anyAuth = biometricManager.canAuthenticate(
                    BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.BIOMETRIC_WEAK
            );
            boolean isStrongAvailable = (strongAuth == BiometricManager.BIOMETRIC_SUCCESS);
            boolean isAnyAvailable = (anyAuth == BiometricManager.BIOMETRIC_SUCCESS);

            JSObject ret = new JSObject();
            ret.put("isAvailable", isStrongAvailable || isAnyAvailable);
            ret.put("isStrongAvailable", isStrongAvailable);
            ret.put("hasKeystoreRecord", mQueue.hasBiometricPinRecord());
            ret.put("statusCode", strongAuth);
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("isAvailable", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    /**
     * Hardware Keystore-bound Biometric Setup:
     * Generates AES-256 key in Android KeyStore requiring biometric auth,
     * encrypts PIN via BiometricPrompt.CryptoObject, and saves IV + ciphertext in EncryptedSharedPreferences.
     */
    @PluginMethod
    public void setupBiometricPin(PluginCall call) {
        String pin = call.getString("pin");
        if (pin == null || pin.isEmpty()) {
            call.reject("PIN is required for biometric setup");
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                if (!(getActivity() instanceof FragmentActivity)) {
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", "Host activity is not a FragmentActivity");
                    call.resolve(ret);
                    return;
                }

                // Delete old key if exists to ensure key is bound to current biometric enrollment
                KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
                keyStore.load(null);
                if (keyStore.containsAlias(BIOMETRIC_KEY_ALIAS)) {
                    keyStore.deleteEntry(BIOMETRIC_KEY_ALIAS);
                }

                SecretKey secretKey = getOrCreateBiometricKey();
                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                cipher.init(Cipher.ENCRYPT_MODE, secretKey);
                BiometricPrompt.CryptoObject cryptoObject = new BiometricPrompt.CryptoObject(cipher);

                Executor executor = ContextCompat.getMainExecutor(getActivity());
                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle(call.getString("title", "تفعيل فتح المحفظة بالبصمة"))
                        .setSubtitle(call.getString("subtitle", "المس مستشعر البصمة لحماية مفتاح فك التشفير في عتاد الجهاز"))
                        .setNegativeButtonText(call.getString("negativeButtonText", "إلغاء"))
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
                        .build();

                BiometricPrompt biometricPrompt = new BiometricPrompt(
                        (FragmentActivity) getActivity(),
                        executor,
                        new BiometricPrompt.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                                super.onAuthenticationError(errorCode, errString);
                                JSObject ret = new JSObject();
                                ret.put("success", false);
                                ret.put("error", errString.toString());
                                ret.put("cancelled", errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON || errorCode == BiometricPrompt.ERROR_USER_CANCELED);
                                call.resolve(ret);
                            }

                            @Override
                            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                super.onAuthenticationSucceeded(result);
                                try {
                                    Cipher authenticatedCipher = result.getCryptoObject() != null ? result.getCryptoObject().getCipher() : null;
                                    if (authenticatedCipher == null) {
                                        throw new IllegalStateException("CryptoObject cipher unavailable");
                                    }
                                    byte[] iv = authenticatedCipher.getIV();
                                    byte[] encryptedPin = authenticatedCipher.doFinal(pin.getBytes(StandardCharsets.UTF_8));

                                    String ivB64 = Base64.encodeToString(iv, Base64.NO_WRAP);
                                    String encPinB64 = Base64.encodeToString(encryptedPin, Base64.NO_WRAP);

                                    mQueue.saveBiometricPinRecord(ivB64, encPinB64);

                                    JSObject ret = new JSObject();
                                    ret.put("success", true);
                                    ret.put("isKeystoreBound", true);
                                    call.resolve(ret);
                                } catch (Exception e) {
                                    JSObject ret = new JSObject();
                                    ret.put("success", false);
                                    ret.put("error", "Encryption error: " + e.getMessage());
                                    call.resolve(ret);
                                }
                            }

                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                            }
                        }
                );

                biometricPrompt.authenticate(promptInfo, cryptoObject);

            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", "Setup error: " + e.getMessage());
                call.resolve(ret);
            }
        });
    }

    /**
     * Hardware Keystore-bound Biometric Unlock:
     * Authorizes decryption of PIN via BiometricPrompt.CryptoObject.
     * If device biometrics changed in Android settings, catches KeyPermanentlyInvalidatedException
     * and safely routes user to unlock with manual PIN without data loss.
     */
    @PluginMethod
    public void unlockWithBiometricPin(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                if (!(getActivity() instanceof FragmentActivity)) {
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", "Host activity is not a FragmentActivity");
                    call.resolve(ret);
                    return;
                }

                KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
                keyStore.load(null);
                if (!keyStore.containsAlias(BIOMETRIC_KEY_ALIAS)) {
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", "Biometric key not found in Keystore");
                    ret.put("requiresReEnrollment", true);
                    call.resolve(ret);
                    return;
                }

                String[] record = mQueue.getBiometricPinRecord();
                if (record == null) {
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", "No encrypted PIN record found");
                    ret.put("requiresReEnrollment", true);
                    call.resolve(ret);
                    return;
                }

                byte[] iv = Base64.decode(record[0], Base64.DEFAULT);
                byte[] encryptedPin = Base64.decode(record[1], Base64.DEFAULT);

                SecretKey secretKey = (SecretKey) keyStore.getKey(BIOMETRIC_KEY_ALIAS, null);
                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                GCMParameterSpec spec = new GCMParameterSpec(128, iv);

                try {
                    cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);
                } catch (KeyPermanentlyInvalidatedException e) {
                    // Biometric credentials changed in device settings (added/removed fingerprint)
                    // Safe recovery: clear invalidated key and prompt user to enter manual PIN
                    try {
                        keyStore.deleteEntry(BIOMETRIC_KEY_ALIAS);
                    } catch (Exception ignored) {}
                    mQueue.clearBiometricPinRecord();

                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("invalidated", true);
                    ret.put("error", "تم تعديل بصمات الأصابع في إعدادات النظام. يرجى إدخال رمز الـ PIN يدوياً لفتح المحفظة.");
                    call.resolve(ret);
                    return;
                }

                BiometricPrompt.CryptoObject cryptoObject = new BiometricPrompt.CryptoObject(cipher);

                Executor executor = ContextCompat.getMainExecutor(getActivity());
                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle(call.getString("title", "فتح محفظة ApexWallet"))
                        .setSubtitle(call.getString("subtitle", "استخدم بصمة الإصبع أو الوجه لفك تشفير المحفظة"))
                        .setNegativeButtonText(call.getString("negativeButtonText", "استخدام رمز PIN"))
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
                        .build();

                BiometricPrompt biometricPrompt = new BiometricPrompt(
                        (FragmentActivity) getActivity(),
                        executor,
                        new BiometricPrompt.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                                super.onAuthenticationError(errorCode, errString);
                                JSObject ret = new JSObject();
                                ret.put("success", false);
                                ret.put("error", errString.toString());
                                ret.put("cancelled", errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON || errorCode == BiometricPrompt.ERROR_USER_CANCELED);
                                call.resolve(ret);
                            }

                            @Override
                            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                super.onAuthenticationSucceeded(result);
                                try {
                                    Cipher authenticatedCipher = result.getCryptoObject() != null ? result.getCryptoObject().getCipher() : null;
                                    if (authenticatedCipher == null) {
                                        throw new IllegalStateException("CryptoObject cipher unavailable");
                                    }
                                    byte[] decrypted = authenticatedCipher.doFinal(encryptedPin);
                                    String pin = new String(decrypted, StandardCharsets.UTF_8);

                                    JSObject ret = new JSObject();
                                    ret.put("success", true);
                                    ret.put("pin", pin);
                                    call.resolve(ret);
                                } catch (Exception e) {
                                    JSObject ret = new JSObject();
                                    ret.put("success", false);
                                    ret.put("error", "Decryption failed: " + e.getMessage());
                                    call.resolve(ret);
                                }
                            }

                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                            }
                        }
                );

                biometricPrompt.authenticate(promptInfo, cryptoObject);

            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", "Biometric unlock error: " + e.getMessage());
                call.resolve(ret);
            }
        });
    }

    @PluginMethod
    public void clearBiometricPin(PluginCall call) {
        String errMsg = null;
        boolean aliasPresent = false;
        boolean recordPresent = false;

        try {
            KeyStore keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyStore.load(null);
            if (keyStore.containsAlias(BIOMETRIC_KEY_ALIAS)) {
                keyStore.deleteEntry(BIOMETRIC_KEY_ALIAS);
            }
            aliasPresent = keyStore.containsAlias(BIOMETRIC_KEY_ALIAS);
        } catch (Exception e) {
            errMsg = e.getMessage() != null ? e.getMessage() : "Keystore delete failed";
            try {
                KeyStore verifyStore = KeyStore.getInstance("AndroidKeyStore");
                verifyStore.load(null);
                aliasPresent = verifyStore.containsAlias(BIOMETRIC_KEY_ALIAS);
            } catch (Exception verifyErr) {
                aliasPresent = true;
            }
        }

        try {
            mQueue.clearBiometricPinRecord();
        } catch (Exception e) {
            String recErr = e.getMessage() != null ? e.getMessage() : "Record clear failed";
            errMsg = errMsg == null ? recErr : (errMsg + "; " + recErr);
        }

        try {
            recordPresent = mQueue.hasBiometricPinRecord();
        } catch (Exception e) {
            recordPresent = true;
            String checkErr = e.getMessage() != null ? e.getMessage() : "Record verify failed";
            errMsg = errMsg == null ? checkErr : (errMsg + "; " + checkErr);
        }

        boolean ok = (errMsg == null && !aliasPresent && !recordPresent);
        JSObject ret = new JSObject();
        ret.put("success", ok);
        ret.put("aliasPresent", aliasPresent);
        ret.put("recordPresent", recordPresent);
        if (errMsg != null) {
            ret.put("error", errMsg);
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void hasBiometricPin(PluginCall call) {
        boolean hasRecord = mQueue.hasBiometricPinRecord();
        JSObject ret = new JSObject();
        ret.put("hasRecord", hasRecord);
        call.resolve(ret);
    }
}
