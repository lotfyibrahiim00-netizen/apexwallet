const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const WWW = path.join(ROOT, 'www');

// MANDATORY PRE-BUILD VERIFICATION:
// 1. Syntax check and runtime boot lifecycle test
// 2. Synthetic SMS parser test suite
console.log('Running mandatory pre-build verification tests...');
try {
  execSync('node tests/test_boot_and_lifecycle.js', { stdio: 'inherit', cwd: ROOT });
  execSync('node tests/test_sms_parser.js', { stdio: 'inherit', cwd: ROOT });
  console.log('✅ Mandatory pre-build verification passed.\n');
} catch (testErr) {
  console.error('\n❌ BUILD REJECTED: Mandatory pre-build verification failed!');
  process.exit(1);
}

const ASSETS = [
  'index.html',
  'styles.css',
  'app.js',
  'ui.js',
  'security.js',
  'sms_engine.js',
  'manifest.json',
  'sw.js',
  'icon-192.png',
  'icon-512.png',
  'vendor'
];

console.log('Building web assets for Capacitor in:', WWW);

if (fs.existsSync(WWW)) {
  fs.rmSync(WWW, { recursive: true, force: true });
}
fs.mkdirSync(WWW, { recursive: true });

for (const file of ASSETS) {
  const src = path.join(ROOT, file);
  const dest = path.join(WWW, file);
  if (fs.existsSync(src)) {
    if (fs.lstatSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
      console.log(`Copied directory ${file} -> www/${file}`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} -> www/${file}`);
    }
  } else {
    console.warn(`Warning: asset not found: ${file}`);
  }
}

console.log('Build completed successfully.');
