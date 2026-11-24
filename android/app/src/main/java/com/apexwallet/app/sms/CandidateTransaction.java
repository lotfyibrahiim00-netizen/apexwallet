package com.apexwallet.app.sms;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.UUID;

/**
 * Minimal structured representation of a candidate bank transaction extracted from SMS.
 * Raw SMS text is NEVER stored in this object.
 */
public class CandidateTransaction {
    private String id;
    private String bank;
    private String cardSuffix;       // e.g. "1234" or "" if unknown
    private String type;             // "expense" | "income"
    private double amount;
    private String currency;         // e.g. "EGP", "USD"
    private String merchant;         // merchant, ATM or reference; empty string if none
    private String transactionTime;  // extracted from text, or null if absent
    private long receiptTime;        // timestamp when message was received on device
    private String fingerprint;      // SHA-256 hash for deduplication
    private String status;           // "pending", "approved", "rejected"
    private boolean requiresCardSelection;

    public CandidateTransaction() {
        this.id = UUID.randomUUID().toString();
        this.status = "pending";
        this.receiptTime = System.currentTimeMillis();
    }

    public CandidateTransaction(String bank, String cardSuffix, String type, double amount,
                                String currency, String merchant, String transactionTime,
                                String fingerprint, boolean requiresCardSelection) {
        this.id = UUID.randomUUID().toString();
        this.bank = bank;
        this.cardSuffix = cardSuffix != null ? cardSuffix : "";
        this.type = type != null ? type : "expense";
        this.amount = amount;
        this.currency = currency != null ? currency : "EGP";
        this.merchant = merchant != null ? merchant : "";
        this.transactionTime = transactionTime;
        this.receiptTime = System.currentTimeMillis();
        this.fingerprint = fingerprint;
        this.status = "pending";
        this.requiresCardSelection = requiresCardSelection;
    }

    public JSONObject toJsonObject() {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", id);
            obj.put("bank", bank);
            obj.put("cardSuffix", cardSuffix);
            obj.put("type", type);
            obj.put("amount", amount);
            obj.put("currency", currency);
            obj.put("merchant", merchant);
            obj.put("transactionTime", transactionTime != null ? transactionTime : JSONObject.NULL);
            obj.put("receiptTime", receiptTime);
            obj.put("fingerprint", fingerprint);
            obj.put("status", status);
            obj.put("requiresCardSelection", requiresCardSelection);
        } catch (JSONException ignored) {
        }
        return obj;
    }

    public static CandidateTransaction fromJsonObject(JSONObject obj) {
        CandidateTransaction candidate = new CandidateTransaction();
        candidate.id = obj.optString("id", UUID.randomUUID().toString());
        candidate.bank = obj.optString("bank", "Unknown Bank");
        candidate.cardSuffix = obj.optString("cardSuffix", "");
        candidate.type = obj.optString("type", "expense");
        candidate.amount = obj.optDouble("amount", 0.0);
        candidate.currency = obj.optString("currency", "EGP");
        candidate.merchant = obj.optString("merchant", "");
        if (obj.has("transactionTime") && !obj.isNull("transactionTime")) {
            candidate.transactionTime = obj.optString("transactionTime");
        } else {
            candidate.transactionTime = null;
        }
        candidate.receiptTime = obj.optLong("receiptTime", System.currentTimeMillis());
        candidate.fingerprint = obj.optString("fingerprint", "");
        candidate.status = obj.optString("status", "pending");
        candidate.requiresCardSelection = obj.optBoolean("requiresCardSelection", false);
        return candidate;
    }

    public String getId() { return id; }
    public String getBank() { return bank; }
    public String getCardSuffix() { return cardSuffix; }
    public String getType() { return type; }
    public double getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getMerchant() { return merchant; }
    public String getTransactionTime() { return transactionTime; }
    public long getReceiptTime() { return receiptTime; }
    public String getFingerprint() { return fingerprint; }
    public String getStatus() { return status; }
    public boolean isRequiresCardSelection() { return requiresCardSelection; }

    public void setStatus(String status) { this.status = status; }
    public void setCardSuffix(String cardSuffix) { this.cardSuffix = cardSuffix; }
    public void setRequiresCardSelection(boolean requires) { this.requiresCardSelection = requires; }
}
