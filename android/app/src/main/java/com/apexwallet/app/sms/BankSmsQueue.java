package com.apexwallet.app.sms;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * Thread-safe, bounded, Keystore-backed encrypted queue for candidate bank transactions.
 * No raw SMS is persisted. Only structured CandidateTransaction fields are stored.
 */
public class BankSmsQueue {
    private static final String TAG = "ApexBankSmsQueue";
    private static final String PREFS_FILE = "apex_bank_sms_vault";
    private static final String KEY_PENDING_QUEUE = "pending_transactions";
    private static final String KEY_PROCESSED_FINGERPRINTS = "processed_fingerprints";
    private static final String KEY_OPT_IN_ENABLED = "sms_import_opt_in";
    private static final String KEY_CUSTOM_ALLOWLIST = "bank_allowlist";
    private static final String KEY_STATS_TOTAL_RECEIVED = "stats_total_received";
    private static final String KEY_STATS_LAST_RECEIVED = "stats_last_received";

    private static final int MAX_QUEUE_SIZE = 50;
    private static final int MAX_PROCESSED_HISTORY = 100;
    private static final long DEDUPLICATION_WINDOW_MS = 48 * 60 * 60 * 1000L; // 48 hours

    private static BankSmsQueue sInstance;

    private SharedPreferences mSecurePrefs;
    private boolean mIsKeystoreProtected = false;

    // Fallback in-memory store if Keystore hardware is unavailable
    private final List<CandidateTransaction> mInMemoryQueue = new ArrayList<>();
    private final Set<String> mInMemoryFingerprints = new HashSet<>();
    private boolean mInMemoryOptIn = false;
    private Set<String> mInMemoryAllowlist = new HashSet<>(BankSmsParser.DEFAULT_BANK_ALLOWLIST);
    private int mInMemoryTotalReceived = 0;
    private long mInMemoryLastReceived = 0L;

    public static synchronized BankSmsQueue getInstance(Context context) {
        if (sInstance == null) {
            sInstance = new BankSmsQueue(context.getApplicationContext());
        }
        return sInstance;
    }

    private BankSmsQueue(Context context) {
        initEncryptedStorage(context);
    }

    private void initEncryptedStorage(Context context) {
        try {
            MasterKey masterKey = new MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            mSecurePrefs = EncryptedSharedPreferences.create(
                    context,
                    PREFS_FILE,
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
            mIsKeystoreProtected = true;
            Log.i(TAG, "Keystore-backed EncryptedSharedPreferences initialized successfully.");
        } catch (GeneralSecurityException | IOException e) {
            Log.w(TAG, "Hardware Keystore encryption unavailable; operating in memory-only mode without disk persistence", e);
            mSecurePrefs = null;
            mIsKeystoreProtected = false;
        }
    }

    public synchronized boolean isKeystoreProtected() {
        return mIsKeystoreProtected;
    }

    // ==========================================
    // Opt-In and Configuration
    // ==========================================

    public synchronized boolean isSmsImportEnabled() {
        if (mSecurePrefs != null) {
            return mSecurePrefs.getBoolean(KEY_OPT_IN_ENABLED, false);
        }
        return mInMemoryOptIn;
    }

    public synchronized void setSmsImportEnabled(boolean enabled) {
        if (mSecurePrefs != null) {
            mSecurePrefs.edit().putBoolean(KEY_OPT_IN_ENABLED, enabled).apply();
        } else {
            mInMemoryOptIn = enabled;
        }
    }

    public synchronized Set<String> getBankAllowlist() {
        if (mSecurePrefs != null) {
            Set<String> set = mSecurePrefs.getStringSet(KEY_CUSTOM_ALLOWLIST, null);
            if (set != null && !set.isEmpty()) {
                return new HashSet<>(set);
            }
        } else if (!mInMemoryAllowlist.isEmpty()) {
            return new HashSet<>(mInMemoryAllowlist);
        }
        return new HashSet<>(BankSmsParser.DEFAULT_BANK_ALLOWLIST);
    }

    public synchronized void setBankAllowlist(Set<String> allowlist) {
        if (allowlist == null) return;
        if (mSecurePrefs != null) {
            mSecurePrefs.edit().putStringSet(KEY_CUSTOM_ALLOWLIST, new HashSet<>(allowlist)).apply();
        } else {
            mInMemoryAllowlist = new HashSet<>(allowlist);
        }
    }

    // ==========================================
    // Queue Operations & Deduplication
    // ==========================================

    /**
     * Enqueues a parsed candidate transaction.
     * Rejects duplicates based on fingerprint.
     * Enforces MAX_QUEUE_SIZE bound.
     */
    public synchronized boolean enqueue(CandidateTransaction candidate) {
        if (candidate == null || candidate.getFingerprint() == null || candidate.getFingerprint().isEmpty()) {
            return false;
        }

        // Deduplication check
        if (isDuplicate(candidate.getFingerprint())) {
            Log.d(TAG, "Duplicate bank SMS candidate discarded: " + candidate.getFingerprint());
            return false;
        }

        List<CandidateTransaction> pending = getPendingList();

        // Check against currently pending candidates as well
        for (CandidateTransaction item : pending) {
            if (candidate.getFingerprint().equals(item.getFingerprint())) {
                return false;
            }
        }

        // Enforce maximum queue bounds (FIFO drop of oldest if over capacity)
        while (pending.size() >= MAX_QUEUE_SIZE) {
            pending.remove(0);
        }

        pending.add(candidate);
        savePendingList(pending);
        recordFingerprint(candidate.getFingerprint());

        // Update stats
        long now = System.currentTimeMillis();
        if (mSecurePrefs != null) {
            int total = mSecurePrefs.getInt(KEY_STATS_TOTAL_RECEIVED, 0) + 1;
            mSecurePrefs.edit()
                    .putInt(KEY_STATS_TOTAL_RECEIVED, total)
                    .putLong(KEY_STATS_LAST_RECEIVED, now)
                    .apply();
        } else {
            mInMemoryTotalReceived++;
            mInMemoryLastReceived = now;
        }

        return true;
    }

    /**
     * Retrieves all pending candidates as a JSON array.
     */
    public synchronized JSONArray peekPendingJson() {
        List<CandidateTransaction> pending = getPendingList();
        JSONArray array = new JSONArray();
        for (CandidateTransaction c : pending) {
            array.put(c.toJsonObject());
        }
        return array;
    }

    /**
     * Acknowledges transactions (removes them from pending queue after user approval or rejection).
     */
    public synchronized int acknowledge(List<String> idsOrFingerprints) {
        if (idsOrFingerprints == null || idsOrFingerprints.isEmpty()) {
            return 0;
        }
        Set<String> targetSet = new HashSet<>(idsOrFingerprints);
        List<CandidateTransaction> pending = getPendingList();
        int initialSize = pending.size();

        Iterator<CandidateTransaction> it = pending.iterator();
        while (it.hasNext()) {
            CandidateTransaction c = it.next();
            if (targetSet.contains(c.getId()) || targetSet.contains(c.getFingerprint())) {
                it.remove();
            }
        }

        int removed = initialSize - pending.size();
        if (removed > 0) {
            savePendingList(pending);
        }
        return removed;
    }

    /**
     * Clears all pending transactions.
     */
    public synchronized void clear() {
        if (mSecurePrefs != null) {
            mSecurePrefs.edit().remove(KEY_PENDING_QUEUE).apply();
        } else {
            mInMemoryQueue.clear();
        }
    }

    /**
     * Returns stats for diagnostic and UI monitoring.
     */
    public synchronized JSONObject getStats() {
        JSONObject stats = new JSONObject();
        try {
            int pendingCount = getPendingList().size();
            int total = mSecurePrefs != null ? mSecurePrefs.getInt(KEY_STATS_TOTAL_RECEIVED, 0) : mInMemoryTotalReceived;
            long lastReceived = mSecurePrefs != null ? mSecurePrefs.getLong(KEY_STATS_LAST_RECEIVED, 0L) : mInMemoryLastReceived;
            boolean enabled = isSmsImportEnabled();

            stats.put("pendingCount", pendingCount);
            stats.put("totalReceived", total);
            stats.put("lastReceivedAt", lastReceived);
            stats.put("isSmsImportEnabled", enabled);
            stats.put("isKeystoreProtected", mIsKeystoreProtected);
        } catch (JSONException ignored) {}
        return stats;
    }

    // ==========================================
    // Internal Persistence Helpers
    // ==========================================

    private List<CandidateTransaction> getPendingList() {
        if (mSecurePrefs != null) {
            String jsonStr = mSecurePrefs.getString(KEY_PENDING_QUEUE, "[]");
            List<CandidateTransaction> list = new ArrayList<>();
            try {
                JSONArray arr = new JSONArray(jsonStr);
                for (int i = 0; i < arr.length(); i++) {
                    list.add(CandidateTransaction.fromJsonObject(arr.getJSONObject(i)));
                }
            } catch (JSONException e) {
                Log.e(TAG, "Error parsing stored pending queue JSON", e);
            }
            return list;
        } else {
            return new ArrayList<>(mInMemoryQueue);
        }
    }

    private void savePendingList(List<CandidateTransaction> list) {
        if (mSecurePrefs != null) {
            JSONArray arr = new JSONArray();
            for (CandidateTransaction c : list) {
                arr.put(c.toJsonObject());
            }
            mSecurePrefs.edit().putString(KEY_PENDING_QUEUE, arr.toString()).apply();
        } else {
            mInMemoryQueue.clear();
            mInMemoryQueue.addAll(list);
        }
    }

    private boolean isDuplicate(String fingerprint) {
        if (mSecurePrefs != null) {
            String historyStr = mSecurePrefs.getString(KEY_PROCESSED_FINGERPRINTS, "{}");
            try {
                JSONObject history = new JSONObject(historyStr);
                if (history.has(fingerprint)) {
                    long timestamp = history.optLong(fingerprint, 0L);
                    if (System.currentTimeMillis() - timestamp < DEDUPLICATION_WINDOW_MS) {
                        return true;
                    }
                }
            } catch (JSONException ignored) {}
            return false;
        } else {
            return mInMemoryFingerprints.contains(fingerprint);
        }
    }

    private void recordFingerprint(String fingerprint) {
        long now = System.currentTimeMillis();
        if (mSecurePrefs != null) {
            String historyStr = mSecurePrefs.getString(KEY_PROCESSED_FINGERPRINTS, "{}");
            try {
                JSONObject history = new JSONObject(historyStr);
                history.put(fingerprint, now);

                // Evict old entries if history grows too large
                if (history.length() > MAX_PROCESSED_HISTORY) {
                    Iterator<String> keys = history.keys();
                    List<String> toRemove = new ArrayList<>();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        if (now - history.optLong(key, 0L) > DEDUPLICATION_WINDOW_MS) {
                            toRemove.add(key);
                        }
                    }
                    for (String k : toRemove) history.remove(k);
                }

                mSecurePrefs.edit().putString(KEY_PROCESSED_FINGERPRINTS, history.toString()).apply();
            } catch (JSONException ignored) {}
        } else {
            mInMemoryFingerprints.add(fingerprint);
        }
    }
}
