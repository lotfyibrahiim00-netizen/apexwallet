/**
 * ApexWallet v1.4.14b - Matching Fallback & Auto-Link Tightening Test Suite
 *
 * Setup: wallet with bank CIB (account Prime 1659; cards: Titanium credit 2028, Debit 6434, Cashback credit 8034;
 * no card has linkedAccountId set to the 1659 account unless the test explicitly says so).
 *
 * Tests:
 * a) HSBC + digits 1659 + entity account: no match (matchedAccountId and matchedCardId null),
 *    reason is "bank not registered" and confidence "unknown". Same for HSBC + 6434 as card.
 * b) "InstaPay" + 1659 account: resolves to the CIB account (account_only, no auto debit-card link).
 *    "IPN" + 1659: same.
 *    Empty bank + 6434 card: resolves to the Debit card.
 *    "Unknown Bank" + 2028 card: resolves to the Titanium card.
 * c) Generic label with digits that exist in TWO places (add a second bank with a card ending 6434):
 *    no match, "multiple/unknown" behaviour as before.
 * d) CIB + 1659 account with NO linked debit card and exactly one debit card (6434) in the bank:
 *    result is account_only, matchedCardId stays null, requiresCardSelection true (proves auto-link is gone).
 *    With a debit card whose linkedAccountId is the account: matchedCardId is that card, confidence high.
 * e) "CIB Transaction" and "CIB" with the real CIB bank: still match normally (regression from v1.4.14).
 * f) Locked-boot case from v1.4.14 still passes (empty store, then loadFromDecrypted, then enrichCandidates resolves it).
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
const { WebFallbackParser, BankSmsEngine, isGenericBankLabel } = require('../sms_engine.js');
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

function createBaseCIBWallet(withLinkedDebit = false) {
  const store = new WalletAppStore();
  store.banks = [
    { id: 'bank-cib-id', name: 'Commercial International Bank', shortCode: 'CIB', catalogId: 'cib', accentColor: '#002D62' }
  ];
  store.accounts = [
    { id: 'acc-prime-id', bankId: 'bank-cib-id', name: 'Prime', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [
    { id: 'card-titanium-id', bankId: 'bank-cib-id', name: 'Titanium', identifierDigits: '2028', last4: '2028', cardType: 'credit', digitsPosition: 'last' },
    {
      id: 'card-debit-id',
      bankId: 'bank-cib-id',
      name: 'Debit',
      identifierDigits: '6434',
      last4: '6434',
      cardType: 'debit',
      linkedAccountId: withLinkedDebit ? 'acc-prime-id' : null,
      digitsPosition: 'last'
    },
    { id: 'card-cashback-id', bankId: 'bank-cib-id', name: 'Cashback', identifierDigits: '8034', last4: '8034', cardType: 'credit', digitsPosition: 'last' }
  ];
  store.transactions = [];
  setTestStore(store);
  return store;
}

console.log('====================================================');
console.log('🧪 ApexWallet v1.4.14b Matching Tighten Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// Test a: HSBC + digits 1659 account & HSBC + digits 6434 card
// ----------------------------------------------------
console.log('--- Test a: Non-wallet bank text (HSBC) must NOT fallback to CIB ---');
{
  createBaseCIBWallet(false);
  const engine = new BankSmsEngine();

  // a1: HSBC + digits 1659 + entity account
  engine.pendingCandidates = [
    { id: 'cand-hsbc-acc', bank: 'HSBC', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const c1 = engine.pendingCandidates[0];
  assert.strictEqual(c1.matchedAccountId, null, 'HSBC account candidate must not match CIB account');
  assert.strictEqual(c1.matchedCardId, null, 'HSBC account candidate must not match any card');
  assert.strictEqual(c1.confidence, 'unknown', 'Confidence must be unknown');
  assert.strictEqual(c1.requiresCardSelection, true, 'requiresCardSelection must be true');
  assert.ok(c1.nonMatchReason && c1.nonMatchReason.includes('HSBC'), 'Reason must state HSBC is not registered');
  console.log('  [Test a1] HSBC account 1659: matchedAccountId=null, matchedCardId=null, confidence=unknown, reason="' + c1.nonMatchReason + '"');

  // a2: HSBC + digits 6434 + entity card
  engine.pendingCandidates = [
    { id: 'cand-hsbc-card', bank: 'HSBC', identifierDigits: '6434', entityType: 'card', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const c2 = engine.pendingCandidates[0];
  assert.strictEqual(c2.matchedAccountId, null, 'HSBC card candidate must not match');
  assert.strictEqual(c2.matchedCardId, null, 'HSBC card candidate must not match CIB debit card');
  assert.strictEqual(c2.confidence, 'unknown', 'Confidence must be unknown');
  assert.strictEqual(c2.requiresCardSelection, true, 'requiresCardSelection must be true');
  assert.ok(c2.nonMatchReason && c2.nonMatchReason.includes('HSBC'), 'Reason must state HSBC is not registered');
  console.log('  [Test a2] HSBC card 6434: matchedAccountId=null, matchedCardId=null, confidence=unknown, reason="' + c2.nonMatchReason + '"');
}

// ----------------------------------------------------
// Test b: Generic labels (InstaPay, IPN, Empty, Unknown Bank) fallback
// ----------------------------------------------------
console.log('\n--- Test b: Generic bank labels fallback cleanly ---');
{
  createBaseCIBWallet(false);
  const engine = new BankSmsEngine();

  // b1: "InstaPay" + 1659 account -> resolves to CIB account Prime, account_only, NO auto debit-card link
  engine.pendingCandidates = [
    { id: 'cand-insta', bank: 'InstaPay', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cInsta = engine.pendingCandidates[0];
  assert.strictEqual(cInsta.matchedAccountId, 'acc-prime-id', 'InstaPay must resolve to CIB Prime account');
  assert.strictEqual(cInsta.matchedCardId, null, 'InstaPay account must NOT auto-link to debit card');
  assert.strictEqual(cInsta.confidence, 'account_only', 'Confidence must be account_only');
  assert.strictEqual(cInsta.requiresCardSelection, true, 'requiresCardSelection must be true');
  console.log('  [Test b1] "InstaPay" + 1659 account: matchedAccountId=acc-prime-id, matchedCardId=null, confidence=account_only');

  // b2: "IPN" + 1659 account -> same
  engine.pendingCandidates = [
    { id: 'cand-ipn', bank: 'IPN', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cIpn = engine.pendingCandidates[0];
  assert.strictEqual(cIpn.matchedAccountId, 'acc-prime-id', 'IPN must resolve to CIB Prime account');
  assert.strictEqual(cIpn.matchedCardId, null, 'IPN account must NOT auto-link to debit card');
  assert.strictEqual(cIpn.confidence, 'account_only', 'Confidence must be account_only');
  assert.strictEqual(cIpn.requiresCardSelection, true, 'requiresCardSelection must be true');
  console.log('  [Test b2] "IPN" + 1659 account: matchedAccountId=acc-prime-id, matchedCardId=null, confidence=account_only');

  // b3: Empty bank + 6434 card -> resolves to Debit card (card-debit-id)
  engine.pendingCandidates = [
    { id: 'cand-empty', bank: '', identifierDigits: '6434', entityType: 'card', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cEmpty = engine.pendingCandidates[0];
  assert.strictEqual(cEmpty.matchedCardId, 'card-debit-id', 'Empty bank must resolve to unique card 6434');
  assert.strictEqual(cEmpty.confidence, 'high', 'Confidence must be high');
  assert.strictEqual(cEmpty.requiresCardSelection, false, 'requiresCardSelection must be false');
  console.log('  [Test b3] Empty bank + 6434 card: matchedCardId=card-debit-id, confidence=high, requiresCardSelection=false');

  // b4: "Unknown Bank" + 2028 card -> resolves to Titanium card (card-titanium-id)
  engine.pendingCandidates = [
    { id: 'cand-unk-bank', bank: 'Unknown Bank', identifierDigits: '2028', entityType: 'card', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cUnk = engine.pendingCandidates[0];
  assert.strictEqual(cUnk.matchedCardId, 'card-titanium-id', '"Unknown Bank" must resolve to unique card 2028');
  assert.strictEqual(cUnk.confidence, 'high', 'Confidence must be high');
  assert.strictEqual(cUnk.requiresCardSelection, false, 'requiresCardSelection must be false');
  console.log('  [Test b4] "Unknown Bank" + 2028 card: matchedCardId=card-titanium-id, confidence=high, requiresCardSelection=false');
}

// ----------------------------------------------------
// Test c: Generic label with digits existing in TWO places
// ----------------------------------------------------
console.log('\n--- Test c: Generic label with duplicate digits across two banks ---');
{
  const store = createBaseCIBWallet(false);
  // Add a second bank with another card ending in 6434
  store.banks.push({ id: 'bank-nbe-id', name: 'National Bank of Egypt', shortCode: 'NBE' });
  store.cards.push({ id: 'card-nbe-6434', bankId: 'bank-nbe-id', name: 'NBE Debit', identifierDigits: '6434', last4: '6434', cardType: 'debit', digitsPosition: 'last' });

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'cand-dup', bank: 'Unknown Bank', identifierDigits: '6434', entityType: 'card', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const cDup = engine.pendingCandidates[0];
  assert.strictEqual(cDup.matchedCardId, null, 'Ambiguous digits must not auto-match');
  assert.strictEqual(cDup.confidence, 'unknown', 'Confidence must be unknown when generic bank has duplicate digits');
  assert.strictEqual(cDup.requiresCardSelection, true, 'requiresCardSelection must be true');
  console.log('  [Test c] Generic bank with duplicate digits across 2 banks: matchedCardId=null, confidence=unknown, requiresCardSelection=true');
}

// ----------------------------------------------------
// Test d: Single-debit auto-link removal verification
// ----------------------------------------------------
console.log('\n--- Test d: Single-debit auto-link removal verification ---');
{
  // d1: CIB + 1659 account with NO linked debit card, exactly one debit card in bank:
  createBaseCIBWallet(false); // linkedAccountId is null
  const engine1 = new BankSmsEngine();
  engine1.pendingCandidates = [
    { id: 'cand-cib-unlinked', bank: 'CIB', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine1.enrichCandidates();
  const cd1 = engine1.pendingCandidates[0];
  assert.strictEqual(cd1.matchedAccountId, 'acc-prime-id', 'Account 1659 must match Prime account');
  assert.strictEqual(cd1.matchedCardId, null, 'matchedCardId must stay null (auto-link removed)');
  assert.strictEqual(cd1.confidence, 'account_only', 'Confidence must be account_only');
  assert.strictEqual(cd1.requiresCardSelection, true, 'requiresCardSelection must be true');
  assert.ok(cd1.nonMatchReason && cd1.nonMatchReason.includes('لا يوجد كارت خصم مرتبط به'), 'Reason mentions unlinked debit card');
  console.log('  [Test d1] CIB account without linked debit card: matchedAccountId=acc-prime-id, matchedCardId=null, confidence=account_only, requiresCardSelection=true');

  // d2: CIB + 1659 account with linked debit card (linkedAccountId === acc-prime-id):
  createBaseCIBWallet(true); // linkedAccountId is 'acc-prime-id'
  const engine2 = new BankSmsEngine();
  engine2.pendingCandidates = [
    { id: 'cand-cib-linked', bank: 'CIB', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];
  engine2.enrichCandidates();
  const cd2 = engine2.pendingCandidates[0];
  assert.strictEqual(cd2.matchedAccountId, 'acc-prime-id', 'Account 1659 must match Prime account');
  assert.strictEqual(cd2.matchedCardId, 'card-debit-id', 'matchedCardId must be the linked debit card');
  assert.strictEqual(cd2.confidence, 'high', 'Confidence must be high');
  assert.strictEqual(cd2.requiresCardSelection, false, 'requiresCardSelection must be false');
  console.log('  [Test d2] CIB account with linked debit card: matchedAccountId=acc-prime-id, matchedCardId=card-debit-id, confidence=high, requiresCardSelection=false');
}

// ----------------------------------------------------
// Test e: "CIB Transaction" and "CIB" bank name matching
// ----------------------------------------------------
console.log('\n--- Test e: "CIB Transaction" and "CIB" bank name resolution ---');
{
  createBaseCIBWallet(false);
  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'cand-cib-tx', bank: 'CIB Transaction', identifierDigits: '2028', entityType: 'card', digitsPosition: 'last' },
    { id: 'cand-cib-exact', bank: 'CIB', identifierDigits: '8034', entityType: 'card', digitsPosition: 'last' }
  ];
  engine.enrichCandidates();
  const ce1 = engine.pendingCandidates[0];
  const ce2 = engine.pendingCandidates[1];
  assert.strictEqual(ce1.matchedCardId, 'card-titanium-id', '"CIB Transaction" must resolve to CIB Titanium card');
  assert.strictEqual(ce1.confidence, 'high', 'Confidence must be high');
  assert.strictEqual(ce2.matchedCardId, 'card-cashback-id', '"CIB" must resolve to CIB Cashback card');
  assert.strictEqual(ce2.confidence, 'high', 'Confidence must be high');
  console.log('  [Test e1] "CIB Transaction" + 2028 card: matchedCardId=card-titanium-id, confidence=high');
  console.log('  [Test e2] "CIB" + 8034 card: matchedCardId=card-cashback-id, confidence=high');
}

// ----------------------------------------------------
// Test f: Locked-boot case from v1.4.14
// ----------------------------------------------------
console.log('\n--- Test f: Locked-boot lifecycle from v1.4.14 ---');
{
  const store = new WalletAppStore();
  // Boot locked -> empty wallet
  store.banks = [];
  store.cards = [];
  store.accounts = [];
  store.transactions = [];
  setTestStore(store);

  const engine = new BankSmsEngine();
  engine.pendingCandidates = [
    { id: 'cand-boot-6434', bank: 'CIB', identifierDigits: '6434', entityType: 'card', digitsPosition: 'last' },
    { id: 'cand-boot-1659', bank: 'CIB', identifierDigits: '1659', entityType: 'account', digitsPosition: 'last' }
  ];

  // While locked:
  engine.enrichCandidates();
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, null);
  assert.ok(engine.pendingCandidates[0].nonMatchReason && engine.pendingCandidates[0].nonMatchReason.includes('CIB'));
  assert.strictEqual(engine.pendingCandidates[1].matchedAccountId, null);
  assert.ok(engine.pendingCandidates[1].nonMatchReason && engine.pendingCandidates[1].nonMatchReason.includes('CIB'));

  // Unlock with loadFromDecrypted:
  store.banks = [
    { id: 'bank-cib-id', name: 'Commercial International Bank', shortCode: 'CIB', catalogId: 'cib', accentColor: '#002D62' }
  ];
  store.accounts = [
    { id: 'acc-prime-id', bankId: 'bank-cib-id', name: 'Prime', identifierDigits: '1659', digitsPosition: 'last' }
  ];
  store.cards = [
    { id: 'card-debit-id', bankId: 'bank-cib-id', name: 'Debit', identifierDigits: '6434', last4: '6434', cardType: 'debit', linkedAccountId: 'acc-prime-id', digitsPosition: 'last' }
  ];

  // Re-enrich upon unlock / Review render:
  engine.enrichCandidates();
  const cf1 = engine.pendingCandidates[0];
  const cf2 = engine.pendingCandidates[1];
  assert.strictEqual(cf1.matchedCardId, 'card-debit-id', 'Debit card 6434 must match after unlock');
  assert.strictEqual(cf1.confidence, 'high');
  assert.strictEqual(cf2.matchedAccountId, 'acc-prime-id', 'Account 1659 must match after unlock');
  assert.strictEqual(cf2.matchedCardId, 'card-debit-id', 'Linked debit card must match after unlock');
  assert.strictEqual(cf2.confidence, 'high');
  console.log('  [Test f] Locked-boot lifecycle: locked -> warned -> unlocked -> enriched cleanly (card=card-debit-id, acc=acc-prime-id, confidence=high)');
}

console.log('\n====================================================');
console.log('🎉 ALL v1.4.14b Matching Tighten Tests Passed!');
console.log('====================================================');
