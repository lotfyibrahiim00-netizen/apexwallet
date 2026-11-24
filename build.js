const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WWW = path.join(ROOT, 'www');

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
  'icon-512.png'
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
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> www/${file}`);
  } else {
    console.warn(`Warning: asset not found: ${file}`);
  }
}

console.log('Build completed successfully.');
