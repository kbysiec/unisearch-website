// Simple script to create 1x1 pixel placeholder images
// Run with: node scripts/generate-placeholders.js

const fs = require('fs');
const path = require('path');

// Base64 encoded 1x1 transparent PNG
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

// Base64 encoded 1x1 blue PNG (#1DA1F2)
const bluePNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk2M/wHwADQAKx5bjy+QAAAABJRU5ErkJggg==',
  'base64'
);

const publicDir = path.join(__dirname, '..', 'public');

const files = {
  'logo.png': bluePNG,
  'screenshot.png': bluePNG,
  'apple-touch-icon.png': bluePNG,
  'og-image.png': bluePNG,
  'android-chrome-192x192.png': bluePNG,
  'android-chrome-512x512.png': bluePNG,
};

console.log('🎨 Generowanie placeholder images...\n');

Object.entries(files).forEach(([filename, data]) => {
  const filepath = path.join(publicDir, filename);
  fs.writeFileSync(filepath, data);
  console.log(`✅ Utworzono: ${filename}`);
});

console.log('\n✨ Gotowe! Placeholder images zostały wygenerowane.');
console.log('⚠️  UWAGA: Zamień je na prawdziwe obrazy przed deploymentem!');
console.log('📖 Zobacz: public/DODAJ_OBRAZY.md\n');
