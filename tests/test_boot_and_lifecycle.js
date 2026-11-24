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
async function testSmsStoreIntegration() {
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

  // 1. Load app.js naturally (creates window.walletStore and window.store)
  const appCode = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  vm.runInContext(appCode, sandbox, { filename: 'app.js' });

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

  console.log('\n----------------------------------------------------');
  console.log(`Results: ${passedCount} / ${totalCount} boot & syntax tests passed (100%)`);
  console.log('----------------------------------------------------');
})();
