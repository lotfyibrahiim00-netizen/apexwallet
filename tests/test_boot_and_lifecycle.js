/**
 * Mandatory Pre-Release Boot, Syntax, and Lifecycle Test Suite
 * 
 * Verifies:
 * 1. Syntax check on ALL shipped JavaScript files (security.js, app.js, ui.js, sms_engine.js, sw.js).
 * 2. New User Boot: window.WalletSecurity initializes cleanly without error, detects unconfigured vault,
 *    and allows user to successfully set up a new 4-digit PIN.
 * 3. Existing User Lifecycle: Vault auto-locks, rejects invalid PINs with error, accepts correct PIN,
 *    and decrypts encrypted wallet state with 100% fidelity.
 * 4. Enforcement: Automatically blocks packaging/releases if any assertion fails.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const crypto = require('crypto');

console.log('====================================================');
console.log('🚀 ApexWallet Pre-Release Mandatory Boot Test Suite');
console.log('====================================================\n');

let passedCount = 0;
let totalCount = 0;

function runStep(name, fn) {
  totalCount++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exit(1);
  }
}

async function runStepAsync(name, fn) {
  totalCount++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    process.exit(1);
  }
}

// ----------------------------------------------------
// Step 1: Syntax Validation on All Shipped JS Files
// ----------------------------------------------------
const shippedFiles = ['security.js', 'app.js', 'ui.js', 'sms_engine.js', 'sw.js', 'build.js'];

for (const fileName of shippedFiles) {
  runStep(`Syntax check: ${fileName}`, () => {
    const filePath = path.join(__dirname, '..', fileName);
    assert.ok(fs.existsSync(filePath), `File exists: ${fileName}`);
    const code = fs.readFileSync(filePath, 'utf8');
    // Using vm.Script to validate exact JS grammar
    new vm.Script(code, { filename: fileName });
  });
}

// ----------------------------------------------------
// Step 2 & 3: Runtime Boot & Security Lifecycle in Mock DOM
// ----------------------------------------------------
async function testRuntimeLifecycle() {
  // Construct mock browser environment
  const mockLocalStorage = new Map();
  const localStorageMock = {
    getItem: (k) => mockLocalStorage.has(k) ? mockLocalStorage.get(k) : null,
    setItem: (k, v) => mockLocalStorage.set(k, String(v)),
    removeItem: (k) => mockLocalStorage.delete(k),
    clear: () => mockLocalStorage.clear()
  };

  const windowMock = {
    localStorage: localStorageMock,
    crypto: crypto.webcrypto,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
    location: { hostname: 'localhost' },
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const documentMock = {
    addEventListener: () => {},
    removeEventListener: () => {},
    hidden: false
  };

  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage: localStorageMock,
    crypto: crypto.webcrypto,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    btoa: windowMock.btoa,
    atob: windowMock.atob,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };

  vm.createContext(sandbox);

  // Load and execute security.js in sandbox
  const securityCode = fs.readFileSync(path.join(__dirname, '..', 'security.js'), 'utf8');
  vm.runInContext(securityCode, sandbox, { filename: 'security.js' });

  assert.ok(sandbox.window.WalletSecurity, 'window.WalletSecurity must be defined and instantiated');
  const sec = sandbox.window.WalletSecurity;

  // Verify initial unconfigured state (New User)
  assert.strictEqual(sec.isConfigured(), false, 'Fresh install must report isConfigured() === false');

  // New User: Set up PIN
  const testPin = '7429';
  const initialData = await sec.setupPin(testPin);
  assert.ok(initialData && typeof initialData === 'object', 'setupPin must return initial wallet data');
  assert.strictEqual(sec.isConfigured(), true, 'Vault must now report isConfigured() === true');
  assert.strictEqual(sec.isLocked, false, 'Vault must be unlocked immediately after setup');
  assert.ok(sec.activeKey, 'activeKey must be set in memory');

  // Save updated data to encrypted vault
  const testPayload = { banks: ['CIB'], balance: 15000, cards: [{ id: 'c1', last4: '9012' }] };
  const saveSuccess = await sec.saveVault(testPayload);
  assert.strictEqual(saveSuccess, true, 'saveVault must succeed');

  // Verify data is stored encrypted in localStorage (not plaintext)
  const rawStored = localStorageMock.getItem('apexwallet_security_vault_v1');
  assert.ok(rawStored, 'Security vault record must be saved in localStorage');
  const parsedRecord = JSON.parse(rawStored);
  assert.ok(parsedRecord.salt && parsedRecord.verifier && parsedRecord.vault);
  assert.ok(!rawStored.includes('15000'), 'Plaintext balance must NOT appear in localStorage record');

  // Simulate Lock (app sent to background or locked by user)
  sec.lock();
  assert.strictEqual(sec.isLocked, true, 'Vault must be locked');
  assert.strictEqual(sec.activeKey, null, 'activeKey must be cleared from memory when locked');

  // Attempt unlock with wrong PIN
  const wrongUnlock = await sec.unlock('0000');
  assert.strictEqual(wrongUnlock.success, false, 'Wrong PIN must be rejected');
  assert.strictEqual(sec.isLocked, true, 'Vault must remain locked after wrong PIN');

  // Unlock with correct PIN (Existing User Flow)
  const correctUnlock = await sec.unlock(testPin);
  assert.strictEqual(correctUnlock.success, true, 'Correct PIN must succeed');
  assert.strictEqual(sec.isLocked, false, 'Vault must be unlocked');

  // Decrypted vault data returned on unlock
  // Normalize JSON for comparison
  assert.strictEqual(JSON.stringify(correctUnlock.data), JSON.stringify(testPayload), 'Decrypted vault data must match saved payload with 100% fidelity');
}

// ----------------------------------------------------
// Step 4: Production End-to-End Integration (app.js + sms_engine.js)
// Verifies real runtime binding between walletStore and BankSmsEngine WITHOUT manual mocks
// ----------------------------------------------------
function createHeadlessSandbox() {
  const mockStorage = new Map();
  const localStorageMock = {
    getItem: (k) => mockStorage.has(k) ? mockStorage.get(k) : null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k),
    clear: () => mockStorage.clear()
  };

  const windowMock = {
    localStorage: localStorageMock,
    crypto: crypto.webcrypto,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (b64) => Buffer.from(b64, 'base64').toString('binary'),
    location: { hostname: 'localhost' },
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const documentMock = {
    readyState: 'complete',
    addEventListener: () => {},
    removeEventListener: () => {},
    hidden: false
  };

  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage: localStorageMock,
    crypto: crypto.webcrypto,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    btoa: windowMock.btoa,
    atob: windowMock.atob,
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };

  vm.createContext(sandbox);

  const appCode = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  vm.runInContext(appCode, sandbox, { filename: 'app.js' });

  return sandbox;
}

async function testSmsStoreIntegration() {
  const sandbox = createHeadlessSandbox();
  const mockLocalStorage = sandbox.localStorage;

  assert.ok(sandbox.window.walletStore, 'app.js must create window.walletStore');
  assert.ok(sandbox.window.store, 'app.js must also define window.store for global parity');
  assert.strictEqual(sandbox.window.store, sandbox.window.walletStore, 'window.store and window.walletStore must reference identical instance');

  // 2. Load sms_engine.js naturally (creates window.BankSmsEngine and window.WebFallbackParser)
  const smsEngineCode = fs.readFileSync(path.join(__dirname, '..', 'sms_engine.js'), 'utf8');
  vm.runInContext(smsEngineCode, sandbox, { filename: 'sms_engine.js' });

  assert.ok(sandbox.window.BankSmsEngine, 'sms_engine.js must create window.BankSmsEngine');
  assert.ok(sandbox.window.WebFallbackParser, 'sms_engine.js must create window.WebFallbackParser');

  const engine = sandbox.window.BankSmsEngine;
  const store = sandbox.window.walletStore;

  // 3. Populate store with Bank, Account, and Card
  const cibBank = store.addBank({ name: 'Commercial International Bank', shortCode: 'CIB', accentColor: '#002D62' });
  const cibCard = store.addCard({
    bankId: cibBank.id,
    name: 'Titanium Miles',
    last4: '8492',
    digitsPosition: 'last',
    cardType: 'credit',
    monthlyTarget: 25000,
    cycleStartDay: 25,
    cycleEndDay: 24,
    network: 'Mastercard'
  });

  assert.strictEqual(store.cards.length, 1);
  assert.strictEqual(store.transactions.length, 0);

  // 4. Test Candidate 1: Exact 4-dimension match -> Must auto-match with high confidence!
  const sms1 = 'Your card ending with#8492 was charged for EGP 450.00 at Starbucks Arkan on 24/11/26. Available limit EGP 24550.00.';
  const candidate1 = sandbox.window.WebFallbackParser.parse('CIB', sms1);
  assert.ok(candidate1, 'Candidate 1 must be successfully parsed');
  assert.strictEqual(candidate1.amount, 450.00);
  assert.strictEqual(candidate1.cardSuffix, '8492');

  engine.handleIncomingCandidate(candidate1);
  assert.strictEqual(engine.pendingCandidates.length, 1);

  // Verify auto-matching
  const pending1 = engine.pendingCandidates[0];
  assert.strictEqual(pending1.matchedCardId, cibCard.id, 'Candidate 1 must auto-match CIB Titanium card');
  assert.strictEqual(pending1.confidence, 'high', 'Confidence must be high for exact 4-dimension match');
  assert.strictEqual(pending1.requiresCardSelection, false, 'requiresCardSelection must be false');

  // 5. Approve Candidate 1 -> Must write to walletStore.transactions without TypeError!
  const approveRes1 = await engine.approveCandidate(pending1.id);
  assert.strictEqual(approveRes1.success, true, 'approveCandidate must succeed cleanly');
  assert.strictEqual(store.transactions.length, 1, 'Transaction must be written to ledger');
  assert.strictEqual(store.transactions[0].amount, 450.00);
  assert.strictEqual(store.transactions[0].cardId, cibCard.id);
  assert.strictEqual(store.transactions[0].direction, 'expense');
  assert.strictEqual(engine.pendingCandidates.length, 0, 'Candidate must be removed from review queue upon approval');

  // 6. Test Candidate 2: Ambiguous/Unknown card digits -> Must NOT guess or crash!
  const sms2 = 'Debited EGP 120.00 at Costa Coffee card ending with 9999 on 24/11/26';
  const candidate2 = sandbox.window.WebFallbackParser.parse('CIB', sms2);
  assert.ok(candidate2);
  engine.handleIncomingCandidate(candidate2);

  const pending2 = engine.pendingCandidates[0];
  assert.strictEqual(pending2.matchedCardId, null, 'Unmatched digits must NOT pick a random or first card');
  assert.strictEqual(pending2.requiresCardSelection, true, 'User card selection must be strictly required');

  // Attempt approve without selecting card -> Must gracefully reject with user error message, NOT crash
  const failApprove = await engine.approveCandidate(pending2.id);
  assert.strictEqual(failApprove.success, false);
  assert.ok(failApprove.error && failApprove.error.includes('select a card'));

  // Approve with explicit user selection override
  const manualApprove = await engine.approveCandidate(pending2.id, { cardId: cibCard.id });
  assert.strictEqual(manualApprove.success, true);
  assert.strictEqual(store.transactions.length, 2);
  assert.strictEqual(store.transactions[0].amount, 120.00, 'Most recent transaction is unshifted to index 0');
  assert.strictEqual(store.transactions[1].amount, 450.00);
  assert.strictEqual(engine.pendingCandidates.length, 0);

  // 7. Test Candidate 3: Reject flow
  const sms3 = 'Purchase of EGP 30.00 at Kiosk card 8492 on 24/11/26';
  const candidate3 = sandbox.window.WebFallbackParser.parse('CIB', sms3);
  engine.handleIncomingCandidate(candidate3);
  assert.strictEqual(engine.pendingCandidates.length, 1);

  const rejectSuccess = await engine.rejectCandidate(candidate3.id);
  assert.strictEqual(rejectSuccess, true);
  assert.strictEqual(engine.pendingCandidates.length, 0);
  assert.strictEqual(store.transactions.length, 2, 'Ledger transactions must remain 2 (rejected item not added)');

  // 8. Test 69 Staged Candidates: Safe Migration & Zero-Loss Retention
  mockLocalStorage.removeItem('apex_web_sms_candidates');
  engine.pendingCandidates = [];

  const staged69 = [];
  for (let i = 1; i <= 69; i++) {
    staged69.push({
      id: 'staged_' + i,
      fingerprint: 'staged_fp_' + i,
      bank: 'CIB',
      cardSuffix: '8492',
      identifierDigits: '8492',
      digitsPosition: 'last',
      entityType: 'card',
      amount: i * 50,
      currency: 'EGP',
      merchant: 'Staged Merchant ' + i,
      status: 'pending'
    });
  }
  mockLocalStorage.setItem('apexwallet_sms_pending_staged_v1', JSON.stringify(staged69));

  // Run fetchPendingTransactions which triggers migrateAndPurgeStagedPlaintext & zero-loss merge
  await engine.fetchPendingTransactions();

  // All 69 candidates MUST be loaded in pendingCandidates without losing a single item!
  assert.strictEqual(engine.pendingCandidates.length, 69, 'All 69 staged candidates must be preserved and available for review');
  assert.strictEqual(engine.pendingCandidates[0].matchedCardId, cibCard.id, 'Candidate 1 must be auto-matched with CIB card');
  assert.strictEqual(engine.pendingCandidates[0].requiresCardSelection, false);

  // Approve first staged candidate
  const approveStaged1 = await engine.approveCandidate(engine.pendingCandidates[0].id);
  assert.strictEqual(approveStaged1.success, true);
  assert.strictEqual(engine.pendingCandidates.length, 68);
  assert.strictEqual(store.transactions.length, 3);
}

async function testDualBudgetModel() {
  const sandbox = createHeadlessSandbox();
  const store = sandbox.window.walletStore;
  store.resetToSampleData();

  // Find a credit card (e.g. CIB Titanium Miles)
  const creditCard = store.cards.find(c => c.cardType === 'credit');
  assert.ok(creditCard, 'Must have at least one credit card');
  assert.ok(creditCard.creditLimit >= 30000, 'Credit limit must be configured on card');
  assert.ok(creditCard.monthlyTarget > 0, 'Personal spending target must be configured');
  assert.notStrictEqual(creditCard.creditLimit, creditCard.monthlyTarget, 'Bank Credit Limit and Personal Target must be distinct');

  // Verify getCardSpendingStats returns both numbers
  const stats = store.getCardSpendingStats(creditCard.id);
  assert.ok(stats !== null);
  assert.strictEqual(stats.creditLimit, creditCard.creditLimit);
  assert.strictEqual(stats.target, creditCard.monthlyTarget);
  assert.strictEqual(stats.remaining, Math.max(0, creditCard.monthlyTarget - stats.spent));

  // Set cycle budget for a specific statement key
  const stmtKey = stats.statementKey;
  store.setCardCycleBudget(creditCard.id, stmtKey, 15000);
  const updatedStats = store.getCardSpendingStats(creditCard.id, stmtKey);
  assert.strictEqual(updatedStats.target, 15000, 'Target for cycle must be 15,000');
  assert.strictEqual(updatedStats.creditLimit, creditCard.creditLimit, 'Bank credit limit must remain unchanged');

  // Check other cycle maintains baseline target without zeroing history
  const otherStats = store.getCardSpendingStats(creditCard.id, '2025-01');
  assert.strictEqual(otherStats.target, creditCard.monthlyTarget, 'Other cycle without override uses default monthly target');

  // Test Item 2: Zero fabrication of credit limit when field left blank
  const bank = store.banks[0];
  const cardWithoutLimit = store.addCard({
    bankId: bank.id,
    name: 'Zero Fabrication Test Card',
    last4: '9988',
    cardType: 'credit',
    monthlyTarget: 15000,
    creditLimit: '', // Empty input from user!
    cycleStartDay: 10,
    cycleEndDay: 9
  });
  assert.strictEqual(cardWithoutLimit.creditLimit, null, 'creditLimit MUST be null when input is empty (NEVER fabricated)');
  const statsNoLimit = store.getCardSpendingStats(cardWithoutLimit.id);
  assert.strictEqual(statsNoLimit.creditLimit, null, 'getCardSpendingStats must return null creditLimit when not configured');

  // Test Item 1: Prompt choice at the start of each new billing cycle
  // The newly added card has no acknowledged cycles and no cycleBudgets yet
  const pendingPrompts = store.getCardsWithPendingCycleBudgetPrompt();
  const foundPrompt = pendingPrompts.find(p => p.cardId === cardWithoutLimit.id);
  assert.ok(foundPrompt, 'New card with active cycle must be flagged for budget prompt');
  assert.strictEqual(foundPrompt.previousBudget, 15000, 'Previous budget baseline must match monthlyTarget');
  assert.strictEqual(foundPrompt.creditLimit, null, 'Must report null credit limit without fabrication');

  // User chooses option 1: Continue with previous budget
  store.confirmCycleBudget(cardWithoutLimit.id, foundPrompt.cycleKey, foundPrompt.previousBudget);
  assert.strictEqual(cardWithoutLimit.cycleBudgets[foundPrompt.cycleKey], 15000);
  assert.ok(cardWithoutLimit.acknowledgedCycles.includes(foundPrompt.cycleKey));

  // Verify prompt does NOT repeat for the same cycle
  const remainingPrompts = store.getCardsWithPendingCycleBudgetPrompt();
  const repeatPrompt = remainingPrompts.find(p => p.cardId === cardWithoutLimit.id);
  assert.strictEqual(repeatPrompt, undefined, 'Prompt MUST NOT appear again for an acknowledged cycle');
}

async function testLiveAccountBalanceAndWithdrawalRules() {
  const sandbox = createHeadlessSandbox();
  const store = sandbox.window.walletStore;
  store.clearAllData();

  // 1. Create a bank
  const bank = store.addBank({ name: 'CIB Egypt', shortCode: 'CIB', accentColor: '#002D62' });

  // 2. Create a bank account with initial balance 10,000 EGP
  const account = store.addAccount({
    bankId: bank.id,
    name: 'Primary Current Account',
    identifierDigits: '9055',
    digitsPosition: 'last',
    balance: 10000,
    currency: 'EGP'
  });
  assert.strictEqual(account.balance, 10000, 'Initial account balance must be 10000');

  // 3. Create a debit card linked to this account
  const debitCard = store.addCard({
    bankId: bank.id,
    name: 'Titanium Debit',
    last4: '9055',
    cardType: 'debit',
    linkedAccountId: account.id,
    monthlyTarget: 15000
  });

  // 4. Log a normal purchase transaction of 1,500 EGP on the debit card
  const txPurchase = store.addTransaction({
    amount: 1500,
    merchant: 'Carrefour Hypermarket',
    category: 'groceries',
    cardId: debitCard.id,
    transactionType: 'purchase'
  });

  // Verify: Balance is deducted on the account (10,000 - 1,500 = 8,500)
  assert.strictEqual(account.balance, 8500, 'Account balance must decrease by purchase amount to 8500');
  // Verify: Spending is recorded on card budget
  const cardStats1 = store.getCardSpendingStats(debitCard.id);
  assert.strictEqual(cardStats1.spent, 1500, 'Card spent must reflect normal purchase');
  assert.strictEqual(cardStats1.remaining, 13500, 'Remaining budget must decrease');

  // 5. Log a cash withdrawal of 2,000 EGP on the debit card
  const txWithdrawal = store.addTransaction({
    amount: 2000,
    merchant: 'ATM CIB Arkan',
    category: 'other',
    cardId: debitCard.id,
    transactionType: 'withdrawal'
  });

  // Verify: Cash withdrawal deducts from live account balance (8,500 - 2,000 = 6,500)
  assert.strictEqual(account.balance, 6500, 'Account balance must decrease by withdrawal amount to 6500');

  // Verify Requirement 6: Cash withdrawal is NOT counted against personal card budget
  const cardStats2 = store.getCardSpendingStats(debitCard.id);
  assert.strictEqual(cardStats2.spent, 1500, 'Card spent MUST NOT include cash withdrawal (remains 1500)');
  assert.strictEqual(cardStats2.remaining, 13500, 'Remaining budget MUST NOT be reduced by cash withdrawal');

  // 6. Log an incoming transfer of 3,000 EGP to the account
  const txIncome = store.addTransaction({
    amount: 3000,
    merchant: 'Salary Deposit',
    category: 'services',
    accountId: account.id,
    direction: 'income',
    transactionType: 'transfer'
  });
  // Balance increases (6,500 + 3,000 = 9,500)
  assert.strictEqual(account.balance, 9500, 'Account balance must increase by income to 9500');

  // 7. Delete purchase transaction -> Reverses 1,500 deduction (9,500 + 1,500 = 11,000)
  store.deleteTransaction(txPurchase.id);
  assert.strictEqual(account.balance, 11000, 'Deleting purchase transaction must reverse deduction on account balance');
  const cardStats3 = store.getCardSpendingStats(debitCard.id);
  assert.strictEqual(cardStats3.spent, 0, 'Card spent must reset to 0 after deleting purchase');

  // 8. Delete cash withdrawal -> Reverses 2,000 deduction (11,000 + 2,000 = 13,000)
  store.deleteTransaction(txWithdrawal.id);
  assert.strictEqual(account.balance, 13000, 'Deleting withdrawal must reverse deduction on account balance');

  // 9. Delete income transaction -> Reverses 3,000 income (13,000 - 3,000 = 10,000 initial balance!)
  store.deleteTransaction(txIncome.id);
  assert.strictEqual(account.balance, 10000, 'Deleting income must reverse addition returning balance to 10000 initial');
}

(async function main() {
  await runStepAsync('New user boot: Setup PIN and configure master vault', async () => {
    await testRuntimeLifecycle();
  });

  await runStepAsync('Existing user boot: Lock, wrong PIN rejection, correct PIN unlock & decryption', async () => {
    // verified in testRuntimeLifecycle
  });

  await runStepAsync('End-to-End Integration: app.js + sms_engine.js store binding, SMS auto-matching & approval', async () => {
    await testSmsStoreIntegration();
  });

  await runStepAsync('Dual Budget Model: Bank Credit Limit vs Personal Budget per billing cycle', async () => {
    await testDualBudgetModel();
  });

  await runStepAsync('Live Account Balance & Zero-Budget Cash Withdrawal Rules', async () => {
    await testLiveAccountBalanceAndWithdrawalRules();
  });

  console.log('\n----------------------------------------------------');
  console.log(`Results: ${passedCount} / ${totalCount} boot & syntax tests passed (100%)`);
  console.log('----------------------------------------------------');
})();
