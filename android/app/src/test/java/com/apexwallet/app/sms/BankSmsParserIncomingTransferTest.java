package com.apexwallet.app.sms;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * ApexWallet v1.4.13 - Native (Java) Incoming-Transfer Test Suite
 * Tests incoming bank-transfer classification and regression prevention
 * in BankSmsParser.java, mirroring tests/test_v1412_incoming_transfer.js.
 */
public class BankSmsParserIncomingTransferTest {

    // -------------------------------------------------------------------------
    // INCOME CASES
    // -------------------------------------------------------------------------

    @Test
    public void testM1_realUserSms_maskedDigits() {
        String sms = "تحويل إلى: حسابك المنتهي بـ ********1659 من منال مح 300.00 جنيه";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("income", c.getType());
        assertEquals(300.0, c.getAmount(), 0.001);
        assertEquals("EGP", c.getCurrency());
        assertEquals("1659", c.getIdentifierDigits());
        assertEquals("account", c.getEntityType());
        assertEquals("تحويل من: منال مح", c.getMerchant());
    }

    @Test
    public void testM1b_realUserSms_egpWord() {
        String sms = "تحويل إلى: حسابك المنتهي بـ ********1659 من منال مح مبلغ 300.00 EGP";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("income", c.getType());
        assertEquals(300.0, c.getAmount(), 0.001);
        assertEquals("EGP", c.getCurrency());
        assertEquals("1659", c.getIdentifierDigits());
        assertEquals("account", c.getEntityType());
        assertEquals("تحويل من: منال مح", c.getMerchant());
    }

    @Test
    public void testM2_englishTransfer() {
        String sms = "Transfer to your account ending 1659 from Manal EGP 300.00";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("income", c.getType());
        assertEquals(300.0, c.getAmount(), 0.001);
        assertEquals("1659", c.getIdentifierDigits());
        assertTrue("Merchant must contain Manal: got " + c.getMerchant(), c.getMerchant().contains("Manal"));
    }

    @Test
    public void testM3_keepUnmasked() {
        String sms = "تحويل إلى: حسابك المنتهي بـ 1659 من منال 300.00 جنيه";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("income", c.getType());
        assertEquals(300.0, c.getAmount(), 0.001);
        assertTrue("Merchant must start with 'تحويل من': got " + c.getMerchant(), c.getMerchant().startsWith("تحويل من"));
        assertTrue("Merchant must contain 'منال': got " + c.getMerchant(), c.getMerchant().contains("منال"));
    }

    // -------------------------------------------------------------------------
    // MUST-STAY-EXPENSE / NULL REGRESSION CASES
    // -------------------------------------------------------------------------

    @Test
    public void testFix1_purchaseMentioningYourCard() {
        String sms = "تمت عملية شراء بمبلغ 250 جنيه في بطاقتك المنتهية بـ 1234 لدى AMAZON";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals(250.0, c.getAmount(), 0.001);
        assertTrue("Merchant must contain AMAZON: got " + c.getMerchant(), c.getMerchant().contains("AMAZON"));
    }

    @Test
    public void testFix2_chargedPaymentToYourAccount() {
        String sms = "Your card ending 1234 was charged EGP 100 at NOON, payment to your account";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals(100.0, c.getAmount(), 0.001);
    }

    @Test
    public void testFix3_feeDeductionInYourAccount() {
        String sms = "خصم 100 جنيه رسوم في حسابك المنتهي بـ 1234";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals(100.0, c.getAmount(), 0.001);
    }

    @Test
    public void testFix4a_outgoingToAnotherPerson() {
        String sms = "تم تحويل 500 جنيه إلى حساب أحمد المنتهي بـ 7788";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals(500.0, c.getAmount(), 0.001);
    }

    @Test
    public void testFix4b_ambiguousTransferReturnsNull() {
        String sms = "تحويل 500 جنيه لحساب المنتهي بـ 7788";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNull("Ambiguous transfer without explicit destination must return null", c);
    }

    @Test
    public void testFix5_debitWordingWinsOverToYourAccount() {
        String sms = "تم تحويل 500 جنيه الى حسابك الخاص بك من حساب التوفير";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals(500.0, c.getAmount(), 0.001);
    }

    @Test
    public void testFix6_youSentToYourAccount() {
        String sms = "You sent EGP 300 to Ahmed, to your account ending 1234 ref 998877";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals(300.0, c.getAmount(), 0.001);
    }

    @Test
    public void testAtmUnchanged() {
        String sms = "Cash withdrawal of EGP 2,000.00 from ATM Arkan Plaza with card ending in 8492 on 24/11/2026.";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNotNull("Candidate must not be null", c);
        assertEquals("expense", c.getType());
        assertEquals("withdrawal", c.getTransactionType());
        assertEquals(2000.0, c.getAmount(), 0.001);
    }

    @Test
    public void testOtpUnchanged_returnsNull() {
        String sms = "رمز التحقق الخاص بك هو 982143. لا تشارك هذا الرمز مع أي شخص.";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNull("OTP message must return null", c);
    }

    @Test
    public void testPromoUnchanged_returnsNull() {
        String sms = "عرض خاص: مبروك تمت الموافقة على القرض بخصم يصل إلى 20%.";
        CandidateTransaction c = BankSmsParser.parse("CIB", sms);
        assertNull("Promo message must return null", c);
    }
}
