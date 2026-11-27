/**
 * ApexWallet v1.4.14 - Bank Matching & Re-enrichment Test Suite
 *
 * Validates:
 * 1. Reproduction & Fix of reported real-phone issue:
 *    - Locked state at boot sets store.banks = []
 *    - Candidates enriched while locked get "Bank not added" warning
 *    - Unlocking store + re-enriching matches cards/accounts properly
 *    - Candidate 6434 (ATM) matches debit card 6434
 *    - Candidate 1659 (Transfer) matches account Prime 1659 (+ linked debit card 6434)
 * 2. Guard against null/undefined bank name or shortCode (no TypeError crashes)
 * 3. Bank name normalization & catalog alias matching (whitespace, case, Arabic/English aliases)
 * 4. Single-match fallback when bank is generic/unknown (e.g. InstaPay, IPN) but digits uniquely match 1 card/account
 * 5. Strict multi-match guard: Ambiguous digits across banks require user selection, never auto-guess
 * 6. Zero match guard: Unmatched digits never fall back to first card
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
const { WalletAppStore, findBankExactMatch, findBankInCatalog } = require('../app.js');

// Ensure catalog helpers are available on global/window for test environment
global.findBankExactMatch = findBankExactMatch;
global.findBankInCatalog = findBankInCatalog;
if (typeof window !== 'undefined') {
  window.findBankExactMatch = findBankExactMatch;
  window.findBankInCatalog = findBankInCatalog;
}

// Helper to keep both store and walletStore synchronized across global/window
function setTestStore(store) {
  global.store = store;
  global.walletStore = store;
  if (typeof window !== 'undefined') {
    window.store = store;
    window.walletStore = store;
  }
}

console.log('====================================================');
console.log('🧪 ApexWallet v1.4.14 Bank Matching Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// Test 1: Real-Phone Lifecycle: Boot Locked -> Unlock -> Re-enrich
// ----------------------------------------------------
console.log('--- Test 1: Real-Phone Lifecycle: Boot Locked -> Unlock -> Re-enrich ---');
{
  const store = new WalletAppStore();
  // Simulate locked state at boot
  store.banks = [];
  store.cards = [];
  store.accounts = [];
  store.transactions = [];
  setTestStore(store);

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    {
      id: 'cand-atm-6434',
      bank: 'CIB',
      identifierDigits: '6434',
      entityType: 'card',
      digitsPosition: 'last',
      amount: 1000,
      type: 'expense',
      transactionType: 'withdrawal',
      merchant: 'ATM CIB'
    },
    {
      id: 'cand-transfer-1659',
      bank: 'CIB',
      identifierDigits: '1659',
      entityType: 'account',
      digitsPosition: 'last',
      amount: 300,
      type: 'income',
      transactionType: 'transfer',
      merchant: 'تحويل من: منال'
    }
  ];

  // 1a. Enrich while locked:
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, null);
  assert.ok(
    engine.pendingCandidates[0].nonMatchReason && engine.pendingCandidates[0].nonMatchReason.includes('CIB'),
    'Locked state must warn bank not registered'
  );
  assert.strictEqual(engine.pendingCandidates[1].matchedAccountId, null);
  assert.ok(
    engine.pendingCandidates[1].nonMatchReason && engine.pendingCandidates[1].nonMatchReason.includes('CIB'),
    'Locked state must warn bank not registered'
  );
  console.log('  ✅ [PASS] 1a: Enriched while locked -> correctly flagged as bank not registered');

  // 1b. User unlocks with PIN/Biometrics -> store is loaded:
  store.banks = [
    { id: 'bank-cib-id', name: 'Commercial International Bank', shortCode: 'CIB', catalogId: 'cib', accentColor: '#002D62' }
  ];
  store.accounts = [
    { id: 'acc-prime-id', bankId: 'bank-cib-id', name: 'Prime Account', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [
    { id: 'card-titanium-id', bankId: 'bank-cib-id', name: 'CIB Titanium', identifierDigits: '2028', last4: '2028', cardType: 'credit', digitsPosition: 'last' },
    { id: 'card-debit-id', bankId: 'bank-cib-id', name: 'CIB Debit', identifierDigits: '6434', last4: '6434', cardType: 'debit', linkedAccountId: 'acc-prime-id', digitsPosition: 'last' },
    { id: 'card-cashback-id', bankId: 'bank-cib-id', name: 'CIB Cashback', identifierDigits: '8034', last4: '8034', cardType: 'credit', digitsPosition: 'last' }
  ];

  // 1c. Re-enrich candidates (triggered on unlock and when opening Review tab):
  engine.enrichCandidates();

  // Verify Candidate 1: matched debit card 6434
  const c1 = engine.pendingCandidates.find(c => c.id === 'cand-atm-6434');
  assert.strictEqual(c1.matchedCardId, 'card-debit-id', 'Candidate 6434 must match debit card 6434');
  assert.strictEqual(c1.matchedAccountId, 'acc-prime-id', 'Candidate 6434 must associate linked account acc-prime-id');
  assert.strictEqual(c1.confidence, 'high', 'Confidence must be high');
  assert.strictEqual(c1.nonMatchReason, null, 'nonMatchReason must be cleared');
  assert.strictEqual(c1.requiresCardSelection, false, 'requiresCardSelection must be false');
  console.log('  ✅ [PASS] 1b: Candidate 6434 (ATM) matched card-debit-id with confidence=high');

  // Verify Candidate 2: matched account 1659 and linked debit card
  const c2 = engine.pendingCandidates.find(c => c.id === 'cand-transfer-1659');
  assert.strictEqual(c2.matchedAccountId, 'acc-prime-id', 'Candidate 1659 must match account Prime');
  assert.strictEqual(c2.matchedCardId, 'card-debit-id', 'Candidate 1659 must match linked debit card');
  assert.strictEqual(c2.confidence, 'high', 'Confidence must be high');
  assert.strictEqual(c2.nonMatchReason, null, 'nonMatchReason must be cleared');
  assert.strictEqual(c2.requiresCardSelection, false, 'requiresCardSelection must be false');
  console.log('  ✅ [PASS] 1c: Candidate 1659 (Transfer) matched acc-prime-id & card-debit-id with confidence=high');
}

// ----------------------------------------------------
// Test 2: Null / Undefined Guards in Bank Records
// ----------------------------------------------------
console.log('\n--- Test 2: Null / Undefined Guards in Bank Records ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b1', name: null, shortCode: null },
    { id: 'b2', name: 'Other Bank' }, // shortCode undefined
    { id: 'b3', shortCode: 'CIB' }, // name undefined
    null // null entry in array
  ];
  store.cards = [
    { id: 'card-1', bankId: 'b3', identifierDigits: '6434', last4: '6434', cardType: 'debit', digitsPosition: 'last' }
  ];
  store.accounts = [];

  setTestStore(store);

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'c-test-null', bank: 'CIB', identifierDigits: '6434', entityType: 'card', digitsPosition: 'last' }
  ];

  let threw = false;
  try {
    engine.enrichCandidates();
  } catch (err) {
    threw = true;
    console.error('enrichCandidates crashed with:', err);
  }
  assert.strictEqual(threw, false, 'enrichCandidates must never crash on null/undefined properties');
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, 'card-1', 'Must successfully match despite corrupt bank entries');
  console.log('  ✅ [PASS] Test 2: Handled null/undefined bank properties safely without throwing');
}

// ----------------------------------------------------
// Test 3: Bank Name Normalization & Catalog Aliases
// ----------------------------------------------------
console.log('\n--- Test 3: Bank Name Normalization & Catalog Aliases ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-cib', name: 'Commercial International Bank', shortCode: 'CIB', catalogId: 'cib' },
    { id: 'b-bdc', name: 'Banque du Caire', shortCode: 'BDC', catalogId: 'bdc' }
  ];
  store.cards = [
    { id: 'cib-card', bankId: 'b-cib', identifierDigits: '6434', last4: '6434', cardType: 'debit' },
    { id: 'bdc-card', bankId: 'b-bdc', identifierDigits: '1122', last4: '1122', cardType: 'debit' }
  ];
  store.accounts = [];
  setTestStore(store);

  const engine = new BankSmsEngine();

  // 3a. Spacing / casing variations: " CIB \n", "cib"
  engine.pendingCandidates = [
    { id: 'c-space', bank: '  CIB \n', identifierDigits: '6434', entityType: 'card' },
    { id: 'c-lower', bank: 'cib', identifierDigits: '6434', entityType: 'card' }
  ];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, 'cib-card', 'Padded "  CIB \\n" must match');
  assert.strictEqual(engine.pendingCandidates[1].matchedCardId, 'cib-card', 'Lowercase "cib" must match');
  console.log('  ✅ [PASS] 3a: Spacing and lowercase matched correctly');

  // 3b. Arabic candidate bank name "البنك التجاري الدولي" matching English wallet bank
  engine.pendingCandidates = [
    { id: 'c-ar', bank: 'البنك التجاري الدولي', identifierDigits: '6434', entityType: 'card' }
  ];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, 'cib-card', 'Arabic bank name must resolve via catalog alias');
  console.log('  ✅ [PASS] 3b: Arabic bank name resolved via catalog alias to Commercial International Bank');

  // 3c. Arabic wallet bank matching English candidate bank name
  store.banks = [
    { id: 'b-cib-ar', name: 'البنك التجاري الدولي', shortCode: 'CIB', catalogId: 'cib' }
  ];
  store.cards = [
    { id: 'cib-card-ar', bankId: 'b-cib-ar', identifierDigits: '6434', last4: '6434', cardType: 'debit' }
  ];
  engine.pendingCandidates = [
    { id: 'c-en', bank: 'CIB', identifierDigits: '6434', entityType: 'card' }
  ];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, 'cib-card-ar', 'English candidate bank name must match Arabic wallet bank');
  console.log('  ✅ [PASS] 3c: English candidate bank name matched Arabic wallet bank');
}

// ----------------------------------------------------
// Test 4: Single-Match Fallback for Generic / Unknown Banks (InstaPay, IPN)
// ----------------------------------------------------
console.log('\n--- Test 4: Single-Match Fallback for Generic / Unknown Banks ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'bank-cib', name: 'Commercial International Bank', shortCode: 'CIB' }
  ];
  store.accounts = [
    { id: 'acc-1659', bankId: 'bank-cib', name: 'Prime', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [
    { id: 'card-6434', bankId: 'bank-cib', name: 'Debit', identifierDigits: '6434', last4: '6434', cardType: 'debit', linkedAccountId: 'acc-1659' }
  ];
  setTestStore(store);

  const engine = new BankSmsEngine();

  // 4a. InstaPay transfer to account 1659 (bank is "InstaPay", which is not a wallet bank)
  engine.pendingCandidates = [
    {
      id: 'cand-instapay-transfer',
      bank: 'InstaPay',
      identifierDigits: '1659',
      entityType: 'account',
      digitsPosition: 'last',
      amount: 500,
      type: 'income',
      transactionType: 'transfer'
    }
  ];
  engine.enrichCandidates();
  const cInsta = engine.pendingCandidates[0];
  assert.strictEqual(cInsta.matchedAccountId, 'acc-1659', 'InstaPay transfer must resolve to unique account 1659');
  assert.strictEqual(cInsta.matchedCardId, 'card-6434', 'InstaPay transfer must associate linked debit card');
  assert.strictEqual(cInsta.confidence, 'high');
  console.log('  ✅ [PASS] 4a: InstaPay transfer automatically resolved to account 1659 + linked debit card');

  // 4b. Unknown bank for card 6434
  engine.pendingCandidates = [
    {
      id: 'cand-unknown-bank',
      bank: 'Unknown Bank',
      identifierDigits: '6434',
      entityType: 'card',
      digitsPosition: 'last',
      amount: 250,
      type: 'expense'
    }
  ];
  engine.enrichCandidates();
  const cUnknown = engine.pendingCandidates[0];
  assert.strictEqual(cUnknown.matchedCardId, 'card-6434', 'Unknown bank must resolve to unique card 6434');
  assert.strictEqual(cUnknown.confidence, 'high');
  console.log('  ✅ [PASS] 4b: Unknown bank automatically resolved to unique card 6434');
}

// ----------------------------------------------------
// Test 5: Strict Multi-Match Guard (Ambiguous digits across banks)
// ----------------------------------------------------
console.log('\n--- Test 5: Strict Multi-Match Guard (Ambiguous digits) ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-cib', name: 'CIB', shortCode: 'CIB' },
    { id: 'b-nbe', name: 'NBE', shortCode: 'NBE' }
  ];
  store.cards = [
    { id: 'cib-card-9999', bankId: 'b-cib', identifierDigits: '9999', last4: '9999', cardType: 'debit' },
    { id: 'nbe-card-9999', bankId: 'b-nbe', identifierDigits: '9999', last4: '9999', cardType: 'debit' }
  ];
  setTestStore(store);

  const engine = new BankSmsEngine();
  // Ambiguous bank name + duplicated digits across 2 banks
  engine.pendingCandidates = [
    { id: 'cand-ambig', bank: 'Unknown Bank', identifierDigits: '9999', entityType: 'card' }
  ];
  engine.enrichCandidates();
  const cAmbig = engine.pendingCandidates[0];
  assert.strictEqual(cAmbig.matchedCardId, null, 'Must NOT auto-match when multiple cards share digits across banks');
  assert.strictEqual(cAmbig.requiresCardSelection, true, 'Must require user card selection');
  console.log('  ✅ [PASS] Test 5: Ambiguous digits across banks requires user selection without guessing');
}

// ----------------------------------------------------
// Test 6: Zero-Match Guard (Unmatched digits never guess first card)
// ----------------------------------------------------
console.log('\n--- Test 6: Zero-Match Guard ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-cib', name: 'CIB', shortCode: 'CIB' }
  ];
  store.cards = [
    { id: 'cib-card-1111', bankId: 'b-cib', identifierDigits: '1111', last4: '1111', cardType: 'debit' }
  ];
  setTestStore(store);

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'cand-nonexistent', bank: 'CIB', identifierDigits: '9999', entityType: 'card' }
  ];
  engine.enrichCandidates();
  const cZero = engine.pendingCandidates[0];
  assert.strictEqual(cZero.matchedCardId, null, 'Must NOT match unmatched digits');
  assert.strictEqual(cZero.confidence, 'unknown');
  assert.strictEqual(cZero.requiresCardSelection, true);
  console.log('  ✅ [PASS] Test 6: Non-existent digits correctly remain unmatched');
}

console.log('\n====================================================');
console.log('🎉 ALL v1.4.14 Bank Matching Tests Passed!');
console.log('====================================================');
