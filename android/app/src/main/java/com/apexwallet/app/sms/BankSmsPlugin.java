package com.apexwallet.app.sms;

import android.Manifest;
import android.content.pm.PackageManager;
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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executor;

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
     * in-memory OTP/promo rejection, SHA-256 deduplication, and safe batching.
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
        int batchOffset = call.getInt("offset", 0);
        int batchLimit = call.getInt("limit", 20);

        long cutoffTimestamp = System.currentTimeMillis() - (days * 24L * 60L * 60L * 1000L);
        Set<String> allowlist = mQueue.getBankAllowlist();

        List<JSObject> candidates = new ArrayList<>();
        int totalMatchedInWindow = 0;
        int rejectedOtpOrPromo = 0;
        int duplicateCount = 0;
        int matchIndex = 0;

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

                    // 2. Parse strictly in memory
                    CandidateTransaction candidate = BankSmsParser.parse(sender, body);
                    if (candidate == null) {
                        rejectedOtpOrPromo++;
                        continue;
                    }

                    // 3. Level A Deduplication: check against processed fingerprints
                    if (mQueue.isDuplicate(candidate.getFingerprint())) {
                        duplicateCount++;
                        continue;
                    }

                    totalMatchedInWindow++;

                    // 4. Bounded batch window
                    if (matchIndex >= batchOffset && matchIndex < (batchOffset + batchLimit)) {
                        try {
                            candidates.add(JSObject.fromJSONObject(candidate.toJsonObject()));
                        } catch (JSONException ignored) {}
                    }
                    matchIndex++;

                } while (cursor.moveToNext());
            }

            JSObject ret = new JSObject();
            ret.put("success", true);
            JSArray arr = new JSArray();
            for (JSObject obj : candidates) {
                arr.put(obj);
            }
            ret.put("candidates", arr);
            ret.put("batchCount", arr.length());
            ret.put("totalMatched", totalMatchedInWindow);
            ret.put("offset", batchOffset);
            ret.put("hasMore", (batchOffset + batchLimit) < matchIndex);
            ret.put("nextOffset", batchOffset + batchLimit);
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

    /**
     * Check if hardware biometric authentication (Fingerprint / Face ID) is supported and enrolled.
     */
    @PluginMethod
    public void isBiometricAvailable(PluginCall call) {
        try {
            BiometricManager biometricManager = BiometricManager.from(getContext());
            int canAuthenticate = biometricManager.canAuthenticate(
                    BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.BIOMETRIC_WEAK
            );
            boolean isAvailable = (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS);
            JSObject ret = new JSObject();
            ret.put("isAvailable", isAvailable);
            ret.put("statusCode", canAuthenticate);
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("isAvailable", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    /**
     * Show native Android BiometricPrompt dialog for fingerprint/face verification.
     */
    @PluginMethod
    public void authenticateBiometric(PluginCall call) {
        String title = call.getString("title", "ApexWallet Biometrics");
        String subtitle = call.getString("subtitle", "Verify your fingerprint or face");
        String negativeButtonText = call.getString("negativeButtonText", "Use PIN");

        getActivity().runOnUiThread(() -> {
            try {
                if (!(getActivity() instanceof FragmentActivity)) {
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("error", "Host activity is not a FragmentActivity");
                    call.resolve(ret);
                    return;
                }

                Executor executor = ContextCompat.getMainExecutor(getActivity());
                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle(title)
                        .setSubtitle(subtitle)
                        .setNegativeButtonText(negativeButtonText)
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.BIOMETRIC_WEAK)
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
                                JSObject ret = new JSObject();
                                ret.put("success", true);
                                call.resolve(ret);
                            }

                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                            }
                        }
                );

                biometricPrompt.authenticate(promptInfo);
            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("error", e.getMessage());
                call.resolve(ret);
            }
        });
    }
}
