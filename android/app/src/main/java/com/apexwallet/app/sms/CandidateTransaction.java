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
    private String cardSuffix;           // Legacy last 4 digits
    private String entityType;           // "card" | "account" | "unknown"
    private String identifierDigits;     // 4 digits (e.g. "0000")
    private String digitsPosition;       // "last" | "first"
    private String referenceNumber;      // e.g. "REF123456" or ""
    private String type;                 // "expense" | "income"
    private String transactionType;      // "purchase" | "transfer" | "withdrawal"
    private double amount;
    private String currency;             // e.g. "EGP", "USD"
    private String merchant;             // merchant, ATM or reference; empty string if none
    private String transactionTime;      // extracted normalized date/time (e.g. "2026-11-23 11:44")
    private long receiptTime;            // timestamp when message was received on device
    private String fingerprint;          // SHA-256 hash for deduplication
    private String status;               // "pending", "approved", "rejected"
    private boolean requiresCardSelection;

    public CandidateTransaction() {
        this.id = UUID.randomUUID().toString();
        this.status = "pending";
        this.receiptTime = System.currentTimeMillis();
        this.entityType = "card";
        this.digitsPosition = "last";
        this.referenceNumber = "";
        this.transactionType = "purchase";
    }

    public CandidateTransaction(String bank, String cardSuffix, String entityType,
                                String identifierDigits, String digitsPosition, String referenceNumber,
                                String type, double amount, String currency, String merchant,
                                String transactionTime, String fingerprint, boolean requiresCardSelection) {
        this(bank, cardSuffix, entityType, identifierDigits, digitsPosition, referenceNumber, type, "purchase", amount, currency, merchant, transactionTime, fingerprint, requiresCardSelection);
    }

    public CandidateTransaction(String bank, String cardSuffix, String entityType,
                                String identifierDigits, String digitsPosition, String referenceNumber,
                                String type, String transactionType, double amount, String currency, String merchant,
                                String transactionTime, String fingerprint, boolean requiresCardSelection) {
        this.id = UUID.randomUUID().toString();
        this.bank = bank != null ? bank : "Bank";
        this.cardSuffix = cardSuffix != null ? cardSuffix : "";
        this.entityType = entityType != null ? entityType : "card";
        this.identifierDigits = identifierDigits != null ? identifierDigits : (cardSuffix != null ? cardSuffix : "");
        this.digitsPosition = digitsPosition != null ? digitsPosition : "last";
        this.referenceNumber = referenceNumber != null ? referenceNumber : "";
        this.type = type != null ? type : "expense";
        this.transactionType = transactionType != null ? transactionType : "purchase";
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
            obj.put("entityType", entityType);
            obj.put("identifierDigits", identifierDigits);
            obj.put("digitsPosition", digitsPosition);
            obj.put("referenceNumber", referenceNumber);
            obj.put("type", type);
            obj.put("direction", type); // alias for consistency
            obj.put("transactionType", transactionType != null ? transactionType : "purchase");
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
        candidate.entityType = obj.optString("entityType", "card");
        candidate.identifierDigits = obj.optString("identifierDigits", candidate.cardSuffix);
        candidate.digitsPosition = obj.optString("digitsPosition", "last");
        candidate.referenceNumber = obj.optString("referenceNumber", "");
        candidate.type = obj.optString("direction", obj.optString("type", "expense"));
        candidate.transactionType = obj.optString("transactionType", "purchase");
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
    public String getEntityType() { return entityType; }
    public String getIdentifierDigits() { return identifierDigits; }
    public String getDigitsPosition() { return digitsPosition; }
    public String getReferenceNumber() { return referenceNumber; }
    public String getType() { return type; }
    public String getTransactionType() { return transactionType != null ? transactionType : "purchase"; }
    public void setTransactionType(String t) { this.transactionType = t; }
    public double getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getMerchant() { return merchant; }
    public String getTransactionTime() { return transactionTime; }
    public long getReceiptTime() { return receiptTime; }
    public String getFingerprint() { return fingerprint; }
    public String getStatus() { return status; }
    public boolean isRequiresCardSelection() { return requiresCardSelection; }
}
