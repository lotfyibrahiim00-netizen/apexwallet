package com.apexwallet.app.sms;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * On-device parser for bank SMS notifications.
 * Raw SMS text is processed strictly in memory and never retained or logged.
 */
public class BankSmsParser {

    public static final Set<String> DEFAULT_BANK_ALLOWLIST = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            "CIB", "HSBC", "QNB", "NBE", "BM", "BANQUEMISR", "BANQUE MISR",
            "EMIRATESNBD", "ENBD", "FABMISR", "FAB", "ALEXBANK", "ADIB",
            "AAIB", "FAISAL", "EGBANK", "ALBARAKA", "MASHREQ", "CAE", "CREDITAGRICOLE"
    )));

    // Negative triggers that indicate an OTP, security verification, or marketing notice
    private static final Pattern OTP_PATTERN = Pattern.compile(
            "(?i)\\b(otp|one\\s*time\\s*password|verification\\s*code|security\\s*code|activation\\s*code|login\\s*code|passcode)\\b|" +
            "رمز\\s*التحقق|كود\\s*التحقق|رمز\\s*التأكيد|كلمة\\s*السر\\s*المؤقتة|رمز\\s*سري|لا\\s*تشارك|do\\s*not\\s*share"
    );

    private static final Pattern PROMO_PATTERN = Pattern.compile(
            "(?i)\\b(special\\s*offer|congratulations|discount\\s*up\\s*to|loan\\s*approval|apply\\s*now|promo\\s*code)\\b|" +
            "عرض\\s*خاص|مبروك|قسط|تمت\\s*الموافقة\\s*على\\s*القرض|خصم\\s*يصل"
    );

    // Negative triggers for pure balance inquiry or reminder without a transaction
    private static final Pattern BALANCE_INQUIRY_ONLY = Pattern.compile(
            "(?i)^\\s*(your\\s*balance\\s*is|available\\s*balance\\s*is|رصيدكم\\s*الحالي|رصيدك\\s*هو)\\b"
    );

    // Card suffix patterns
    private static final Pattern CARD_SUFFIX_PATTERN = Pattern.compile(
            "(?i)(?:card|account|بطاقة|بطاقتكم|بطاقتك|كارت)[^\\d]{0,35}?(?:\\*+|\\.{2,}|ending\\s+in|تنتهي\\s+بـ?|المنتهية\\s+بـ?(?:رقم)?|رقم)?\\s*(\\d{4})|" +
            "(?:\\*+|x{2,})(\\d{4})\\b"
    );

    // Currency and Amount patterns
    // English: EGP 1,250.50 or 1,250.50 EGP or USD 50.00
    // Arabic: 1,250.50 ج.م or 1,250.50 جنيه
    private static final Pattern AMOUNT_CURRENCY_PATTERN = Pattern.compile(
            "(?i)(?:(EGP|LE|L\\.E|USD|EUR|GBP|AED|SAR|ج\\.م|جنيه|\\$|€|£|د\\.إ|ر\\.س)\\s*)?([0-9]+(?:,[0-9]{3})*(?:\\.[0-9]{1,2})?|[0-9]+(?:\\.[0-9]{1,2})?)\\s*(EGP|LE|L\\.E|USD|EUR|GBP|AED|SAR|ج\\.م|جنيه|\\$|€|£|د\\.إ|ر\\.س)?"
    );

    // Transaction type patterns
    private static final Pattern DEBIT_PATTERN = Pattern.compile(
            "(?i)\\b(purchase|paid|debited|spent|withdrawn|charge|pos|online|atm|cash\\s*out)\\b|" +
            "شراء|خصم|مدين|سحب|دفع|عملية\\s*خصم|تسوق|شحن"
    );

    private static final Pattern CREDIT_PATTERN = Pattern.compile(
            "(?i)\\b(refund|refunded|deposited|credited|reversed|cash\\s*in|transfer\\s*received)\\b|" +
            "استرداد|إيداع|ايداع|دائن|اضافة|إضافة|تحويل\\s*وارد"
    );

    // Merchant pattern: "at Amazon" or "لدى Carrefour"
    private static final Pattern MERCHANT_PATTERN = Pattern.compile(
            "(?i)(?:at|لدى|عند|merchant|store|من\\s+ماكينة|from\\s+atm)\\s*[:\\-]?\\s*([^,\\r\\n;]+)"
    );

    // Date pattern: "on 24/11/2026" or "2026-11-24 14:30" or "بتاريخ 24/11/2026"
    private static final Pattern DATE_PATTERN = Pattern.compile(
            "(?i)(?:on|بتاريخ|في|date)?\\s*(\\d{1,4}[/-]\\d{1,2}[/-]\\d{2,4}(?:\\s+\\d{1,2}:\\d{2}(?::\\d{2})?)?)"
    );

    /**
     * Checks if a sender matches the allowlist.
     */
    public static boolean isSenderAllowed(String sender, Set<String> allowlist) {
        if (sender == null || sender.trim().isEmpty()) {
            return false;
        }
        String cleanSender = sender.replaceAll("[^a-zA-Z0-9]", "").toUpperCase(Locale.US);
        Set<String> activeList = (allowlist != null && !allowlist.isEmpty()) ? allowlist : DEFAULT_BANK_ALLOWLIST;

        for (String allowed : activeList) {
            String cleanAllowed = allowed.replaceAll("[^a-zA-Z0-9]", "").toUpperCase(Locale.US);
            if (cleanSender.contains(cleanAllowed) || cleanAllowed.contains(cleanSender)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Identifies the primary bank name from sender or text routing hint.
     */
    public static String resolveBankName(String sender) {
        if (sender == null) return "Bank";
        String s = sender.toUpperCase(Locale.US);
        if (s.contains("CIB")) return "CIB";
        if (s.contains("HSBC")) return "HSBC";
        if (s.contains("QNB")) return "QNB";
        if (s.contains("NBE") || s.contains("AHLI")) return "NBE";
        if (s.contains("MISR") || s.contains("BM")) return "Banque Misr";
        if (s.contains("ENBD") || s.contains("EMIRATES")) return "Emirates NBD";
        if (s.contains("FAB")) return "FABMISR";
        if (s.contains("ALEX")) return "AlexBank";
        if (s.contains("ADIB")) return "ADIB";
        if (s.contains("AAIB")) return "AAIB";
        return sender.trim();
    }

    /**
     * Converts Eastern Arabic numerals (٠-٩) to Western Arabic digits (0-9).
     */
    public static String normalizeNumerals(String input) {
        if (input == null) return "";
        char[] chars = input.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            if (c >= '\u0660' && c <= '\u0669') { // ٠ to ٩
                chars[i] = (char) ('0' + (c - '\u0660'));
            } else if (c >= '\u06f0' && c <= '\u06f9') { // Persian ۰ to ۹
                chars[i] = (char) ('0' + (c - '\u06f0'));
            } else if (c == '\u066b') { // Arabic decimal separator
                chars[i] = '.';
            } else if (c == '\u066c') { // Arabic thousands separator
                chars[i] = ',';
            }
        }
        return new String(chars);
    }

    /**
     * Standardizes currency strings into standard ISO 3-letter codes.
     */
    private static String normalizeCurrency(String curr) {
        if (curr == null) return "EGP";
        String c = curr.trim().toUpperCase(Locale.US);
        if (c.equals("LE") || c.equals("L.E") || c.equals("ج.م") || c.equals("جنيه") || c.equals("EGP")) {
            return "EGP";
        }
        if (c.equals("USD") || c.equals("$")) return "USD";
        if (c.equals("EUR") || c.equals("€")) return "EUR";
        if (c.equals("GBP") || c.equals("£")) return "GBP";
        if (c.equals("AED") || c.equals("د.إ")) return "AED";
        if (c.equals("SAR") || c.equals("ر.س")) return "SAR";
        return c;
    }

    /**
     * Parses a bank SMS in-memory.
     * Returns CandidateTransaction if valid transaction found, or null if rejected/not a transaction.
     * The raw text parameter is not kept or referenced after this method finishes.
     */
    public static CandidateTransaction parse(String sender, String rawSmsBody) {
        if (rawSmsBody == null || rawSmsBody.trim().isEmpty()) {
            return null;
        }

        // 1. Negative Filter: Reject OTP, verification, promo, or balance-inquiry-only messages
        String normalized = normalizeNumerals(rawSmsBody);
        if (OTP_PATTERN.matcher(normalized).find()) {
            return null;
        }
        if (PROMO_PATTERN.matcher(normalized).find()) {
            return null;
        }
        if (BALANCE_INQUIRY_ONLY.matcher(normalized).find()) {
            return null;
        }

        // 2. Identify Transaction Type
        String type = "expense";
        boolean isCredit = CREDIT_PATTERN.matcher(normalized).find();
        boolean isDebit = DEBIT_PATTERN.matcher(normalized).find();

        if (isCredit && !isDebit) {
            type = "income";
        } else if (!isCredit && !isDebit) {
            // If neither debit nor credit keyword found, reject to avoid non-transaction alerts
            return null;
        }

        // 3. Extract Amount & Currency
        Matcher amtMatcher = AMOUNT_CURRENCY_PATTERN.matcher(normalized);
        double amount = 0.0;
        String currency = "EGP";
        boolean amountFound = false;

        while (amtMatcher.find()) {
            String prefixCurr = amtMatcher.group(1);
            String numStr = amtMatcher.group(2);
            String suffixCurr = amtMatcher.group(3);

            if (numStr != null && !numStr.isEmpty()) {
                String cleanNum = numStr.replace(",", "");
                try {
                    double parsed = Double.parseDouble(cleanNum);
                    // Filter out years (e.g. 2026), phone numbers, or card numbers mistakenly parsed as amount
                    if (parsed > 0.0 && parsed < 10000000.0) {
                        amount = parsed;
                        amountFound = true;
                        if (prefixCurr != null && !prefixCurr.isEmpty()) {
                            currency = normalizeCurrency(prefixCurr);
                        } else if (suffixCurr != null && !suffixCurr.isEmpty()) {
                            currency = normalizeCurrency(suffixCurr);
                        }
                        break;
                    }
                } catch (NumberFormatException ignored) {}
            }
        }

        if (!amountFound || amount <= 0.0) {
            return null;
        }

        // 4. Extract Card Suffix
        String cardSuffix = "";
        boolean requiresCardSelection = false;
        Matcher cardMatcher = CARD_SUFFIX_PATTERN.matcher(normalized);
        if (cardMatcher.find()) {
            if (cardMatcher.group(1) != null) {
                cardSuffix = cardMatcher.group(1);
            } else if (cardMatcher.group(2) != null) {
                cardSuffix = cardMatcher.group(2);
            }
        }
        if (cardSuffix.isEmpty()) {
            requiresCardSelection = true;
        }

        // 5. Extract Merchant or Reference
        String merchant = "";
        Matcher merchMatcher = MERCHANT_PATTERN.matcher(normalized);
        if (merchMatcher.find()) {
            String m = merchMatcher.group(1).trim();
            m = m.split("(?i)\\s+(?:with\\s+card|from\\s+card|with\\s+credit|with\\s+debit|using\\s+card|on\\s+\\d|باستخدام\\s+بطاقة|من\\s+بطاقة|بتاريخ|في\\s+\\d)")[0].trim();
            m = m.replaceAll("(?i)\\s+(?:with|on|from|in)$", "").trim();
            merchant = m.replaceAll("[\\r\\n]+", " ").replaceAll("\\s+", " ").trim();
        }

        // 6. Extract Transaction Date if present
        String transactionTime = null;
        Matcher dateMatcher = DATE_PATTERN.matcher(normalized);
        if (dateMatcher.find()) {
            transactionTime = dateMatcher.group(1).trim();
        }

        // 7. Resolve Bank Name
        String bank = resolveBankName(sender);

        // 8. Compute Deduplication Fingerprint (SHA-256)
        long receiptBucket = System.currentTimeMillis() / (60 * 1000); // 1-minute bucket if tx date missing
        String timeKey = (transactionTime != null && !transactionTime.isEmpty()) ? transactionTime : String.valueOf(receiptBucket);
        String fingerprintInput = bank + "|" + cardSuffix + "|" + type + "|" +
                String.format(Locale.US, "%.2f", amount) + "|" + currency + "|" +
                merchant.toLowerCase(Locale.US) + "|" + timeKey;
        String fingerprint = sha256(fingerprintInput);

        return new CandidateTransaction(
                bank,
                cardSuffix,
                type,
                amount,
                currency,
                merchant,
                transactionTime,
                fingerprint,
                requiresCardSelection
        );
    }

    private static String sha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf(base.hashCode());
        }
    }
}
