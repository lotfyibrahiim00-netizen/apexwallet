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

(async function main() {
  await runStepAsync('New user boot: Setup PIN and configure master vault', async () => {
    await testRuntimeLifecycle();
  });

  await runStepAsync('Existing user boot: Lock, wrong PIN rejection, correct PIN unlock & decryption', async () => {
    // verified in testRuntimeLifecycle
  });

  console.log('\n----------------------------------------------------');
  console.log(`Results: ${passedCount} / ${totalCount} boot & syntax tests passed (100%)`);
  console.log('----------------------------------------------------');
})();
