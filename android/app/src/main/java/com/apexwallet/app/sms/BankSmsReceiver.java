package com.apexwallet.app.sms;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Manifest-declared BroadcastReceiver for Telephony.Sms.Intents.SMS_RECEIVED_ACTION.
 * Receives incoming SMS even when the screen is locked or the WebView is paused.
 * Enforces bank-only sender allowlist, drops raw message text immediately,
 * and enqueues parsed CandidateTransaction into Keystore-backed storage.
 */
public class BankSmsReceiver extends BroadcastReceiver {
    private static final String TAG = "ApexBankSmsReceiver";

    public interface OnCandidateReceivedListener {
        void onCandidateReceived(CandidateTransaction candidate);
    }

    private static OnCandidateReceivedListener sListener;

    public static void setListener(OnCandidateReceivedListener listener) {
        sListener = listener;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;

        String action = intent.getAction();
        if (!Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(action)) {
            Log.d(TAG, "Ignoring non-SMS intent action: " + action);
            return;
        }

        BankSmsQueue queue = BankSmsQueue.getInstance(context);

        // Record that a system SMS broadcast successfully reached our manifest receiver
        queue.recordBroadcastReceived(System.currentTimeMillis(), "System Broadcast");

        if (!queue.isSmsImportEnabled()) {
            // User has not explicitly enabled SMS import. Drop immediately.
            queue.recordBroadcastReceived(System.currentTimeMillis(), "Ignored (Import Disabled)");
            return;
        }

        SmsMessage[] messages;
        try {
            messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
        } catch (Exception e) {
            Log.e(TAG, "Failed to decode SMS messages from intent", e);
            return;
        }

        if (messages == null || messages.length == 0) {
            return;
        }

        // Record first sender name (no body) for diagnostic tracking
        String firstSender = null;
        for (SmsMessage m : messages) {
            if (m != null) {
                firstSender = m.getDisplayOriginatingAddress();
                if (firstSender == null || firstSender.trim().isEmpty()) {
                    firstSender = m.getOriginatingAddress();
                }
                if (firstSender != null) break;
            }
        }
        if (firstSender != null) {
            queue.recordBroadcastReceived(System.currentTimeMillis(), firstSender);
        }

        Set<String> allowlist = queue.getBankAllowlist();

        // Assemble multipart messages grouped by sender
        Map<String, StringBuilder> messageBodies = new HashMap<>();
        for (SmsMessage msg : messages) {
            if (msg == null) continue;
            String sender = msg.getDisplayOriginatingAddress();
            if (sender == null || sender.trim().isEmpty()) {
                sender = msg.getOriginatingAddress();
            }
            if (sender == null) continue;

            // Sender allowlist check
            if (!BankSmsParser.isSenderAllowed(sender, allowlist)) {
                // Not from an allowed bank sender. Skip silently.
                continue;
            }

            String partBody = msg.getDisplayMessageBody();
            if (partBody == null) {
                partBody = msg.getMessageBody();
            }
            if (partBody == null) continue;

            if (!messageBodies.containsKey(sender)) {
                messageBodies.put(sender, new StringBuilder());
            }
            messageBodies.get(sender).append(partBody);
        }

        // Parse each assembled message
        for (Map.Entry<String, StringBuilder> entry : messageBodies.entrySet()) {
            String sender = entry.getKey();
            String fullBody = entry.getValue().toString();

            try {
                // In-memory parse
                CandidateTransaction candidate = BankSmsParser.parse(sender, fullBody);

                if (candidate != null) {
                    boolean enqueued = queue.enqueue(candidate);
                    if (enqueued && sListener != null) {
                        try {
                            sListener.onCandidateReceived(candidate);
                        } catch (Exception e) {
                            Log.e(TAG, "Error invoking candidate listener", e);
                        }
                    }
                }
            } finally {
                // Explicitly clear builder memory to ensure raw body does not linger
                entry.getValue().setLength(0);
            }
        }
    }
}
