package com.apexwallet.app.sms;

import android.util.Log;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * On-device heuristic parser for Egyptian & Middle Eastern Bank SMS alerts.
 * Operates purely in memory. Raw message text is NEVER logged or stored.
 */
public class BankSmsParser {
    private static final String TAG = "ApexBankSmsParser";

    public static final Set<String> DEFAULT_BANK_ALLOWLIST = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
            "CIB", "HSBC", "QNB", "NBE", "BM", "BANQUEMISR", "EMIRATESNBD",
            "ENBD", "FABMISR", "FAB", "ALEXBANK", "ADIB", "AAIB", "FAISAL"
    )));

    // Negative triggers: OTP, 2FA, verification passcodes, promo, balance inquiry
    private static final Pattern OTP_PATTERN = Pattern.compile(
            "(?i)\\b(otp|one\\s*time\\s*password|verification\\s*code|security\\s*code|activation\\s*code|login\\s*code|passcode)\\b|" +
            "رمز\\s*التحقق|كود\\s*التحقق|رمز\\s*التأكيد|كلمة\\s*السر\\s*المؤقتة|رمز\\s*سري|لا\\s*تشارك|do\\s*not\\s*share"
    );

    private static final Pattern PROMO_PATTERN = Pattern.compile(
            "(?i)\\b(special\\s*offer|congratulations|discount\\s*up\\s*to|loan\\s*approval|apply\\s*now|promo\\s*code)\\b|" +
            "عرض\\s*خاص|مبروك|قسط|تمت\\s*الموافقة\\s*على\\s*القرض|خصم\\s*يصل"
    );

    private static final Pattern BALANCE_INQUIRY_ONLY = Pattern.compile(
            "(?i)^\\s*(your\\s*balance\\s*is|available\\s*balance\\s*is|رصيدكم\\s*الحالي|رصيدك\\s*هو)\\b"
    );

    // Transaction direction patterns (Item 3 & Item 4)
    private static final Pattern DEBIT_PATTERN = Pattern.compile(
            "(?i)\\b(purchase|purchased|paid|debit|debited|spent|withdrawn|withdraw|charge|charged|was\\s*charged|transferred|transfer|pos|online|atm|cash\\s*out)\\b|" +
            "شراء|خصم|مدين|سحب|دفع|تمت?\\s*عملية|عملية\\s*خصم|تسوق|شحن|تحويل\\s*صادر|تم\\s*تنفيذ\\s*تحويل|تحويل\\s*لحظي"
    );

    private static final Pattern CREDIT_PATTERN = Pattern.compile(
            "(?i)\\b(refund|refunded|deposited|deposit|credited|credit|reversed|reversal|cash\\s*in|transfer\\s*received|received)\\b|" +
            "استرداد|إيداع|ايداع|دائن|اضافة|إضافة|تحويل\\s*وارد|تم\\s*استلام\\s*تحويل|استلام\\s*مبلغ"
    );

    // Reference number pattern (Item 8) - with word boundary so it won't match inside "Carrefour"
    private static final Pattern REF_PATTERN = Pattern.compile(
            "(?i)(?:برقم\\s*مرجعي|رقم\\s*(?:المرجع|العملية)|مرجع|\\bref(?:erence)?\\s*(?:no|num|number)?|\\btxn\\s*id|\\brrn)\\s*[:#]?\\s*([a-zA-Z0-9]+)"
    );

    // Merchant pattern: "at Amazon" or "لدى Carrefour"
    private static final Pattern MERCHANT_PATTERN = Pattern.compile(
            "(?i)(?:at|لدى|عند|merchant|store|من\\s+ماكينة|from\\s+atm)\\s*[:\\-]?\\s*([^,\\r\\n;]+)"
    );

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
        if (s.contains("FAISAL")) return "Faisal";
        return sender.trim();
    }

    public static String normalizeNumerals(String input) {
        if (input == null) return "";
        char[] chars = input.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            if (c >= '\u0660' && c <= '\u0669') {
                chars[i] = (char) ('0' + (c - '\u0660'));
            } else if (c >= '\u06f0' && c <= '\u06f9') {
                chars[i] = (char) ('0' + (c - '\u06f0'));
            } else if (c == '\u066b') {
                chars[i] = '.';
            } else if (c == '\u066c') {
                chars[i] = ',';
            }
        }
        return new String(chars);
    }

    public static String normalizeCurrency(String curr) {
        if (curr == null) return "EGP";
        String c = curr.trim().toUpperCase(Locale.US);
        if (c.equals("LE") || c.equals("L.E") || c.equals("EGP") || c.equals("ج.م") || c.equals("جم") || c.equals("جنيه")) {
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
     * Main parsing method. Strictly parses in memory.
     */
    public static CandidateTransaction parse(String sender, String rawSmsBody) {
        if (rawSmsBody == null || rawSmsBody.trim().isEmpty()) {
            return null;
        }

        // 1. Negative Filter: Reject OTP, verification, promo, or pure balance inquiry
        String normalized = normalizeNumerals(rawSmsBody);
        if (OTP_PATTERN.matcher(normalized).find()) return null;
        if (PROMO_PATTERN.matcher(normalized).find()) return null;
        if (BALANCE_INQUIRY_ONLY.matcher(normalized).find()) return null;

        // 2. Identify Transaction Direction (Type)
        String type = "expense";
        boolean isCredit = CREDIT_PATTERN.matcher(normalized).find();
        boolean isDebit = DEBIT_PATTERN.matcher(normalized).find();

        if (isCredit && !isDebit) {
            type = "income";
        } else if (!isCredit && !isDebit) {
            return null;
        }

        // 3. Extract Amount & Currency Strictly (Item 5)
        // Must be bound to currency or explicit amount marker; ignore limits/balances and card numbers!
        AmountResult amtResult = extractTransactionAmount(normalized);
        if (amtResult == null || amtResult.amount <= 0.0) {
            return null;
        }
        double amount = amtResult.amount;
        String currency = amtResult.currency;

        // 4. Typed Identifier Extraction (Item 6): Bank + Entity Type + Digits + Position
        TypedIdentifier ident = extractTypedIdentifier(normalized);
        String entityType = ident.entityType;
        String digits = ident.digits;
        String position = ident.position;
        boolean requiresCardSelection = digits.isEmpty();

        // 5. Merchant extraction
        String merchant = "";
        Matcher merchMatcher = MERCHANT_PATTERN.matcher(normalized);
        if (merchMatcher.find()) {
            String m = merchMatcher.group(1).trim();
            m = m.split("(?i)\\s+(?:with\\s+card|from\\s+card|with\\s+credit|with\\s+debit|using|on\\s+\\d|باستخدام|من\\s+بطاقة|من\\s+حساب|بتاريخ|في\\s+\\d)")[0].trim();
            if (m.length() > 50) m = m.substring(0, 50).trim();
            merchant = m;
        }

        // 6. Full Date and Time Extraction (Item 7)
        String dateTime = extractDateTime(normalized);

        // 7. Reference Number Extraction (Item 8)
        String refNumber = "";
        Matcher refMatcher = REF_PATTERN.matcher(normalized);
        if (refMatcher.find() && refMatcher.group(1) != null) {
            refNumber = refMatcher.group(1).trim();
        }

        // 8. Deterministic Compound Deduplication Fingerprint (Item 8)
        String bank = resolveBankName(sender);
        String fingerprint = generateCompoundFingerprint(bank, entityType, digits, position, type, amount, currency, dateTime, refNumber);

        return new CandidateTransaction(
                bank,
                digits,
                entityType,
                digits,
                position,
                refNumber,
                type,
                amount,
                currency,
                merchant,
                dateTime,
                fingerprint,
                requiresCardSelection
        );
    }

    private static class AmountResult {
        double amount;
        String currency;
        AmountResult(double a, String c) { this.amount = a; this.currency = c; }
    }

    /**
     * Extracts amount strictly tied to currency, ignoring card numbers and credit limits.
     */
    private static AmountResult extractTransactionAmount(String text) {
        // Pattern 1: Currency before number: e.g. "EGP 100.00", "USD 50", "$ 120", "بمبلغ 100.00 جم"
        // Pattern 2: Number before currency: e.g. "100.00 EGP", "100.00 جم", "1,250.50 ج.م", "850 جنيه"
        Pattern pCurr = Pattern.compile(
                "(?i)(?:(?:was\\s*charged\\s*for|charged\\s*for|purchase\\s*of|paid|بمبلغ|مبلغ)\\s+)?(?:(EGP|LE|L\\.E|USD|EUR|GBP|AED|SAR|ج\\.م|جم|جنيه|\\$|€|£|د\\.إ|ر\\.س)\\s*)?([0-9]+(?:,[0-9]{3})*(?:\\.[0-9]{1,2})?|[0-9]+(?:\\.[0-9]{1,2})?)\\s*(EGP|LE|L\\.E|USD|EUR|GBP|AED|SAR|ج\\.م|جم|جنيه|\\$|€|£|د\\.إ|ر\\.س)?"
        );

        Matcher m = pCurr.matcher(text);
        while (m.find()) {
            int matchStart = m.start();
            String prefixCurr = m.group(1);
            String numStr = m.group(2);
            String suffixCurr = m.group(3);

            // Require at least one currency indicator
            if ((prefixCurr == null || prefixCurr.isEmpty()) && (suffixCurr == null || suffixCurr.isEmpty())) {
                continue;
            }

            // Check if this number is preceded by limit or balance phrases (e.g. "available limit is EGP 5000.00")
            String textBefore = text.substring(Math.max(0, matchStart - 35), matchStart).toLowerCase(Locale.US);
            if (textBefore.contains("limit") || textBefore.contains("balance") ||
                textBefore.contains("الحد المتاح") || textBefore.contains("رصيد متاح") || textBefore.contains("رصيدك")) {
                continue;
            }

            // Check if directly preceded by card or account number marker (e.g. "ending with# 4321")
            String trimmedBefore = textBefore.trim();
            if (trimmedBefore.endsWith("ending with#") || trimmedBefore.endsWith("ending with") ||
                trimmedBefore.endsWith("ending in") || trimmedBefore.endsWith("منتهي بـ") ||
                trimmedBefore.endsWith("بطاقة رقم") || trimmedBefore.endsWith("حساب رقم")) {
                continue;
            }

            if (numStr != null && !numStr.isEmpty()) {
                try {
                    double val = Double.parseDouble(numStr.replace(",", ""));
                    if (val > 0.0 && val < 10000000.0) {
                        String curr = prefixCurr != null ? normalizeCurrency(prefixCurr) : normalizeCurrency(suffixCurr);
                        return new AmountResult(val, curr);
                    }
                } catch (NumberFormatException ignored) {}
            }
        }
        return null;
    }

    private static class TypedIdentifier {
        String entityType; // "card" | "account" | "unknown"
        String digits;     // 4 digits
        String position;   // "last" | "first"
        TypedIdentifier(String e, String d, String p) {
            this.entityType = e; this.digits = d; this.position = p;
        }
    }

    private static TypedIdentifier extractTypedIdentifier(String text) {
        String lower = text.toLowerCase(Locale.US);

        // Detect Entity Type
        String entityType = "card";
        if (text.contains("حساب") || lower.contains("account")) {
            entityType = "account";
        } else if (text.contains("بطاق") || text.contains("كارت") || lower.contains("card")) {
            entityType = "card";
        } else {
            entityType = "unknown";
        }

        // Detect Digits & Position
        // Case A: Starting with (First digits)
        Pattern pFirst = Pattern.compile("(?i)(?:starting\\s+with|تبدأ\\s+بـ?)\\s*(\\d{4})|(\\d{4})(?:\\*+|x{2,}|\\.{2,})");
        Matcher mFirst = pFirst.matcher(text);
        if (mFirst.find()) {
            String d = mFirst.group(1) != null ? mFirst.group(1) : mFirst.group(2);
            if (d != null && d.length() == 4) {
                return new TypedIdentifier(entityType, d, "first");
            }
        }

        // Case B: Ending with (Last digits - common)
        Pattern pLast = Pattern.compile(
                "(?i)(?:ending\\s+with(?:\\s*#)?|ending\\s+in|تنتهي\\s+بـ?|المنتهي(?:ة)?\\s+بـ?(?:رقم)?)\\s*[:#*.]*\\s*(\\d{4})|" +
                "(?:\\*+|x{2,}|\\.{2,})\\s*(\\d{4})\\b|" +
                "(?:card|account|بطاقة|حساب)[^\\d]{0,25}?(\\d{4})\\b"
        );
        Matcher mLast = pLast.matcher(text);
        if (mLast.find()) {
            String d = mLast.group(1) != null ? mLast.group(1) : (mLast.group(2) != null ? mLast.group(2) : mLast.group(3));
            if (d != null && d.length() == 4) {
                return new TypedIdentifier(entityType, d, "last");
            }
        }

        return new TypedIdentifier(entityType, "", "last");
    }

    /**
     * Extracts full date and time (dd/mm/yy at hh:mm, dd-mm-yyyy hh:mm, etc.) (Item 7)
     */
    private static String extractDateTime(String text) {
        // Date with Time: e.g. "23/11/26 at 11:44", "22-11-2026 20:25", "2026/11/24 14:30"
        Pattern pDateTime = Pattern.compile(
                "(?i)(?:on|بتاريخ|في)?\\s*(\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}|\\d{4}[/-]\\d{1,2}[/-]\\d{1,2})(?:\\s+(?:at|الساعة|في)?\\s*(\\d{1,2}:\\d{2}(?::\\d{2})?))?"
        );

        Matcher m = pDateTime.matcher(text);
        while (m.find()) {
            String rawDate = m.group(1);
            String rawTime = m.group(2);
            if (rawDate != null && rawDate.length() >= 6) {
                String normalizedDate = normalizeDate(rawDate);
                if (normalizedDate != null) {
                    if (rawTime != null && !rawTime.isEmpty()) {
                        return normalizedDate + " " + rawTime.substring(0, 5);
                    }
                    return normalizedDate;
                }
            }
        }
        return null;
    }

    private static String normalizeDate(String d) {
        String clean = d.replace('/', '-');
        String[] parts = clean.split("-");
        if (parts.length != 3) return null;

        String year, month, day;
        if (parts[0].length() == 4) { // yyyy-mm-dd
            year = parts[0];
            month = String.format(Locale.US, "%02d", Integer.parseInt(parts[1]));
            day = String.format(Locale.US, "%02d", Integer.parseInt(parts[2]));
        } else { // dd-mm-yy or dd-mm-yyyy
            day = String.format(Locale.US, "%02d", Integer.parseInt(parts[0]));
            month = String.format(Locale.US, "%02d", Integer.parseInt(parts[1]));
            year = parts[2];
            if (year.length() == 2) {
                year = "20" + year;
            }
        }
        return year + "-" + month + "-" + day;
    }

    /**
     * Generates compound deduplication SHA-256 fingerprint (Item 8)
     */
    public static String generateCompoundFingerprint(String bank, String entityType, String digits,
                                                    String position, String type, double amount,
                                                    String currency, String dateTime, String refNumber) {
        String dt = dateTime != null ? dateTime : new SimpleDateFormat("yyyy-MM-dd HH", Locale.US).format(new Date());
        String rawKey = (bank != null ? bank.toUpperCase(Locale.US) : "BANK") + "|" +
                (entityType != null ? entityType : "card") + ":" + digits + ":" + position + "|" +
                (type != null ? type : "expense") + "|" +
                String.format(Locale.US, "%.2f", amount) + "|" +
                (currency != null ? currency.toUpperCase(Locale.US) : "EGP") + "|" +
                dt + "|" +
                (refNumber != null ? refNumber.trim().toUpperCase(Locale.US) : "");

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawKey.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            return String.valueOf(rawKey.hashCode());
        }
    }
}
