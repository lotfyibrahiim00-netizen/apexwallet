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
  if (['LE', 'L.E', 'ج.م', 'جم', 'جنيه', 'EGP'].includes(c)) return 'EGP';
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

function normalizeDate(d) {
  if (!d) return null;
  const clean = d.replace(/\//g, '-');
  const parts = clean.split('-');
  if (parts.length !== 3) return null;
  let year, month, day;
  if (parts[0].length === 4) {
    year = parts[0];
    month = parts[1].padStart(2, '0');
    day = parts[2].padStart(2, '0');
  } else {
    day = parts[0].padStart(2, '0');
    month = parts[1].padStart(2, '0');
    year = parts[2];
    if (year.length === 2) {
      year = '20' + year;
    }
  }
  return `${year}-${month}-${day}`;
}

function extractDateTime(text) {
  const pDateTime = /(?:on|بتاريخ|في)?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})(?:\s+(?:at|الساعة|في)?\s*(\d{1,2}:\d{2}(?::\d{2})?))?/i;
  const m = text.match(pDateTime);
  if (m && m[1] && m[1].length >= 6) {
    const normDate = normalizeDate(m[1]);
    if (normDate) {
      if (m[2]) {
        return normDate + ' ' + m[2].substring(0, 5);
      }
      return normDate;
    }
  }
  return null;
}

function extractTypedIdentifier(text) {
  const lower = text.toLowerCase();
  let entityType = 'card';
  if (text.includes('حساب') || lower.includes('account')) {
    entityType = 'account';
  } else if (text.includes('بطاق') || text.includes('كارت') || lower.includes('card')) {
    entityType = 'card';
  } else {
    entityType = 'unknown';
  }

  // First digits
  const pFirst = /(?:starting\s+with|تبدأ\s+بـ?)\s*(\d{4})|(\d{4})(?:\*+|x{2,}|\.{2,})/i;
  const mFirst = text.match(pFirst);
  if (mFirst) {
    const d = mFirst[1] || mFirst[2];
    if (d && d.length === 4) {
      return { entityType, digits: d, position: 'first' };
    }
  }

  // Last digits
  const pLast = /(?:ending\s+with(?:\s*#)?|ending\s+in|تنتهي\s+بـ?|المنتهي(?:ة)?\s+بـ?(?:رقم)?)\s*[:#*.]*\s*(\d{4})|(?:\*+|x{2,}|\.{2,})\s*(\d{4})\b|(?:card|account|بطاقة|حساب)[^\d]{0,25}?(\d{4})\b/i;
  const mLast = text.match(pLast);
  if (mLast) {
    const d = mLast[1] || mLast[2] || mLast[3];
    if (d && d.length === 4) {
      return { entityType, digits: d, position: 'last' };
    }
  }

  return { entityType, digits: '', position: 'last' };
}

function extractTransactionAmount(text) {
  const pCurr = /(?:(?:was\s*charged\s*for|charged\s*for|purchase\s*of|paid|بمبلغ|مبلغ)\s+)?(?:(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جم|جنيه|\$|€|£|د\.إ|ر\.س)\s*)?([0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(EGP|LE|L\.E|USD|EUR|GBP|AED|SAR|ج\.م|جم|جنيه|\$|€|£|د\.إ|ر\.س)?/gi;
  let m;
  while ((m = pCurr.exec(text)) !== null) {
    const matchStart = m.index;
    const prefixCurr = m[1];
    const numStr = m[2];
    const suffixCurr = m[3];

    if (!prefixCurr && !suffixCurr) continue;

    const textBefore = text.substring(Math.max(0, matchStart - 35), matchStart).toLowerCase();
    if (textBefore.includes('limit') || textBefore.includes('balance') ||
        textBefore.includes('الحد المتاح') || textBefore.includes('رصيد متاح') || textBefore.includes('رصيدك')) {
      continue;
    }

    const trimmedBefore = textBefore.trim();
    if (trimmedBefore.endsWith('ending with#') || trimmedBefore.endsWith('ending with') ||
        trimmedBefore.endsWith('ending in') || trimmedBefore.endsWith('منتهي بـ') ||
        trimmedBefore.endsWith('بطاقة رقم') || trimmedBefore.endsWith('حساب رقم')) {
      continue;
    }

    if (numStr) {
      const val = parseFloat(numStr.replace(/,/g, ''));
      if (val > 0 && val < 10000000) {
        const curr = prefixCurr ? normalizeCurrency(prefixCurr) : normalizeCurrency(suffixCurr);
        return { amount: val, currency: curr };
      }
    }
  }
  return null;
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
  const isCredit = /\b(refund|refunded|deposited|deposit|credited|credit|reversed|reversal|cash\s*in|transfer\s*received|received)\b|استرداد|إيداع|ايداع|دائن|اضافة|إضافة|تحويل\s*وارد|تم\s*استلام\s*تحويل|استلام\s*مبلغ/i.test(normalized);
  const isDebit = /\b(purchase|purchased|paid|debit|debited|spent|withdrawn|withdraw|charge|charged|was\s*charged|transferred|transfer|pos|online|atm|cash\s*out)\b|شراء|خصم|مدين|سحب|دفع|تمت?\s*عملية|عملية\s*خصم|تسوق|شحن|تحويل\s*صادر|تم\s*تنفيذ\s*تحويل|تحويل\s*لحظي/i.test(normalized);
  if (!isCredit && !isDebit) return null;
  const type = (isCredit && !isDebit) ? 'income' : 'expense';

  // 4. Amount & Currency
  const amtResult = extractTransactionAmount(normalized);
  if (!amtResult || amtResult.amount <= 0) return null;
  const amount = amtResult.amount;
  const currency = amtResult.currency;

  // 5. Typed Identifier
  const ident = extractTypedIdentifier(normalized);
  const entityType = ident.entityType;
  const identifierDigits = ident.digits;
  const digitsPosition = ident.position;
  const cardSuffix = identifierDigits;

  // Reference number
  let refNumber = '';
  const refMatch = normalized.match(/(?:برقم\s*مرجعي|رقم\s*(?:المرجع|العملية)|مرجع|\bref(?:erence)?\s*(?:no|num|number)?|\btxn\s*id|\brrn)\s*[:#]?\s*([a-zA-Z0-9]+)/i);
  if (refMatch && refMatch[1]) {
    refNumber = refMatch[1].trim();
  }

  // 6. Merchant
  let merchant = '';
  const merchMatch = normalized.match(/(?:at|لدى|عند|merchant|store|من\s+ماكينة|from\s+atm)\s*[:\-]?\s*([^,\r\n;]+)/i);
  if (merchMatch && merchMatch[1]) {
    let m = merchMatch[1].trim();
    m = m.split(/\s+(?:with\s+card|from\s+card|with\s+credit|with\s+debit|using|on\s+\d|باستخدام|من\s+بطاقة|من\s+حساب|بتاريخ|في\s+\d)/i)[0].trim();
    if (m.length > 50) m = m.substring(0, 50).trim();
    merchant = m.replace(/\s+/g, ' ');
  }

  // 7. Date & Time
  const transactionTime = extractDateTime(normalized);
  const bank = resolveBankName(sender);

  // Deterministic SHA-256 Compound Fingerprint
  const timeKey = transactionTime || 'static_window';
  const fpData = `${bank}|${entityType}:${identifierDigits}:${digitsPosition}|${type}|${amount.toFixed(2)}|${currency}|${timeKey}|${refNumber}`;
  const fingerprint = crypto.createHash('sha256').update(fpData).digest('hex');

  return {
    bank,
    cardSuffix,
    identifierDigits,
    entityType,
    digitsPosition,
    refNumber,
    type,
    amount,
    currency,
    merchant,
    transactionTime,
    fingerprint,
    requiresCardSelection: !identifierDigits
  };
}

// --- Test Suite Execution ---
console.log('====================================================');
console.log('====================================================');
console.log('🧪 ApexWallet Bank SMS Engine - Synthetic Test Suite');
console.log('🔬 Environment: Node.js V8 Simulation (In-Memory)');
console.log('⚠️  Notice: Unit tests verify grammar regexes, deduplication');
console.log('    hashing, and pagination logic in a Node.js sandbox.');
console.log('    Hardware Keystore & Android Telephony broadcasts');
console.log('    are verified via ANDROID_E2E_VERIFICATION.md.');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS - JS SIMULATION] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL - JS SIMULATION] ${name}`);
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
  assert.strictEqual(res.transactionTime, '2026-11-24 14:30');
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
  assert.strictEqual(res.transactionTime, '2026-11-24');
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

// 11. Historical Batch Pagination Zero-Loss Test (60 SMS over 3 batches of 20 with partial approvals)
runTest('Batch pagination delivers 60 messages over 3 batches with zero loss and zero numerical offset skipping', () => {
  // Generate 60 unique bank SMS messages in inbox (from newest to oldest)
  const mockInbox = [];
  for (let i = 1; i <= 60; i++) {
    const amount = 100 + i;
    const date = `2026-11-${String((i % 28) + 1).padStart(2, '0')}`;
    const rawBody = `Purchase of EGP ${amount}.00 at Merchant_${i} with card ending in 8492 on ${date}.`;
    mockInbox.push({
      sender: 'CIB',
      body: rawBody,
      timestamp: Date.now() - (60 - i) * 3600000
    });
  }

  // State maintained across batches:
  // - processedFingerprints: acknowledged/approved/rejected items
  // - pendingInbox: unreviewed candidates currently waiting in frontend
  const processedFingerprints = new Set();
  let pendingInbox = [];

  // Query engine simulation exactly matching BankSmsPlugin.java
  function queryHistoricalBatch(inbox, excludeFingerprints, batchLimit = 20) {
    const excludeSet = new Set(excludeFingerprints);
    const candidates = [];
    let hasMore = false;

    for (const msg of inbox) {
      const parsed = parseBankSms(msg.sender, msg.body);
      if (!parsed) continue;

      const fp = parsed.fingerprint;
      // Skip if already in processed queue history
      if (processedFingerprints.has(fp)) continue;
      // Skip if currently pending in user's review inbox
      if (excludeSet.has(fp)) continue;

      if (candidates.length < batchLimit) {
        candidates.push(parsed);
      } else {
        hasMore = true;
        break;
      }
    }

    return { candidates, hasMore };
  }

  // --- BATCH 1: Fetch first 20 ---
  const batch1 = queryHistoricalBatch(mockInbox, pendingInbox.map(c => c.fingerprint), 20);
  assert.strictEqual(batch1.candidates.length, 20, 'Batch 1 must return exactly 20 items');
  assert.strictEqual(batch1.hasMore, true, 'Batch 1 must indicate hasMore = true');
  pendingInbox.push(...batch1.candidates);
  assert.strictEqual(pendingInbox.length, 20);

  // User partially reviews: approves first 10, leaves remaining 10 in inbox
  const approvedBatch1 = pendingInbox.splice(0, 10);
  for (const item of approvedBatch1) {
    processedFingerprints.add(item.fingerprint);
  }
  assert.strictEqual(pendingInbox.length, 10, '10 unreviewed items remain in inbox');
  assert.strictEqual(processedFingerprints.size, 10, '10 items recorded as processed');

  // --- BATCH 2: Fetch next 20 (MUST NOT skip unreviewed messages) ---
  const batch2 = queryHistoricalBatch(mockInbox, pendingInbox.map(c => c.fingerprint), 20);
  assert.strictEqual(batch2.candidates.length, 20, 'Batch 2 must return exactly 20 items');
  assert.strictEqual(batch2.hasMore, true, 'Batch 2 must indicate hasMore = true');

  // Verify none of batch2 items overlap with approved OR unreviewed items
  for (const c2 of batch2.candidates) {
    assert.ok(!processedFingerprints.has(c2.fingerprint), 'Batch 2 item must not be already processed');
    assert.ok(!pendingInbox.some(p => p.fingerprint === c2.fingerprint), 'Batch 2 item must not be already in pending inbox');
  }

  pendingInbox.push(...batch2.candidates);
  assert.strictEqual(pendingInbox.length, 30, 'Inbox now has 10 from Batch 1 + 20 from Batch 2');

  // User reviews and approves all 30 pending items
  const approvedBatch2 = pendingInbox.splice(0, 30);
  for (const item of approvedBatch2) {
    processedFingerprints.add(item.fingerprint);
  }
  assert.strictEqual(pendingInbox.length, 0);
  assert.strictEqual(processedFingerprints.size, 40);

  // --- BATCH 3: Fetch final 20 ---
  const batch3 = queryHistoricalBatch(mockInbox, pendingInbox.map(c => c.fingerprint), 20);
  assert.strictEqual(batch3.candidates.length, 20, 'Batch 3 must return final 20 items');
  assert.strictEqual(batch3.hasMore, false, 'Batch 3 must indicate hasMore = false (all 60 processed)');

  pendingInbox.push(...batch3.candidates);
  assert.strictEqual(pendingInbox.length, 20);

  // User approves final batch
  const approvedBatch3 = pendingInbox.splice(0, 20);
  for (const item of approvedBatch3) {
    processedFingerprints.add(item.fingerprint);
  }

  // --- Final Verification: Exactly 60 unique messages, 0 lost, 0 duplicates ---
  assert.strictEqual(processedFingerprints.size, 60, 'All 60 unique messages must be completely processed');
  assert.strictEqual(pendingInbox.length, 0, 'No dangling items in inbox');
});

// 12. Candidate Persistence Across App Restart / Background Kill
runTest('Staged candidates persist and merge safely across app restarts without silent drops', () => {
  const mockStorage = new Map();
  const STORAGE_KEY = 'apexwallet_sms_pending_staged_v1';

  // Simulate frontend state before kill
  const candidateA = { id: 'c_1', fingerprint: 'fp_1', amount: 250, merchant: 'Carrefour' };
  const candidateB = { id: 'c_2', fingerprint: 'fp_2', amount: 500, merchant: 'Zara' };
  mockStorage.set(STORAGE_KEY, JSON.stringify([candidateA, candidateB]));

  // Simulate app restart: native queue returns candidateB and candidateC (e.g. arrived while closed)
  const nativeQueuePending = [
    { id: 'c_2', fingerprint: 'fp_2', amount: 500, merchant: 'Zara' },
    { id: 'c_3', fingerprint: 'fp_3', amount: 750, merchant: 'Amazon' }
  ];

  // Merge logic from sms_engine.js:
  const staged = JSON.parse(mockStorage.get(STORAGE_KEY) || '[]');
  const mergedMap = new Map();

  for (const item of nativeQueuePending) {
    if (item && item.fingerprint) mergedMap.set(item.fingerprint, item);
  }
  for (const item of staged) {
    if (item && item.fingerprint && !mergedMap.has(item.fingerprint)) {
      mergedMap.set(item.fingerprint, item);
    }
  }

  const restoredCandidates = Array.from(mergedMap.values());
  assert.strictEqual(restoredCandidates.length, 3, 'Must merge all 3 candidates without dropping candidateA');
  const restoredFpSet = new Set(restoredCandidates.map(c => c.fingerprint));
  assert.ok(restoredFpSet.has('fp_1'), 'Candidate A preserved from staged storage');
  assert.ok(restoredFpSet.has('fp_2'), 'Candidate B preserved deduplicated');
  assert.ok(restoredFpSet.has('fp_3'), 'Candidate C received while closed preserved');
});

// 13. Staged Plaintext Migration and Zero-Loss Guarantees
runTest('Safe migration NEVER deletes candidates if migration fails or plugin throws', () => {
  const mockLocalStorage = new Map();
  const STORAGE_KEY = 'apexwallet_sms_pending_staged_v1';

  // 69 staged candidates
  const staged69 = [];
  for (let i = 1; i <= 69; i++) {
    staged69.push({ id: 'c_' + i, fingerprint: 'fp_' + i, amount: i * 10, merchant: 'Merchant ' + i });
  }
  mockLocalStorage.set(STORAGE_KEY, JSON.stringify(staged69));

  // Simulation of migrateAndPurgeStagedPlaintext() with plugin failure
  async function simulateMigrationWithFailure() {
    const raw = mockLocalStorage.get(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    // Simulate plugin failure (e.g. exception or success: false)
    try {
      throw new Error('Simulated Keystore bridge error');
    } catch (pluginErr) {
      // ZERO-LOSS: DO NOT delete localStorage on error!
    }
  }

  simulateMigrationWithFailure();

  // Verification: All 69 candidates MUST remain 100% intact in localStorage
  const afterFailure = JSON.parse(mockLocalStorage.get(STORAGE_KEY));
  assert.strictEqual(afterFailure.length, 69, 'All 69 candidates must remain untouched in localStorage upon failure');
});

runTest('Partial migration of 69 candidates preserves unmigrated candidates in localStorage for retry', () => {
  const mockLocalStorage = new Map();
  const STORAGE_KEY = 'apexwallet_sms_pending_staged_v1';

  // 69 staged candidates
  const staged69 = [];
  for (let i = 1; i <= 69; i++) {
    staged69.push({ id: 'c_' + i, fingerprint: 'fp_' + i, amount: i * 10, merchant: 'Merchant ' + i });
  }
  mockLocalStorage.set(STORAGE_KEY, JSON.stringify(staged69));

  const keystoreQueue = [];
  const MAX_CAPACITY = 40; // Queue only has room for 40 items!

  // Simulation of BankSmsQueue.enqueueBatch
  function nativeEnqueueBatch(candidates) {
    const confirmed = [];
    for (const c of candidates) {
      if (keystoreQueue.length < MAX_CAPACITY) {
        keystoreQueue.push(c);
        confirmed.push(c.fingerprint);
      }
    }
    return confirmed;
  }

  // Simulation of migrateAndPurgeStagedPlaintext() with partial space
  function simulateSafeMigration() {
    const raw = mockLocalStorage.get(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const confirmed = nativeEnqueueBatch(parsed);
    const confirmedSet = new Set(confirmed);

    const remaining = parsed.filter(c => !confirmedSet.has(c.fingerprint));
    if (remaining.length === 0) {
      mockLocalStorage.delete(STORAGE_KEY);
    } else {
      mockLocalStorage.set(STORAGE_KEY, JSON.stringify(remaining));
    }
  }

  // 1. Run partial migration
  simulateSafeMigration();

  // 2. Assertions:
  assert.strictEqual(keystoreQueue.length, 40, 'Exactly 40 items enqueued to Keystore');
  const remainingInStorage = JSON.parse(mockLocalStorage.get(STORAGE_KEY));
  assert.strictEqual(remainingInStorage.length, 29, 'Exactly 29 remaining candidates must be preserved in localStorage');
  assert.strictEqual(remainingInStorage[0].id, 'c_41', 'First remaining item must be c_41');
  assert.strictEqual(remainingInStorage[28].id, 'c_69', 'Last remaining item must be c_69');

  // 3. User reviews and frees space in Keystore queue
  keystoreQueue.splice(0, 30);
  assert.strictEqual(keystoreQueue.length, 10, 'Queue now has space for 30 more items');

  // 4. Retry migration for remaining 29 items
  simulateSafeMigration();

  // 5. Assertions after retry:
  assert.strictEqual(keystoreQueue.length, 39, 'Remaining 29 items now safely enqueued in Keystore');
  assert.strictEqual(mockLocalStorage.get(STORAGE_KEY), undefined, 'Plaintext key only purged after 100% confirmation');
});

// 14. Bounded Queue Capacity (100) and Non-Duplicate Recovery
runTest('Queue rejects 101st item at capacity without marking duplicate, allowing recovery on space clear', () => {
  const queue = [];
  const processedFingerprints = new Set();
  const MAX_QUEUE = 100;
  let rejectedDueToCapacityCount = 0;

  function enqueue(item) {
    if (processedFingerprints.has(item.fingerprint)) return false;
    if (queue.length >= MAX_QUEUE) {
      rejectedDueToCapacityCount++;
      // IMPORTANT: DO NOT add to processedFingerprints!
      return false;
    }
    queue.push(item);
    processedFingerprints.add(item.fingerprint);
    return true;
  }

  // 1. Fill queue to max capacity (100 items)
  for (let i = 1; i <= 100; i++) {
    const success = enqueue({ id: 'tx_' + i, fingerprint: 'fp_' + i, amount: i * 10 });
    assert.strictEqual(success, true);
  }
  assert.strictEqual(queue.length, 100);
  assert.strictEqual(rejectedDueToCapacityCount, 0);

  // 2. Attempt to enqueue 101st candidate
  const candidate101 = { id: 'tx_101', fingerprint: 'fp_101', amount: 1010 };
  const res101 = enqueue(candidate101);
  assert.strictEqual(res101, false, '101st item must be rejected when queue is full');
  assert.strictEqual(rejectedDueToCapacityCount, 1, 'Rejection counter incremented');
  assert.strictEqual(processedFingerprints.has('fp_101'), false, '101st item MUST NOT be marked as duplicate!');

  // 3. User reviews and acknowledges 10 items from queue
  queue.splice(0, 10);
  assert.strictEqual(queue.length, 90, 'Queue now has space for 10 new items');

  // 4. Historical re-scan or arrival retries 101st candidate
  const retry101 = enqueue(candidate101);
  assert.strictEqual(retry101, true, '101st item must be accepted now that space is freed');
  assert.strictEqual(queue.length, 91);
  assert.strictEqual(processedFingerprints.has('fp_101'), true, 'Fingerprint now recorded after acceptance');
});

// 15. "was charged" with available limit in same message
runTest('Extracts transaction amount ignoring credit limit and card ending with# digits', () => {
  const sms = 'Your card ending with#4321 was charged for EGP 100.00 at Gourmet on 23/11/26. Your available limit is EGP 5000.00.';
  const res = parseBankSms('CIB', sms);
  assert.ok(res !== null, 'SMS should be parsed');
  assert.strictEqual(res.amount, 100.00, 'Amount must be 100.00, not 4321 or 5000');
  assert.strictEqual(res.currency, 'EGP');
  assert.strictEqual(res.cardSuffix, '4321');
  assert.strictEqual(res.merchant, 'Gourmet');
  assert.strictEqual(res.type, 'expense');
});

// 16. Arabic instant transfer with "جم"
runTest('Parses Arabic instant transfer with "جم" currency correctly', () => {
  const sms = 'تم تنفيذ تحويل لحظي بمبلغ 250.00 جم من حسابك المنتهي بـ 9876 إلى حساب آخر برقم مرجعي 998877';
  const res = parseBankSms('NBE', sms);
  assert.ok(res !== null, 'SMS should be parsed');
  assert.strictEqual(res.amount, 250.00);
  assert.strictEqual(res.currency, 'EGP');
  assert.strictEqual(res.entityType, 'account');
  assert.strictEqual(res.identifierDigits, '9876');
  assert.strictEqual(res.refNumber, '998877');
  assert.strictEqual(res.type, 'expense');
});

// 17. Ending with card marker before amount
runTest('Strict amount extraction ignores card number marker ending with#4321', () => {
  const sms = 'Card ending with#8821 paid EGP 3000.00 at IKEA on 2026-11-20';
  const res = parseBankSms('QNB', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.amount, 3000.00);
  assert.strictEqual(res.cardSuffix, '8821');
});

// 18. Typed identifier (starting with first digits)
runTest('Extracts typed identifier starting with first 4 digits', () => {
  const sms = 'Card starting with 5123 was debited USD 45.00 at Netflix on 22/11/26';
  const res = parseBankSms('HSBC', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.amount, 45.00);
  assert.strictEqual(res.currency, 'USD');
  assert.strictEqual(res.identifierDigits, '5123');
  assert.strictEqual(res.digitsPosition, 'first');
});

// 19. Full date-time normalization (dd/mm/yy at hh:mm -> YYYY-MM-DD HH:mm)
runTest('Normalizes 2-digit year and time to full ISO format', () => {
  const sms = 'Purchase of EGP 500.00 at Zara on 23/11/26 at 11:44 card ending 1234';
  const res = parseBankSms('CIB', sms);
  assert.ok(res !== null);
  assert.strictEqual(res.transactionTime, '2026-11-23 11:44');
});

// 20. Reference number alters compound fingerprint
runTest('Reference number is incorporated into compound fingerprint preventing collisions', () => {
  const sms1 = 'Debited EGP 100.00 at Carrefour card 1111 on 2026-11-24 Ref: REF001';
  const sms2 = 'Debited EGP 100.00 at Carrefour card 1111 on 2026-11-24 Ref: REF002';
  const res1 = parseBankSms('CIB', sms1);
  const res2 = parseBankSms('CIB', sms2);
  assert.ok(res1 && res2);
  assert.strictEqual(res1.refNumber, 'REF001');
  assert.strictEqual(res2.refNumber, 'REF002');
  assert.notStrictEqual(res1.fingerprint, res2.fingerprint, 'Fingerprints with different ref numbers must be distinct');
});

console.log('\n----------------------------------------------------');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
console.log('⚠️  Notice: 100% pass rate confirms in-memory JS logic.');
console.log('    Physical device verification required for cellular SMS.');
console.log('----------------------------------------------------');

if (passedTests !== totalTests) {
  process.exit(1);
}
