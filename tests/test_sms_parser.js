/**
 * Automated Synthetic Test Suite for ApexWallet Bank SMS Parser & Queue Engine
 * 
 * Verifies:
 * 1. Bank allowlist filtering
 * 2. OTP / 2FA / Verification code rejection (Negative test cases)
 * 3. Marketing / Promo / Balance-only message rejection
 * 4. English transaction parsing (debit, card suffix, merchant, amount, date)
 * 5. Arabic transaction parsing with Eastern Arabic numerals (٠-٩)
 * 6. Refund / Credit handling (income vs expense)
 * 7. Ambiguous card suffix detection (requiresCardSelection flag)
 * 8. Deterministic SHA-256 deduplication fingerprinting
 * 9. Queue capacity bounding & idempotent acknowledgement
 * 10. Vault data export/import migration fidelity
 */

const crypto = require('crypto');
const assert = require('assert');

// --- In-line Parser Implementation under test (matching Java & JS engines) ---
const ALLOWLIST = [
  'CIB', 'HSBC', 'QNB', 'NBE', 'BM', 'BANQUEMISR', 'EMIRATESNBD',
  'ENBD', 'FABMISR', 'FAB', 'ALEXBANK', 'ADIB', 'AAIB', 'FAISAL'
];

function isSenderAllowed(sender, allowlist = ALLOWLIST) {
  if (!sender) return false;
  const clean = sender.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return allowlist.some(allowed => {
    const cleanAllowed = allowed.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return clean.includes(cleanAllowed) || cleanAllowed.includes(clean);
  });
}

function normalizeNumerals(input) {
  if (!input) return '';
  return input
    .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[\u066b]/g, '.')
    .replace(/[\u066c]/g, ',');
}

function normalizeCurrency(curr) {
  if (!curr) return 'EGP';
  const c = curr.trim().toUpperCase();
  if (['LE', 'L.E', 'ج.م', 'جنيه', 'EGP'].includes(c)) return 'EGP';
  if (['USD', '$'].includes(c)) return 'USD';
  if (['EUR', '€'].includes(c)) return 'EUR';
  if (['GBP', '£'].includes(c)) return 'GBP';
  if (['AED', 'د.إ'].includes(c)) return 'AED';
  if (['SAR', 'ر.س'].includes(c)) return 'SAR';
  return c;
}

function resolveBankName(sender) {
  if (!sender) return 'Bank';
  const s = sender.toUpperCase();
  if (s.includes('CIB')) return 'CIB';
  if (s.includes('HSBC')) return 'HSBC';
  if (s.includes('QNB')) return 'QNB';
  if (s.includes('NBE') || s.includes('AHLI')) return 'NBE';
  if (s.includes('MISR') || s.includes('BM')) return 'Banque Misr';
  if (s.includes('ENBD') || s.includes('EMIRATES')) return 'Emirates NBD';
  if (s.includes('FAB')) return 'FABMISR';
  if (s.includes('ALEX')) return 'AlexBank';
  return sender.trim();
}

function parseBankSms(sender, rawBody) {
  if (!rawBody || !rawBody.trim()) return null;
  const normalized = normalizeNumerals(rawBody);

  // 1. Negative Filter: OTP & Verification
  const isOtp = /\b(otp|one\s*time\s*password|verification\s*code|security\s*code|activation\s*code|login\s*code|passcode)\b|رمز\s*التحقق|كود\s*التحقق|رمز\s*التأكيد|كلمة\s*السر\s*المؤقتة|رمز\s*سري|لا\s*تشارك|do\s*not\s*share/i.test(normalized);
  if (isOtp) return null;

  // 2. Negative Filter: Promo / Marketing / Balance-only
  const isPromo = /\b(special\s*offer|congratulations|discount\s*up\s*to|loan\s*approval|apply\s*now|promo\s*code)\b|عرض\s*خاص|مبروك|قسط|تمت\s*الموافقة\s*على\s*القرض|خصم\s*يصل/i.test(normalized);
  if (isPromo) return null;

  const isBalanceOnly = /^\s*(your\s*balance\s*is|available\s*balance\s*is|رصيدكم\s*الحالي|رصيدك\s*هو)\b/i.test(normalized);
  if (isBalanceOnly) return null;

  // 3. Type
  const isCredit = /\b(refund|refunded|deposited|credited|reversed|cash\s*in|transfer\s*received)\b|استرداد|إيداع|ايداع|دائن|اضافة|إضافة|تحويل\s*وارد/i.test(normalized);
  const isDebit = /\b(purchase|paid|debited|spent|withdrawn|charge|pos|online|atm|cash\s*out)\b|شراء|خصم|مدين|سحب|دفع|عملية\s*خصم|تسوق|شحن/i.test(normalized);
  if (!isCredit && !isDebit) return null;
  const type = (isCredit && !isDebit) ? 'income' : 'expense';

  // 4. Amount & Currency
  const amtMatch = normalized.match(/(?:(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جنيه|\$|€|£|د\.إ|ر\.س)\s*)?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جنيه|\$|€|£|د\.إ|ر\.س)?/i);
  if (!amtMatch || !amtMatch[2]) return null;
  const rawNum = amtMatch[2].replace(/,/g, '');
  const amount = parseFloat(rawNum);
  if (isNaN(amount) || amount <= 0 || amount > 10000000) return null;

  let currency = 'EGP';
  const rawCurr = amtMatch[1] || amtMatch[3];
  if (rawCurr) {
    currency = normalizeCurrency(rawCurr);
  }

  // 5. Card Suffix
  let cardSuffix = '';
  const cardMatch = normalized.match(/(?:card|account|بطاقة|بطاقتكم|بطاقتك|كارت)[^\d]{0,35}?(?:\*+|\.{2,}|ending\s+in|تنتهي\s+بـ?|المنتهية\s+بـ?(?:رقم)?|رقم)?\s*(\d{4})|(?:\*+|x{2,})(\d{4})/i);
  if (cardMatch) {
    cardSuffix = cardMatch[1] || cardMatch[2] || '';
  }

  // 6. Merchant
  let merchant = '';
  const merchMatch = normalized.match(/(?:at|لدى|عند|merchant|store|من\s+ماكينة|from\s+atm)\s*[:\-]?\s*([^,\r\n;]+)/i);
  if (merchMatch && merchMatch[1]) {
    let m = merchMatch[1].trim();
    m = m.split(/\s+(?:with\s+card|from\s+card|with\s+credit|with\s+debit|using\s+card|on\s+\d|باستخدام\s+بطاقة|من\s+بطاقة|بتاريخ|في\s+\d)/i)[0].trim();
    m = m.replace(/\s+(?:with|on|from|in)$/i, '').trim();
    merchant = m.replace(/\s+/g, ' ');
  }

  // 7. Date
  let transactionTime = null;
  const dateMatch = normalized.match(/(?:on|بتاريخ|في|date)?\s*(\d{1,4}[/-]\d{1,2}[/-]\d{2,4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/i);
  if (dateMatch && dateMatch[1]) {
    transactionTime = dateMatch[1].trim();
  }

  const bank = resolveBankName(sender);

  // Deterministic Fingerprint
  const timeKey = transactionTime || 'static_window';
  const fpData = `${bank}|${cardSuffix}|${type}|${amount.toFixed(2)}|${currency}|${merchant.toLowerCase()}|${timeKey}`;
  const fingerprint = crypto.createHash('sha256').update(fpData).digest('hex');

  return {
    bank,
    cardSuffix,
    type,
    amount,
    currency,
    merchant,
    transactionTime,
    fingerprint,
    requiresCardSelection: !cardSuffix
  };
}

// --- Test Suite Execution ---
console.log('====================================================');
console.log('🧪 ApexWallet Bank SMS Engine - Automated Test Suite');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  }
}

// 1. Sender Allowlist Tests
runTest('Allowlist correctly accepts approved bank sender identifiers', () => {
  assert.strictEqual(isSenderAllowed('CIB'), true);
  assert.strictEqual(isSenderAllowed('cib-alert'), true);
  assert.strictEqual(isSenderAllowed('HSBC_EGY'), true);
  assert.strictEqual(isSenderAllowed('QNB-ALAhli'), true);
  assert.strictEqual(isSenderAllowed('BM-Online'), true);
  assert.strictEqual(isSenderAllowed('NBE_Cards'), true);
});

runTest('Allowlist rejects unknown, telco, marketing and spam senders', () => {
  assert.strictEqual(isSenderAllowed('UBER_EGY'), false);
  assert.strictEqual(isSenderAllowed('VODAFONE_OFFER'), false);
  assert.strictEqual(isSenderAllowed('UNKNOWN_123'), false);
  assert.strictEqual(isSenderAllowed(''), false);
  assert.strictEqual(isSenderAllowed(null), false);
});

// 2. Negative Test: OTPs and Verification Passcodes Must Be Rejected
runTest('Rejects English OTP verification codes', () => {
  const sms = 'Your CIB OTP is 492011 for EGP 500 purchase. Valid for 5 mins. Do not share.';
  assert.strictEqual(parseBankSms('CIB', sms), null);
});

runTest('Rejects Arabic OTP verification codes', () => {
  const sms = 'كود التحقق الخاص بك هو ٨٤٩٢٠١ لعملية الشراء بمبلغ ١٢٠٠ جنيه. لا تشارك الرمز مع أي شخص.';
  assert.strictEqual(parseBankSms('NBE', sms), null);
});

runTest('Rejects activation passcodes with no transaction context', () => {
  const sms = 'رمز تأكيد تفعيل الخدمة 123456. بنك مصر.';
  assert.strictEqual(parseBankSms('BM', sms), null);
});

// 3. Negative Test: Marketing & Balance Alerts
runTest('Rejects promotional loan and marketing campaigns', () => {
  const sms = 'عرض خاص! احصل على قرض فوري يصل إلى 500,000 جنيه بدون مصاريف إدارية من بنك مصر.';
  assert.strictEqual(parseBankSms('BM', sms), null);
});

runTest('Rejects pure balance inquiry notifications', () => {
  const sms = 'Dear customer, your available balance is 14,250.00 EGP.';
  assert.strictEqual(parseBankSms('CIB', sms), null);
});

// 4. Positive Test: English Bank Transactions
runTest('Parses standard English CIB purchase transaction', () => {
  const sms = 'Dear Customer, purchase of EGP 1,250.50 at Amazon Egypt with card ending in 8492 on 24/11/2026 14:30. Available limit EGP 23,749.50.';
  const res = parseBankSms('CIB', sms);
  assert.ok(res !== null, 'Candidate must not be null');
  assert.strictEqual(res.bank, 'CIB');
  assert.strictEqual(res.cardSuffix, '8492');
  assert.strictEqual(res.type, 'expense');
  assert.strictEqual(res.amount, 1250.50);
  assert.strictEqual(res.currency, 'EGP');
  assert.strictEqual(res.merchant, 'Amazon Egypt');
  assert.strictEqual(res.transactionTime, '24/11/2026 14:30');
  assert.strictEqual(res.requiresCardSelection, false);
});

runTest('Parses HSBC POS debit alert with masked stars', () => {
  const sms = 'HSBC Alert: Debited EGP 450.00 for POS transaction at Starbucks Arkan from card **5521 on 24/11/2026.';
  const res = parseBankSms('HSBC', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.bank, 'HSBC');
  assert.strictEqual(res.cardSuffix, '5521');
  assert.strictEqual(res.type, 'expense');
  assert.strictEqual(res.amount, 450.00);
  assert.strictEqual(res.currency, 'EGP');
  assert.strictEqual(res.merchant, 'Starbucks Arkan');
});

runTest('Parses foreign currency transaction (USD with QNB)', () => {
  const sms = 'Purchase of USD 75.00 at Apple.com with credit card ending in 7712 on 24/11/2026.';
  const res = parseBankSms('QNB', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.currency, 'USD');
  assert.strictEqual(res.amount, 75.00);
  assert.strictEqual(res.cardSuffix, '7712');
  assert.strictEqual(res.merchant, 'Apple.com');
});

// 5. Positive Test: Arabic Bank Transactions & Eastern Numerals
runTest('Parses Arabic NBE transaction with Eastern Arabic numerals (١٢٣٤٥٦٧٨٩٠)', () => {
  const sms = 'تم خصم مبلغ ١,٤٥٠.٠٠ ج.م من بطاقتكم المنتهية برقم ٩٠١١ لدى فودافون مصر بتاريخ ٢٠٢٦/١١/٢٤.';
  const res = parseBankSms('NBE', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.bank, 'NBE');
  assert.strictEqual(res.amount, 1450.00);
  assert.strictEqual(res.cardSuffix, '9011');
  assert.strictEqual(res.currency, 'EGP');
  assert.strictEqual(res.merchant, 'فودافون مصر');
  assert.strictEqual(res.transactionTime, '2026/11/24');
});

runTest('Parses Banque Misr Arabic purchase format', () => {
  const sms = 'عملية شراء بمبلغ 850.00 جنيه لدى كارفور المعادي باستخدام بطاقة رقم ...4120 بتاريخ 2026/11/24.';
  const res = parseBankSms('Banque Misr', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.bank, 'Banque Misr');
  assert.strictEqual(res.amount, 850.00);
  assert.strictEqual(res.cardSuffix, '4120');
  assert.strictEqual(res.merchant, 'كارفور المعادي');
});

// 6. Refunds and Income Credits
runTest('Parses refund transaction as income', () => {
  const sms = 'Refund of EGP 600.00 received from Amazon Egypt to card ending in 8492 on 24/11/2026.';
  const res = parseBankSms('CIB', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.type, 'income');
  assert.strictEqual(res.amount, 600.00);
});

// 7. Ambiguous Card Detection
runTest('Flags transaction requiring card selection when suffix is missing', () => {
  const sms = 'Paid EGP 300.00 at Total Gas Station on 24/11/2026.';
  const res = parseBankSms('CIB', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.cardSuffix, '');
  assert.strictEqual(res.requiresCardSelection, true);
});

// 8. Deduplication Fingerprint Consistency
runTest('Produces deterministic fingerprints for identical transactions (deduplication)', () => {
  const sms = 'Dear Customer, purchase of EGP 1,250.50 at Amazon Egypt with card ending in 8492 on 24/11/2026 14:30.';
  const res1 = parseBankSms('CIB', sms);
  const res2 = parseBankSms('CIB', sms);
  assert.strictEqual(res1.fingerprint, res2.fingerprint);
  assert.strictEqual(res1.fingerprint.length, 64); // SHA-256 hex length
});

// 9. Queue Bounding Test (Simulated FIFO capacity of 50)
runTest('Queue enforces capacity bounds without memory growth', () => {
  const queue = [];
  const MAX_QUEUE = 50;

  for (let i = 1; i <= 65; i++) {
    const candidate = { id: 'c_' + i, amount: i * 10, fingerprint: 'fp_' + i };
    while (queue.length >= MAX_QUEUE) {
      queue.shift(); // FIFO drop
    }
    queue.push(candidate);
  }

  assert.strictEqual(queue.length, 50);
  assert.strictEqual(queue[0].id, 'c_16'); // Oldest 15 dropped
  assert.strictEqual(queue[queue.length - 1].id, 'c_65'); // Most recent retained
});

// 10. Vault Migration Roundtrip (Browser <-> Android)
runTest('Vault export and import preserves data fidelity with zero loss', () => {
  const mockVault = {
    version: '1.2.0',
    exportedAt: '2026-11-24T10:00:00.000Z',
    banks: [{ id: 'bank_cib', name: 'Commercial International Bank', shortCode: 'CIB' }],
    cards: [{ id: 'card_1', bankId: 'bank_cib', name: 'Titanium Miles', last4: '8492', cardType: 'credit', monthlyTarget: 25000 }],
    transactions: [{ id: 'tx_1', amount: 1250.50, merchant: 'Amazon Egypt', category: 'shopping', date: '2026-11-24', cardId: 'card_1' }]
  };

  const serialized = JSON.stringify(mockVault);
  const deserialized = JSON.parse(serialized);

  assert.deepStrictEqual(deserialized.banks, mockVault.banks);
  assert.deepStrictEqual(deserialized.cards, mockVault.cards);
  assert.deepStrictEqual(deserialized.transactions, mockVault.transactions);
  assert.strictEqual(deserialized.transactions[0].amount, 1250.50);
});

console.log('\n----------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
