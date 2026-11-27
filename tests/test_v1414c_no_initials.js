/**
 * ApexWallet v1.4.14c - Remove Bank-Initials Matching Test Suite
 *
 * Validates that multi-word bank labels are never matched to wallet banks by lookalike initials:
 * g) Wallet bank CIB: "Credit Industrial Bank" is NOT matched.
 * h) Wallet bank BM: "Bank Mansour" is NOT matched.
 * i) Custom bank CB: "Cairo Bank", "Commercial Bank", "Credit Bank" each NOT matched.
 * j) Extra: Wallet bank NBE with "North Bank Egypt" NOT matched; Wallet bank CA with "Citi Alex" NOT matched.
 * k) Regressions: "CIB", "CIB Transaction", "Commercial International Bank" match wallet bank.
 *    Generic fallback for "InstaPay", "IPN", "", "Unknown Bank" resolves.
 *    HSBC + 1659 remains unmatched.
 *    Plain "CIB" wallet bank without catalogId does NOT match "Commercial International Bank".
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
const { BankSmsEngine } = require('../sms_engine.js');
const { WalletAppStore, findBankExactMatch, findBankInCatalog } = require('../app.js');

global.findBankExactMatch = findBankExactMatch;
global.findBankInCatalog = findBankInCatalog;
if (typeof window !== 'undefined') {
  window.findBankExactMatch = findBankExactMatch;
  window.findBankInCatalog = findBankInCatalog;
}

function setTestStore(store) {
  global.store = store;
  global.walletStore = store;
  if (typeof window !== 'undefined') {
    window.store = store;
    window.walletStore = store;
  }
}

console.log('====================================================');
console.log('🧪 ApexWallet v1.4.14c No-Initials Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// Test g: Wallet bank CIB, candidate "Credit Industrial Bank"
// ----------------------------------------------------
console.log('--- Test g: Wallet bank CIB vs "Credit Industrial Bank" ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-cib', name: 'Commercial International Bank', shortCode: 'CIB', catalogId: 'cib' }
  ];
  store.accounts = [
    { id: 'acc-1659', bankId: 'b-cib', name: 'Prime', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [];
  setTestStore(store);

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'cand-g', bank: 'Credit Industrial Bank', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cg = engine.pendingCandidates[0];
  assert.strictEqual(cg.matchedAccountId, null, 'Credit Industrial Bank must NOT match CIB');
  assert.strictEqual(cg.matchedCardId, null);
  assert.strictEqual(cg.confidence, 'unknown');
  assert.ok(cg.nonMatchReason && cg.nonMatchReason.includes('Credit Industrial Bank'));
  console.log('  [Test g] "Credit Industrial Bank" + 1659: matchedAccountId=null, confidence=unknown, reason="' + cg.nonMatchReason + '"');
}

// ----------------------------------------------------
// Test h: Wallet bank BM (Banque Misr), candidate "Bank Mansour"
// ----------------------------------------------------
console.log('\n--- Test h: Wallet bank BM vs "Bank Mansour" ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-bm', name: 'Banque Misr', shortCode: 'BM', catalogId: 'bm' }
  ];
  store.accounts = [
    { id: 'acc-bm-1659', bankId: 'b-bm', name: 'Savings', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [];
  setTestStore(store);

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'cand-h', bank: 'Bank Mansour', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const ch = engine.pendingCandidates[0];
  assert.strictEqual(ch.matchedAccountId, null, 'Bank Mansour must NOT match Banque Misr');
  assert.strictEqual(ch.matchedCardId, null);
  assert.strictEqual(ch.confidence, 'unknown');
  assert.ok(ch.nonMatchReason && ch.nonMatchReason.includes('Bank Mansour'));
  console.log('  [Test h] "Bank Mansour" + 1659: matchedAccountId=null, confidence=unknown, reason="' + ch.nonMatchReason + '"');
}

// ----------------------------------------------------
// Test i: Custom bank "Custom Bank" (CB), candidates "Cairo Bank", "Commercial Bank", "Credit Bank"
// ----------------------------------------------------
console.log('\n--- Test i: Custom bank CB vs "Cairo Bank", "Commercial Bank", "Credit Bank" ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-cb', name: 'Custom Bank', shortCode: 'CB' }
  ];
  store.accounts = [
    { id: 'acc-cb-1659', bankId: 'b-cb', name: 'Current', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [];
  setTestStore(store);

  const engine = new BankSmsEngine();
  const testCandidates = ['Cairo Bank', 'Commercial Bank', 'Credit Bank'];
  for (const label of testCandidates) {
    engine.pendingCandidates = [
      { id: 'cand-i-' + label, bank: label, identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
    ];
    engine.enrichCandidates();
    const ci = engine.pendingCandidates[0];
    assert.strictEqual(ci.matchedAccountId, null, `${label} must NOT match custom bank CB`);
    assert.strictEqual(ci.confidence, 'unknown');
    assert.ok(ci.nonMatchReason && ci.nonMatchReason.includes(label));
    console.log(`  [Test i] "${label}" + 1659: matchedAccountId=null, confidence=unknown, reason="${ci.nonMatchReason}"`);
  }
}

// ----------------------------------------------------
// Test j: Extra: NBE vs "North Bank Egypt", CA vs "Citi Alex"
// ----------------------------------------------------
console.log('\n--- Test j: Extra: NBE vs "North Bank Egypt" & CA vs "Citi Alex" ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-nbe', name: 'National Bank of Egypt', shortCode: 'NBE', catalogId: 'nbe' },
    { id: 'b-ca', name: 'Credit Agricole', shortCode: 'CA', catalogId: 'ca' }
  ];
  store.accounts = [
    { id: 'acc-nbe-1659', bankId: 'b-nbe', name: 'NBE Account', identifierDigits: '1659', digitsPosition: 'last' },
    { id: 'acc-ca-1659', bankId: 'b-ca', name: 'CA Account', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [];
  setTestStore(store);

  const engine = new BankSmsEngine();

  // j1: "North Bank Egypt" vs NBE
  engine.pendingCandidates = [
    { id: 'cand-j1', bank: 'North Bank Egypt', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cj1 = engine.pendingCandidates[0];
  assert.strictEqual(cj1.matchedAccountId, null, 'North Bank Egypt must NOT match NBE');
  assert.strictEqual(cj1.confidence, 'unknown');
  console.log('  [Test j1] "North Bank Egypt" + 1659: matchedAccountId=null, confidence=unknown, reason="' + cj1.nonMatchReason + '"');

  // j2: "Citi Alex" vs CA
  engine.pendingCandidates = [
    { id: 'cand-j2', bank: 'Citi Alex', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cj2 = engine.pendingCandidates[0];
  assert.strictEqual(cj2.matchedAccountId, null, 'Citi Alex must NOT match CA');
  assert.strictEqual(cj2.confidence, 'unknown');
  console.log('  [Test j2] "Citi Alex" + 1659: matchedAccountId=null, confidence=unknown, reason="' + cj2.nonMatchReason + '"');
}

// ----------------------------------------------------
// Test k: Regressions & Edge Cases
// ----------------------------------------------------
console.log('\n--- Test k: Regressions & Edge Cases ---');
{
  const store = new WalletAppStore();
  store.banks = [
    { id: 'b-cib', name: 'Commercial International Bank', shortCode: 'CIB', catalogId: 'cib' }
  ];
  store.accounts = [
    { id: 'acc-cib-1659', bankId: 'b-cib', name: 'Prime', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [];
  setTestStore(store);

  const engine = new BankSmsEngine();

  // k1: "CIB" matches
  engine.pendingCandidates = [{ id: 'k-cib', bank: 'CIB', identifierDigits: '1659', entityType: 'account' }];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedAccountId, 'acc-cib-1659');
  console.log('  [Test k1] "CIB" matches acc-cib-1659');

  // k2: "CIB Transaction" matches
  engine.pendingCandidates = [{ id: 'k-cib-tx', bank: 'CIB Transaction', identifierDigits: '1659', entityType: 'account' }];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedAccountId, 'acc-cib-1659');
  console.log('  [Test k2] "CIB Transaction" matches acc-cib-1659');

  // k3: "Commercial International Bank" matches
  engine.pendingCandidates = [{ id: 'k-cib-full', bank: 'Commercial International Bank', identifierDigits: '1659', entityType: 'account' }];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedAccountId, 'acc-cib-1659');
  console.log('  [Test k3] "Commercial International Bank" matches acc-cib-1659');

  // k4: Generic fallback for "InstaPay", "IPN", "", "Unknown Bank"
  const genericLabels = ['InstaPay', 'IPN', '', 'Unknown Bank'];
  for (const g of genericLabels) {
    engine.pendingCandidates = [{ id: 'k-gen-' + g, bank: g, identifierDigits: '1659', entityType: 'account' }];
    engine.enrichCandidates();
    assert.strictEqual(engine.pendingCandidates[0].matchedAccountId, 'acc-cib-1659', `Generic "${g}" must resolve via fallback`);
  }
  console.log('  [Test k4] Generic labels ("InstaPay", "IPN", "", "Unknown Bank") resolve via fallback');

  // k5: HSBC + 1659 still unmatched
  engine.pendingCandidates = [{ id: 'k-hsbc', bank: 'HSBC', identifierDigits: '1659', entityType: 'account' }];
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedAccountId, null);
  assert.strictEqual(engine.pendingCandidates[0].confidence, 'unknown');
  console.log('  [Test k5] "HSBC" remains unmatched: matchedAccountId=null, confidence=unknown');

  // k6: Plain "CIB" wallet bank without catalogId does NOT match "Commercial International Bank" (per prompt note)
  store.banks = [
    { id: 'b-cib-plain', name: 'CIB', shortCode: 'CIB' }
  ];
  store.accounts = [
    { id: 'acc-plain-1659', bankId: 'b-cib-plain', name: 'Plain CIB', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  engine.pendingCandidates = [{ id: 'k-plain-doc', bank: 'Commercial International Bank', identifierDigits: '1659', entityType: 'account' }];
  engine.enrichCandidates();
  const cPlain = engine.pendingCandidates[0];
  assert.strictEqual(cPlain.matchedAccountId, null, 'Plain CIB without catalogId must NOT match full English name');
  assert.strictEqual(cPlain.confidence, 'unknown');
  console.log('  [Test k6] Documented note: plain "CIB" bank without catalogId expects unmatched for "Commercial International Bank"');
}

console.log('\n====================================================');
console.log('🎉 ALL v1.4.14c No-Initials Tests Passed!');
console.log('====================================================');
