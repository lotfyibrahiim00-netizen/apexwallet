/**
 * ApexWallet v1.4.12 - Incoming Transfer & Review Card Test Suite
 * Tests Cases A through G specified in v1.4.12:
 * A. "تحويل إلى: حسابك المنتهي بـ 1659 من منال 300.00 جنيه" -> type 'income', direction 'income', amount 300, currency EGP, identifierDigits '1659', entityType 'account', merchant contains "منال" and starts with "تحويل من".
 * B. Same text with Arabic-Indic digits (١٦٥٩ / ٣٠٠) -> same result as A.
 * C. "تحويل إلى: حسابك المنتهي بـ 1659 من منال عبر انستاباي مبلغ 300 جنيه" -> income, merchant "InstaPay: منال".
 * D. English: "Transfer to your account ending 1659 from Manal EGP 300.00" -> income.
 * E. Outgoing stays outgoing: "تم تحويل 300 جنيه من حسابك المنتهي بـ 1659 إلى منال" -> type 'expense', merchant "تحويل إلى: منال".
 * F. Outgoing stays outgoing: "تم تحويل لحظي بمبلغ 300 جنيه من حسابك المنتهي بـ 1659 إلى 01012345678" -> expense.
 * G. Plain purchase, ATM withdrawal and OTP message give exactly the same output as before (OTP still null).
 * Plus: End-to-end approval of incoming transfer candidate creates an income (+300) on matched account.
 */

if (typeof localStorage === 'undefined' || !global.localStorage) {
  global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] !== undefined ? this._data[k] : null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; },
    clear() { this._data = {}; }
  };
}

const assert = require('assert');
const { WebFallbackParser, BankSmsEngine } = require('../sms_engine.js');
const { WalletAppStore } = require('../app.js');

console.log('====================================================');
console.log('🧪 ApexWallet v1.4.12 Incoming Transfer Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// Case A: Real user SMS: Transfer to own account from Manal
// ----------------------------------------------------
console.log('--- Test Case A: Real incoming transfer SMS (Arabic) ---');
{
  const sms = 'تحويل إلى: حسابك المنتهي بـ 1659 من منال 300.00 جنيه';
  const c = WebFallbackParser.parse('CIB', sms);
  assert.ok(c !== null, 'Candidate must not be null');
  assert.strictEqual(c.type, 'income', 'Type must be income');
  assert.strictEqual(c.direction, 'income', 'Direction must be income');
  assert.strictEqual(c.amount, 300, 'Amount must be 300');
  assert.strictEqual(c.currency, 'EGP', 'Currency must be EGP');
  assert.strictEqual(c.identifierDigits, '1659', 'Identifier digits must be 1659');
  assert.strictEqual(c.entityType, 'account', 'Entity type must be account');
  assert.strictEqual(c.transactionType, 'transfer', 'Transaction type must be transfer');
  assert.ok(c.merchant.includes('منال'), `Merchant must contain "منال": got "${c.merchant}"`);
  assert.ok(c.merchant.startsWith('تحويل من'), `Merchant must start with "تحويل من": got "${c.merchant}"`);
  console.log('  ✅ [PASS] Case A: type=income, direction=income, amount=300, digits=1659, merchant="' + c.merchant + '"');
}

// ----------------------------------------------------
// Case B: Same text with Arabic-Indic digits (١٦٥٩ / ٣٠٠)
// ----------------------------------------------------
console.log('--- Test Case B: Arabic-Indic numerals (١٦٥٩ / ٣٠٠) ---');
{
  const sms = 'تحويل إلى: حسابك المنتهي بـ ١٦٥٩ من منال ٣٠٠.٠٠ جنيه';
  const c = WebFallbackParser.parse('CIB', sms);
  assert.ok(c !== null, 'Candidate must not be null');
  assert.strictEqual(c.type, 'income', 'Type must be income');
  assert.strictEqual(c.direction, 'income', 'Direction must be income');
  assert.strictEqual(c.amount, 300, 'Amount must be 300');
  assert.strictEqual(c.currency, 'EGP', 'Currency must be EGP');
  assert.strictEqual(c.identifierDigits, '1659', 'Identifier digits must be normalized to 1659');
  assert.strictEqual(c.entityType, 'account', 'Entity type must be account');
  assert.strictEqual(c.transactionType, 'transfer', 'Transaction type must be transfer');
  assert.ok(c.merchant.includes('منال'), `Merchant must contain "منال": got "${c.merchant}"`);
  assert.ok(c.merchant.startsWith('تحويل من'), `Merchant must start with "تحويل من": got "${c.merchant}"`);
  console.log('  ✅ [PASS] Case B: successfully normalized numerals and matched Case A properties');
}

// ----------------------------------------------------
// Case C: Transfer via InstaPay to user's account
// ----------------------------------------------------
console.log('--- Test Case C: Incoming transfer via InstaPay ---');
{
  const sms = 'تحويل إلى: حسابك المنتهي بـ 1659 من منال عبر انستاباي مبلغ 300 جنيه';
  const c = WebFallbackParser.parse('CIB', sms);
  assert.ok(c !== null, 'Candidate must not be null');
  assert.strictEqual(c.type, 'income', 'Type must be income');
  assert.strictEqual(c.direction, 'income', 'Direction must be income');
  assert.strictEqual(c.amount, 300, 'Amount must be 300');
  assert.strictEqual(c.merchant, 'InstaPay: منال', `Merchant must be "InstaPay: منال": got "${c.merchant}"`);
  console.log('  ✅ [PASS] Case C: type=income, merchant="InstaPay: منال"');
}

// ----------------------------------------------------
// Case D: English transfer into user's account
// ----------------------------------------------------
console.log('--- Test Case D: English transfer to your account ---');
{
  const sms = 'Transfer to your account ending 1659 from Manal EGP 300.00';
  const c = WebFallbackParser.parse('CIB', sms);
  assert.ok(c !== null, 'Candidate must not be null');
  assert.strictEqual(c.type, 'income', 'Type must be income');
  assert.strictEqual(c.direction, 'income', 'Direction must be income');
  assert.strictEqual(c.amount, 300, 'Amount must be 300');
  assert.strictEqual(c.currency, 'EGP', 'Currency must be EGP');
  assert.strictEqual(c.identifierDigits, '1659', 'Identifier digits must be 1659');
  assert.ok(c.merchant.includes('Manal'), `Merchant must contain "Manal": got "${c.merchant}"`);
  console.log('  ✅ [PASS] Case D: type=income, amount=300, merchant="' + c.merchant + '"');
}

// ----------------------------------------------------
// Case E: Outgoing transfer stays outgoing (expense)
// ----------------------------------------------------
console.log('--- Test Case E: Outgoing transfer from your account to person ---');
{
  const sms = 'تم تحويل 300 جنيه من حسابك المنتهي بـ 1659 إلى منال';
  const c = WebFallbackParser.parse('CIB', sms);
  assert.ok(c !== null, 'Candidate must not be null');
  assert.strictEqual(c.type, 'expense', 'Type must be expense');
  assert.strictEqual(c.direction, 'expense', 'Direction must be expense');
  assert.strictEqual(c.amount, 300, 'Amount must be 300');
  assert.strictEqual(c.merchant, 'تحويل إلى: منال', `Merchant must be "تحويل إلى: منال": got "${c.merchant}"`);
  console.log('  ✅ [PASS] Case E: type=expense, merchant="تحويل إلى: منال"');
}

// ----------------------------------------------------
// Case F: Outgoing transfer to mobile number stays expense
// ----------------------------------------------------
console.log('--- Test Case F: Outgoing transfer to mobile number ---');
{
  const sms = 'تم تحويل لحظي بمبلغ 300 جنيه من حسابك المنتهي بـ 1659 إلى 01012345678';
  const c = WebFallbackParser.parse('CIB', sms);
  assert.ok(c !== null, 'Candidate must not be null');
  assert.strictEqual(c.type, 'expense', 'Type must be expense');
  assert.strictEqual(c.direction, 'expense', 'Direction must be expense');
  assert.strictEqual(c.amount, 300, 'Amount must be 300');
  assert.ok(c.merchant.includes('01012345678'), `Merchant must contain phone number: got "${c.merchant}"`);
  console.log('  ✅ [PASS] Case F: type=expense, merchant="' + c.merchant + '"');
}

// ----------------------------------------------------
// Case G: Plain purchase, ATM withdrawal, OTP message invariance
// ----------------------------------------------------
console.log('--- Test Case G: Plain purchase, ATM withdrawal, OTP rejection ---');
{
  // 1. Plain purchase
  const purch = WebFallbackParser.parse('CIB', 'Purchase with card ending 1234 for EGP 450.00 at Carrefour.');
  assert.ok(purch !== null, 'Purchase must be parsed');
  assert.strictEqual(purch.type, 'expense', 'Purchase must be expense');
  assert.strictEqual(purch.transactionType, 'purchase');
  assert.strictEqual(purch.amount, 450);

  // 2. ATM withdrawal
  const atm = WebFallbackParser.parse('CIB', 'Cash withdrawal of EGP 2,000.00 from ATM Arkan Plaza with card ending in 8492 on 24/11/2026.');
  assert.ok(atm !== null, 'ATM must be parsed');
  assert.strictEqual(atm.type, 'expense', 'ATM must be expense');
  assert.strictEqual(atm.transactionType, 'withdrawal');
  assert.strictEqual(atm.amount, 2000);

  // 3. OTP message (must return null)
  const otp = WebFallbackParser.parse('CIB', 'رمز التحقق الخاص بك هو 982143. لا تشارك هذا الرمز مع أي شخص.');
  assert.strictEqual(otp, null, 'OTP message must return null');

  // 4. Promo message (must return null)
  const promo = WebFallbackParser.parse('CIB', 'عرض خاص: مبروك تمت الموافقة على القرض بخصم يصل إلى 20%.');
  assert.strictEqual(promo, null, 'Promo message must return null');

  console.log('  ✅ [PASS] Case G: purchase=expense, ATM=withdrawal, OTP=null, Promo=null');
}

// ----------------------------------------------------
// Regressions Prevention (Urgent Fix: FIX-1 to FIX-6 & KEEP)
// Narrow incoming transfer gate to prevent false income on expenses
// ----------------------------------------------------
console.log('--- Test Regressions: FIX-1 to FIX-6 & KEEP ---');
{
  // FIX-1: Purchase mentioning "في بطاقتك" must stay expense
  const r1 = WebFallbackParser.parse('CIB', 'تمت عملية شراء بمبلغ 250 جنيه في بطاقتك المنتهية بـ 1234 لدى AMAZON');
  assert.ok(r1 !== null);
  assert.strictEqual(r1.type, 'expense');
  assert.strictEqual(r1.amount, 250);
  assert.ok(r1.merchant.includes('AMAZON'));
  console.log('  ✅ [PASS] FIX-1: purchase with "في بطاقتك" is expense (AMAZON 250)');

  // FIX-2: English purchase / charge mentioning "payment to your account" must stay expense
  const r2 = WebFallbackParser.parse('CIB', 'Your card ending 1234 was charged EGP 100 at NOON, payment to your account');
  assert.ok(r2 !== null);
  assert.strictEqual(r2.type, 'expense');
  assert.strictEqual(r2.amount, 100);
  console.log('  ✅ [PASS] FIX-2: "was charged ... payment to your account" is expense (NOON 100)');

  // FIX-3: Fee deduction mentioning "في حسابك" must stay expense
  const r3 = WebFallbackParser.parse('CIB', 'خصم 100 جنيه رسوم في حسابك المنتهي بـ 1234');
  assert.ok(r3 !== null);
  assert.strictEqual(r3.type, 'expense');
  assert.strictEqual(r3.amount, 100);
  console.log('  ✅ [PASS] FIX-3: fee deduction "خصم ... في حسابك" is expense (100)');

  // FIX-4a: Outgoing transfer to another person\'s account must stay expense
  const r4a = WebFallbackParser.parse('CIB', 'تم تحويل 500 جنيه إلى حساب أحمد المنتهي بـ 7788');
  assert.ok(r4a !== null);
  assert.strictEqual(r4a.type, 'expense');
  assert.strictEqual(r4a.amount, 500);
  console.log('  ✅ [PASS] FIX-4a: outgoing transfer to someone else is expense (500)');

  // FIX-4b: Ambiguous transfer without explicit direction must return null
  const r4b = WebFallbackParser.parse('CIB', 'تحويل 500 جنيه لحساب المنتهي بـ 7788');
  assert.strictEqual(r4b, null, 'Ambiguous transfer without destination must return null');
  console.log('  ✅ [PASS] FIX-4b: ambiguous transfer without destination returns null');

  // FIX-5: Outgoing transfer with debit wording "تم تحويل" must stay expense even with "الى حسابك"
  const r5 = WebFallbackParser.parse('CIB', 'تم تحويل 500 جنيه الى حسابك الخاص بك من حساب التوفير');
  assert.ok(r5 !== null);
  assert.strictEqual(r5.type, 'expense');
  assert.strictEqual(r5.amount, 500);
  console.log('  ✅ [PASS] FIX-5: debit "تم تحويل ... من حساب التوفير" is expense (500)');

  // FIX-6: Outgoing transfer "You sent ... to your account ending ..." must stay expense
  const r6 = WebFallbackParser.parse('CIB', 'You sent EGP 300 to Ahmed, to your account ending 1234 ref 998877');
  assert.ok(r6 !== null);
  assert.strictEqual(r6.type, 'expense');
  assert.strictEqual(r6.amount, 300);
  console.log('  ✅ [PASS] FIX-6: "You sent ... to your account" is expense (300)');

  // KEEP: Legitimate incoming transfer to user\'s account must remain income
  const rKeep = WebFallbackParser.parse('CIB', 'تحويل إلى: حسابك المنتهي بـ 1659 من منال 300.00 جنيه');
  assert.ok(rKeep !== null);
  assert.strictEqual(rKeep.type, 'income');
  assert.strictEqual(rKeep.amount, 300);
  assert.ok(rKeep.merchant.startsWith('تحويل من'));
  assert.ok(rKeep.merchant.includes('منال'));
  console.log('  ✅ [PASS] KEEP: incoming transfer to user account remains income (منال 300)');
}

// ----------------------------------------------------
// End-to-End Approval Flow Verification:
// Approving an incoming transfer candidate creates an income transaction (+300)
// and updates the linked account balance from 1,000 to 1,300.
// ----------------------------------------------------
console.log('--- Test Flow: Candidate Approval & Store Balance Increase ---');
(async () => {
  const store = new WalletAppStore();
  global.walletStore = store;
  global.store = store;

  // Setup bank & deposit account
  const bank = store.addBank({ name: 'Commercial International Bank', shortCode: 'CIB', accentColor: '#002D62' });
  const acc = store.addAccount({
    bankId: bank.id,
    name: 'CIB Current Account',
    accountNumber: '12345678901659',
    identifierDigits: '1659',
    balance: 1000.00
  });

  const engine = new BankSmsEngine();
  const rawSms = 'تحويل إلى: حسابك المنتهي بـ 1659 من منال 300.00 جنيه';
  const candidate = WebFallbackParser.parse('CIB', rawSms);
  assert.ok(candidate);
  assert.strictEqual(candidate.direction, 'income');
  assert.strictEqual(candidate.type, 'income');

  // Bind to engine pending queue
  candidate.matchedAccountId = acc.id;
  engine.pendingCandidates = [candidate];

  // Approve candidate with transactionType 'transfer'
  const res = await engine.approveCandidate(candidate.id, {
    accountId: acc.id,
    transactionType: 'transfer'
  });

  assert.ok(res.success, `Approval must succeed: ${res.error}`);
  assert.strictEqual(res.transaction.direction, 'income', 'Created transaction direction must be income');
  assert.strictEqual(res.transaction.type, 'income', 'Created transaction type must be income');
  assert.strictEqual(res.transaction.amount, 300, 'Transaction amount must be 300');
  assert.strictEqual(res.transaction.transactionType, 'transfer', 'Transaction type must remain transfer');

  // Check account balance after income (+300)
  const updatedAcc = store.getAccount(acc.id);
  assert.strictEqual(updatedAcc.balance, 1300.00, `Account balance must increase from 1000 to 1300: got ${updatedAcc.balance}`);

  console.log('  ✅ [PASS] Approve flow created income transaction (+300) and increased account balance to 1300\n');

  console.log('----------------------------------------------------');
  console.log('All v1.4.12 Incoming Transfer Tests Passed (100%)');
  console.log('----------------------------------------------------');
})();
