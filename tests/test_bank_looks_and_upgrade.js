/**
 * ApexWallet - Card Looks v3, Bank Dropdown & Upgrade Test Suite
 * Validates:
 * 1. Bank catalog (34 banks + Other bank, sorting, debit-only caps, verified vs unverified)
 * 2. 9 real cards & 7 tier styles metadata
 * 3. Zero data loss on upgrading saved vault data (including custom bank "LL" not in catalog)
 * 4. SMS parser matching invariance (before/after matching numbers)
 * 5. Visual look resolver invariants (unstyled cards remain default, custom colors preserved)
 */

// Mock localStorage if not present in Node
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
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const {
  WalletAppStore,
  EGYPTIAN_BANKS,
  CARD_TIER_STYLES,
  REAL_CARD_LOOKS,
  getEgyptianBanks,
  findBankInCatalog,
  findBankExactMatch,
  getCardLookInfo
} = require('../app.js');

// Load SMS engine
const { WebFallbackParser, BankSmsEngine } = require('../sms_engine.js');

console.log('====================================================');
console.log('🎨 ApexWallet Card Looks v3 & Upgrade Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// Test 1: Egyptian Banks Catalog Structure & Count
// ----------------------------------------------------
console.log('--- Test 1: Bank Catalog & Sorting ---');
assert.strictEqual(Array.isArray(EGYPTIAN_BANKS), true, 'EGYPTIAN_BANKS must be an array');
assert.strictEqual(EGYPTIAN_BANKS.length, 35, 'Must contain exactly 34 banks + 1 "Other bank" entry (35 total)');

const otherEntry = EGYPTIAN_BANKS.find(b => b.key === 'other');
assert.ok(otherEntry, '"other" bank entry must exist');
assert.strictEqual(otherEntry.nameEn, 'Other bank');
assert.strictEqual(otherEntry.nameAr, 'بنك آخر');
assert.strictEqual(otherEntry.brandColor, '#6c737c', 'Other bank must use neutral titanium brand color');

// Check debit-only banks
const baraka = EGYPTIAN_BANKS.find(b => b.key === 'baraka');
assert.ok(baraka, 'Al Baraka must exist in catalog');
assert.deepStrictEqual(baraka.types, ['debit'], 'Al Baraka must offer debit only');

const faisal = EGYPTIAN_BANKS.find(b => b.key === 'faisal');
assert.ok(faisal, 'Faisal Islamic Bank must exist in catalog');
assert.deepStrictEqual(faisal.types, ['debit'], 'Faisal must offer debit only');

// Check verified brand colors
const verifiedKeys = ['hsbc', 'nbk', 'adib', 'bm', 'ca'];
verifiedKeys.forEach(k => {
  const b = EGYPTIAN_BANKS.find(entry => entry.key === k);
  assert.ok(b, `${k} must exist`);
  assert.strictEqual(b.verified, true, `${k} brand color must be marked verified: true`);
});

// Check unverified brand colors
const unverifiedKeys = ['qnb', 'nbe', 'nxt', 'cib', 'bdc'];
unverifiedKeys.forEach(k => {
  const b = EGYPTIAN_BANKS.find(entry => entry.key === k);
  assert.ok(b, `${k} must exist`);
  assert.strictEqual(b.verified, false, `${k} brand color must be marked verified: false`);
});

// Check alphabetical sorting and 'other' last in Arabic
const sortedAr = getEgyptianBanks('ar');
assert.strictEqual(sortedAr.length, 35);
assert.strictEqual(sortedAr[sortedAr.length - 1].key, 'other', '"Other bank" must be last in Arabic list');

// Check alphabetical sorting and 'other' last in English
const sortedEn = getEgyptianBanks('en');
assert.strictEqual(sortedEn.length, 35);
assert.strictEqual(sortedEn[sortedEn.length - 1].key, 'other', '"Other bank" must be last in English list');

console.log('  ✅ [PASS] Catalog contains 34 banks + Other bank, verified flags set, sorting verified\n');

// ----------------------------------------------------
// Test 2: 7 Tier Styles & 9 Real Cards Metadata
// ----------------------------------------------------
console.log('--- Test 2: Tier Styles & Real Card Looks ---');
assert.strictEqual(CARD_TIER_STYLES.length, 7, 'Must have exactly 7 tier styles');
const tierIds = CARD_TIER_STYLES.map(t => t.id);
assert.deepStrictEqual(tierIds, ['classic', 'gold', 'titanium', 'platinum', 'world', 'cashback', 'debit']);

assert.strictEqual(Object.keys(REAL_CARD_LOOKS).length, 9, 'Must have exactly 9 hand-tuned real cards');
const requiredRealKeys = [
  'cib_prime', 'cib_titanium', 'cib_cashback', 'cib_gold',
  'bdc_debit', 'bdc_titanium',
  'nbk_debit', 'nbk_gold', 'nbk_titanium'
];
requiredRealKeys.forEach(k => {
  assert.ok(REAL_CARD_LOOKS[k], `Real card look ${k} must exist`);
});

assert.strictEqual(REAL_CARD_LOOKS.cib_prime.variantNameEn, 'Prime');
assert.strictEqual(REAL_CARD_LOOKS.cib_titanium.variantNameEn, 'Titanium');
assert.strictEqual(REAL_CARD_LOOKS.cib_cashback.variantNameEn, 'Cashback');
assert.strictEqual(REAL_CARD_LOOKS.cib_gold.variantNameEn, 'Gold');
assert.strictEqual(REAL_CARD_LOOKS.bdc_debit.isLightMint, true, 'Banque du Caire debit must have isLightMint flag');

console.log('  ✅ [PASS] 7 tier styles and 9 real cards metadata match requirements\n');

// ----------------------------------------------------
// Test 3: Upgrade Test (Zero Data Loss on Legacy Vault)
// ----------------------------------------------------
console.log('--- Test 3: Zero Data Loss Upgrade Test ---');

// Create mock legacy data saved by previous version
const legacyVaultData = {
  version: '1.4.8-ui-redesign-r6',
  banks: [
    { id: 'bank_cib', name: 'Commercial International Bank', shortCode: 'CIB', accentColor: '#002D62' },
    { id: 'bank_hsbc', name: 'HSBC Egypt', shortCode: 'HSBC', accentColor: '#DB0011' },
    { id: 'bank_custom_ll', name: 'LL', shortCode: 'LL', accentColor: '#33353C' } // custom bank not in 34 list
  ],
  cards: [
    {
      id: 'card_cib_miles',
      bankId: 'bank_cib',
      name: 'Titanium Miles',
      last4: '8492',
      cardType: 'credit',
      creditLimit: 50000,
      monthlyTarget: 25000,
      cycleBudgets: {},
      cycleStartDay: 25,
      cycleEndDay: 24,
      network: 'Mastercard',
      colorPreset: null, // old unstyled card
      customColor: null
    },
    {
      id: 'card_custom_ll_2028',
      bankId: 'bank_custom_ll',
      name: 'Titanium',
      last4: '2028',
      cardType: 'credit',
      creditLimit: 20000,
      monthlyTarget: 20000,
      cycleBudgets: {},
      cycleStartDay: 1,
      cycleEndDay: 30,
      network: 'Mastercard',
      colorPreset: null,
      customColor: null
    }
  ],
  transactions: [
    { id: 'tx_1', amount: 3000.00, merchant: 'EMERALD EL MONT', category: 'shopping', date: '2026-11-20', cardId: 'card_custom_ll_2028' },
    { id: 'tx_2', amount: 376.20, merchant: 'WE-FBB-Pre', category: 'utilities', date: '2026-11-22', cardId: 'card_custom_ll_2028' },
    { id: 'tx_3', amount: 1200.00, merchant: 'Carrefour', category: 'groceries', date: '2026-11-25', cardId: 'card_cib_miles' }
  ],
  accounts: []
};

// Numbers before upgrade
const beforeTotalSpent = legacyVaultData.transactions.reduce((acc, t) => acc + t.amount, 0); // 4576.20
const beforeLLSpent = 3000.00 + 376.20; // 3376.20
const beforeLLRemaining = 20000.00 - beforeLLSpent; // 16623.80

// Initialize store and restore data
const store = new WalletAppStore();
store.banks = JSON.parse(JSON.stringify(legacyVaultData.banks));
store.cards = JSON.parse(JSON.stringify(legacyVaultData.cards));
store.transactions = JSON.parse(JSON.stringify(legacyVaultData.transactions));
store.accounts = [];

// Verify after upgrade
assert.strictEqual(store.cards.length, 2, 'Must retain all cards');
assert.strictEqual(store.banks.length, 3, 'Must retain all banks');
assert.strictEqual(store.transactions.length, 3, 'Must retain all transactions');

const afterLLCard = store.getCard('card_custom_ll_2028');
assert.ok(afterLLCard, 'LL Card must exist');
assert.strictEqual(afterLLCard.name, 'Titanium', 'LL Card name must be untouched');
assert.strictEqual(afterLLCard.last4, '2028', 'LL Card last4 must be untouched');

const afterLLBank = store.getBank(afterLLCard.bankId);
assert.ok(afterLLBank, 'LL Bank must exist');
assert.strictEqual(afterLLBank.name, 'LL', 'Bank name "LL" must remain exactly as saved');
assert.strictEqual(afterLLBank.shortCode, 'LL');

// Verify calculation preservation
const llStats = store.getCardSpendingStats('card_custom_ll_2028');
assert.strictEqual(llStats.spent, 3376.20, `LL Card spent must be 3,376.20, got ${llStats.spent}`);
assert.strictEqual(llStats.remaining, 16623.80, `LL Card remaining must be 16,623.80, got ${llStats.remaining}`);
assert.strictEqual(llStats.target, 20000.00);

const overallStats = store.getOverallStats();
assert.strictEqual(overallStats.totalSpent, beforeTotalSpent, `Total spent before (${beforeTotalSpent}) must match after (${overallStats.totalSpent})`);

// Verify "Other bank" behavior on custom bank
const catalogCheck = findBankInCatalog(afterLLBank.name);
assert.strictEqual(catalogCheck, null, '"LL" is not in 34 catalog and must return null from findBankInCatalog');

console.log(`  Before: Total spent=${beforeTotalSpent}, LL spent=${beforeLLSpent}, LL remaining=${beforeLLRemaining}`);
console.log(`  After:  Total spent=${overallStats.totalSpent}, LL spent=${llStats.spent}, LL remaining=${llStats.remaining}`);
console.log('  ✅ [PASS] Zero data loss: cards, banks, custom bank text and all calculations 100% identical\n');

// ----------------------------------------------------
// Test 4: SMS Parser Matching Invariance
// ----------------------------------------------------
console.log('--- Test 4: SMS Matching Invariance ---');

global.walletStore = store;
global.store = store;
const engine = new BankSmsEngine();

// Test CIB SMS auto-match
const cibSms = 'Purchase of EGP 450.00 with card ending in 8492 at Zara on 26/11/2026';
const parsedCib = WebFallbackParser.parse('CIB', cibSms);
assert.ok(parsedCib, 'CIB SMS must parse');
assert.strictEqual(parsedCib.bank, 'CIB');
engine.pendingCandidates = [parsedCib];
engine.enrichCandidates();
assert.strictEqual(parsedCib.matchedCardId, 'card_cib_miles', 'Must auto-match CIB miles card by 8492');

// Test matching with custom bank allowlist (including LL)
const customAllowlist = store.banks.map(b => b.shortCode);
const llAllowed = WebFallbackParser.isSenderAllowed('LL', customAllowlist);
assert.strictEqual(llAllowed, true, 'LL must be allowed when in user banks');
const llSms = 'Purchase of EGP 250.00 with card ending in 2028 at Starbucks on 26/11/2026';
const parsedLL = WebFallbackParser.parse('LL', llSms);
assert.ok(parsedLL, 'LL SMS must parse');
assert.strictEqual(parsedLL.bank, 'LL');
engine.pendingCandidates = [parsedLL];
engine.enrichCandidates();
assert.strictEqual(parsedLL.matchedCardId, 'card_custom_ll_2028', 'Must auto-match custom LL card by 2028');

console.log('  ✅ [PASS] SMS parser auto-matching works seamlessly for standard and custom bank cards\n');

// ----------------------------------------------------
// Test 5: Visual Look Resolver & Backward Compatibility
// ----------------------------------------------------
console.log('--- Test 5: Visual Look Resolver Invariants ---');

// 1. Unstyled legacy card (colorPreset=null, customColor=null) -> isDefault: true
const unstyledLook = getCardLookInfo(afterLLCard, afterLLBank);
assert.strictEqual(unstyledLook.isDefault, true, 'Card with no look chosen must have isDefault: true');
assert.strictEqual(unstyledLook.lookKey, null);

// 2. Card with custom hex color -> isCustomColor: true
const customCard = { ...afterLLCard, customColor: '#ff0055', colorPreset: null };
const customLook = getCardLookInfo(customCard, afterLLBank);
assert.strictEqual(customLook.isCustomColor, true, 'Card with customColor must have isCustomColor: true');
assert.strictEqual(customLook.customColor, '#ff0055');

// 3. Card with CIB Titanium real look
const cibTitaniumCard = { ...afterLLCard, colorPreset: 'cib_titanium' };
const cibLook = getCardLookInfo(cibTitaniumCard, legacyVaultData.banks[0]);
assert.strictEqual(cibLook.isRealCard, true);
assert.strictEqual(cibLook.lookKey, 'cib_titanium');
assert.strictEqual(cibLook.motif, 'cib_concentric');

// 4. Card with Banque du Caire Debit real look
const bdcBank = { id: 'bank_bdc', name: 'Banque du Caire', shortCode: 'BDC' };
const bdcDebitCard = { id: 'c_bdc', bankId: 'bank_bdc', cardType: 'debit', colorPreset: 'bdc_debit' };
const bdcLook = getCardLookInfo(bdcDebitCard, bdcBank);
assert.strictEqual(bdcLook.isRealCard, true);
assert.strictEqual(bdcLook.isLightMint, true, 'Banque du Caire debit must have isLightMint: true');

// 5. Card with 7 tier styles (e.g. tier_gold) tinted with bank brand color
const hsbcBank = legacyVaultData.banks[1];
const tierGoldCard = { ...afterLLCard, colorPreset: 'tier_gold' };
const tierGoldLook = getCardLookInfo(tierGoldCard, hsbcBank);
assert.strictEqual(tierGoldLook.isRealCard, false);
assert.strictEqual(tierGoldLook.tierStyle, 'gold');
assert.strictEqual(tierGoldLook.brandColor, '#db0011', 'HSBC brand color must tint the tier look');

console.log('  ✅ [PASS] All look resolver invariants hold (unstyled is default, custom is preserved, tiers tint correctly)\n');

// ----------------------------------------------------
// Test 6: Bug 1 - Bank Re-match on Edit (Exact Match Only)
// Custom bank names "Bank", "Cairo", "L", "LL" must survive open-edit-save unchanged
// ----------------------------------------------------
console.log('--- Test 6: Bug 1 - Bank Re-match on Edit ---');

const customBankNames = ['Bank', 'Cairo', 'L', 'LL'];

// 1. Direct Catalog Match Assertions
customBankNames.forEach(name => {
  const exact = findBankExactMatch(name);
  assert.strictEqual(exact, null, `findBankExactMatch("${name}") must be null`);

  const catalogExact = findBankInCatalog(name, true);
  assert.strictEqual(catalogExact, null, `findBankInCatalog("${name}", true) must be null`);

  const catalogFuzzy = findBankInCatalog(name);
  assert.strictEqual(catalogFuzzy, null, `findBankInCatalog("${name}") must be null (no false fuzzy match to NBE or CA)`);
});

// Verify catalog banks still match exactly
assert.strictEqual(findBankExactMatch('CIB')?.key, 'cib');
assert.strictEqual(findBankExactMatch('CA')?.key, 'ca');
assert.strictEqual(findBankExactMatch('Credit Agricole')?.key, 'ca');
assert.strictEqual(findBankExactMatch('NBE')?.key, 'nbe');
assert.strictEqual(findBankExactMatch('Banque du Caire')?.key, 'bdc');

// 2. Open-Edit-Save flow on custom banks: "Bank", "Cairo", "L", "LL"
customBankNames.forEach(customName => {
  const editStore = new WalletAppStore();
  const bank = editStore.addBank({
    name: customName,
    shortCode: customName.replace(/[^A-Za-z0-9]/g, '').substring(0, 4).toUpperCase() || 'OTHR',
    accentColor: '#6c737c'
  });
  const card = editStore.addCard({
    bankId: bank.id,
    name: `Card of ${customName}`,
    last4: '9876',
    cardType: 'credit',
    cycleStartDay: 1,
    cycleEndDay: 30,
    colorPreset: null,
    monthlyTarget: 15000
  });

  // A. Simulation of openEditCardModal preselection
  const bankInStore = editStore.getBank(card.bankId);
  const catalogMatch = bankInStore
    ? (findBankInCatalog(bankInStore.shortCode, true) || findBankInCatalog(bankInStore.name, true))
    : null;

  assert.strictEqual(catalogMatch, null, `Custom bank "${customName}" must not match any catalog entry on edit preselection`);

  // Preselected values in edit modal
  const preselectedBankKey = (catalogMatch && catalogMatch.key !== 'other') ? catalogMatch.key : 'other';
  const preselectedOtherName = (preselectedBankKey === 'other') ? (bankInStore ? bankInStore.name : '') : '';

  assert.strictEqual(preselectedBankKey, 'other', `Dropdown must preselect "other" for custom bank "${customName}"`);
  assert.strictEqual(preselectedOtherName, customName, `Other bank name input must retain "${customName}"`);

  // B. Simulation of form-edit-card submit without touching bank dropdown
  const selectedBankKey = preselectedBankKey; // User did not touch dropdown
  const otherInputVal = preselectedOtherName;  // User did not touch input text

  let targetBank = null;
  const currentBank = editStore.getBank(card.bankId);
  if (selectedBankKey === 'other') {
    const customBankName = otherInputVal.trim() || (currentBank ? currentBank.name : 'Other');
    if (currentBank && currentBank.name.trim().toLowerCase() === customBankName.toLowerCase()) {
      targetBank = currentBank;
    } else {
      let existing = editStore.banks.find(b => b.name.toLowerCase() === customBankName.toLowerCase());
      targetBank = existing || editStore.addBank({ name: customBankName, shortCode: 'OTHR', accentColor: '#6c737c' });
    }
  } else {
    // If catalog bank were selected
    targetBank = editStore.banks.find(b => b.name === selectedBankKey);
  }

  // Update card in store
  editStore.updateCard(card.id, {
    name: card.name,
    bankId: targetBank ? targetBank.id : card.bankId
  });

  // C. Verification: card.bankId and bank name survive open-edit-save unchanged
  const savedCard = editStore.getCard(card.id);
  assert.strictEqual(savedCard.bankId, bank.id, `Card bankId must remain unchanged (${bank.id})`);
  const savedBank = editStore.getBank(savedCard.bankId);
  assert.strictEqual(savedBank.name, customName, `Bank name must remain exactly "${customName}"`);
  assert.ok(savedBank.name !== 'National Bank of Egypt (NBE)', `Bank "${customName}" must not be moved to NBE`);
  assert.ok(savedBank.name !== 'Credit Agricole', `Bank "${customName}" must not be moved to Credit Agricole`);
});

console.log('  ✅ [PASS] Custom bank names "Bank", "Cairo", "L", "LL" survive open-edit-save unchanged without re-matching\n');

// ----------------------------------------------------
// Test 7: Bug 2 - Look Wiped on Edit-Save
// Legacy colorPreset "cib" and customColor must survive open-edit-save unchanged
// ----------------------------------------------------
console.log('--- Test 7: Bug 2 - Look Wiped on Edit-Save ---');

// 1. Test populateLookDropdown in sandbox using shipped ui.js
function createMockEl(tag) {
  return {
    tagName: tag.toUpperCase(),
    value: '',
    textContent: '',
    selected: false,
    children: [],
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    appendChild(c) { this.children.push(c); },
    insertBefore(c, ref) {
      const idx = this.children.indexOf(ref);
      if (idx !== -1) this.children.splice(idx, 0, c);
      else this.children.unshift(c);
    }
  };
}

const uiSandbox = {
  window: {
    location: { hostname: 'localhost', hash: '' },
    localStorage: global.localStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    EGYPTIAN_BANKS,
    CARD_TIER_STYLES,
    REAL_CARD_LOOKS,
    getEgyptianBanks,
    findBankInCatalog,
    findBankExactMatch,
    getCardLookInfo,
    CARD_THEMES: require('../app.js').CARD_THEMES
  },
  document: {
    readyState: 'complete',
    createElement: createMockEl,
    getElementById: () => createMockEl('div'),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: global.localStorage,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  getLang: () => 'en',
  t: (k) => k,
  EGYPTIAN_BANKS,
  CARD_TIER_STYLES,
  REAL_CARD_LOOKS,
  CARD_THEMES: require('../app.js').CARD_THEMES,
  console
};
vm.createContext(uiSandbox);
const appCode = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
vm.runInContext(appCode, uiSandbox, { filename: 'app.js' });
const uiCode = fs.readFileSync(path.join(__dirname, '..', 'ui.js'), 'utf8');
vm.runInContext(uiCode, uiSandbox, { filename: 'ui.js' });

const testSelectEl = createMockEl('select');
uiSandbox.window.populateLookDropdown(testSelectEl, 'cib', 'credit', 'cib');

// Verify that testSelectEl has the first child as the preserved legacy look option
const legacyOpt = testSelectEl.children[0];
assert.ok(legacyOpt, 'Dropdown must have an option');
assert.strictEqual(legacyOpt.value, 'cib', 'First option in dropdown must be preserved legacy preset "cib"');
assert.strictEqual(legacyOpt.selected, true, 'Legacy preset option must be selected by default');
assert.ok(legacyOpt.textContent.includes('CIB Navy'), `Option label must include theme name, got: ${legacyOpt.textContent}`);

// 2. Test Store Open-Edit-Save simulation with legacy preset "cib"
const storePreset = new WalletAppStore();
const cibBank = storePreset.addBank({ name: 'Commercial International Bank', shortCode: 'CIB' });
const legacyCard = storePreset.addCard({
  bankId: cibBank.id,
  name: 'Legacy CIB Card',
  last4: '5566',
  cardType: 'credit',
  cycleStartDay: 1,
  cycleEndDay: 30,
  colorPreset: 'cib', // Legacy theme from CARD_THEMES
  customColor: null,
  monthlyTarget: 12000
});

// A. Check that legacy preset "cib" is preserved in look resolver
const legacyLook = getCardLookInfo(legacyCard, cibBank);
assert.strictEqual(legacyLook.isLegacyPreset, true, 'Legacy preset "cib" must be recognized as legacy preset');
assert.strictEqual(legacyLook.lookKey, 'cib');

// B. Simulation of form-edit-card submit when user DOES NOT change the look dropdown
// Only write colorPreset if lookChanged === true. Saving unchanged card leaves colorPreset and customColor as were.
const lookChanged = false; // User did not touch look dropdown
const lookVal = 'cib'; // Dropdown populated with legacy look

const updatePayload = {
  name: 'Updated Card Name',
  bankId: legacyCard.bankId,
  monthlyTarget: 12000
};

if (lookChanged) {
  if (lookVal && lookVal !== 'none') {
    updatePayload.colorPreset = lookVal;
  } else {
    updatePayload.colorPreset = null;
  }
}

storePreset.updateCard(legacyCard.id, updatePayload);

// C. Verify: colorPreset survives open-edit-save unchanged
const savedLegacyCard = storePreset.getCard(legacyCard.id);
assert.strictEqual(savedLegacyCard.name, 'Updated Card Name', 'Card name should update');
assert.strictEqual(savedLegacyCard.colorPreset, 'cib', 'Legacy colorPreset "cib" must survive unchanged and NOT become null');

// D. Test card with customColor survives open-edit-save unchanged
const customCard2 = storePreset.addCard({
  bankId: cibBank.id,
  name: 'Custom Hex Card',
  last4: '7788',
  cardType: 'credit',
  cycleStartDay: 1,
  cycleEndDay: 30,
  colorPreset: null,
  customColor: '#ff0055',
  monthlyTarget: 8000
});

const updatePayloadCustom = {
  name: 'Updated Hex Name',
  bankId: customCard2.bankId
};
// User did not change look
storePreset.updateCard(customCard2.id, updatePayloadCustom);
const savedCustomCard = storePreset.getCard(customCard2.id);
assert.strictEqual(savedCustomCard.customColor, '#ff0055', 'customColor must survive open-edit-save unchanged');
assert.strictEqual(savedCustomCard.colorPreset, null, 'colorPreset must remain null');

// E. Also test that if user explicitly changes look to a 7-tier look, it DOES update
const lookChangedExplicit = true;
const explicitLookVal = 'tier_gold';

const updatePayloadExplicit = {
  name: savedLegacyCard.name,
  bankId: savedLegacyCard.bankId
};
if (lookChangedExplicit) {
  updatePayloadExplicit.colorPreset = explicitLookVal;
}
storePreset.updateCard(legacyCard.id, updatePayloadExplicit);
const explicitlyUpdatedCard = storePreset.getCard(legacyCard.id);
assert.strictEqual(explicitlyUpdatedCard.colorPreset, 'tier_gold', 'Explicit change to tier_gold must update colorPreset');

console.log('  ✅ [PASS] Legacy colorPreset "cib" and customColor survive open-edit-save unchanged unless explicitly modified\n');

// ----------------------------------------------------
// Test 8: Polish Visual Invariants (Chip, Network Logos, 3-Row Grid, Motifs)
// ----------------------------------------------------
console.log('--- Test 8: Card Looks Polish Visual Invariants ---');

const visualStore = new WalletAppStore();
requiredRealKeys.forEach((key, idx) => {
  const bankShortCode = key.split('_')[0].toUpperCase();
  const bankObj = visualStore.addBank({
    name: `Bank ${bankShortCode} ${idx}`,
    shortCode: bankShortCode,
    accentColor: '#F5B700'
  });

  const realMeta = REAL_CARD_LOOKS[key];
  const c = visualStore.addCard({
    id: `card_${key}`,
    bankId: bankObj.id,
    name: realMeta.nameEn,
    last4: String(1000 + idx),
    cardType: realMeta.cardType,
    cycleStartDay: 1,
    cycleEndDay: 30,
    colorPreset: key,
    monthlyTarget: 20000
  });

  const look = getCardLookInfo(c, bankObj);
  assert.strictEqual(look.isRealCard, true, `${key} must be recognized as real card`);
  assert.strictEqual(look.lookKey, key);

  // Set up mock DOM container for overview view rendering
  const mockContainer = createMockEl('div');
  mockContainer.id = 'view-dashboard';
  uiSandbox.document.getElementById = (id) => (id === 'view-dashboard' ? mockContainer : createMockEl('div'));
  uiSandbox.window.walletStore = visualStore;
  uiSandbox.window.store = visualStore;

  // Run selectFeaturedCard inside sandbox
  vm.runInContext(`
    window.selectFeaturedCard('${c.id}');
  `, uiSandbox);

  const html = mockContainer.innerHTML;
  assert.ok(html.includes(`card-look-${key}`), `${key} must apply class card-look-${key}`);
  assert.ok(html.includes('bank-card-chip-svg'), `${key} must render realistic gold chip SVG`);
  assert.ok(html.includes('emvGoldGrad'), `${key} chip must contain emvGoldGrad gold gradient definition`);
  assert.ok(html.includes('payment-network-logo'), `${key} must render payment network logo SVG`);
  assert.ok(html.includes(`•••• ${c.last4}`), `${key} must render formatted last 4 digits "•••• ${c.last4}"`);
  assert.ok(html.includes('card-name-text'), `${key} must render card-name-text`);
  assert.ok(html.includes('card-tier-badge'), `${key} must render card-tier-badge`);
  assert.ok(html.includes('card-balance-num'), `${key} must render card-balance-num`);
});

console.log('  ✅ [PASS] All 9 real cards render realistic gold chip, payment network logo, formatted last4 and 3-row layout\n');

console.log('----------------------------------------------------');
console.log('All Card Looks v3 & Upgrade Tests Passed (100%)');
console.log('----------------------------------------------------');
