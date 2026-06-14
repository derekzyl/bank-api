const assert = require('assert');
const fs = require('fs');
const nigeria = require('../index');

console.log('Running Node.js tests for nigerian-banks...');

try {
  // 1. Test allBanks()
  const banks = nigeria.allBanks();
  assert(Array.isArray(banks), 'allBanks() should return an array');
  assert(banks.length > 400, `Should contain over 400 banks, got ${banks.length}`);
  const sample = banks[0];
  assert(sample.name && sample.slug && 'code' in sample && 'ussd' in sample && sample.logo_filename && sample.logo_base64, 'Bank object should contain all keys');

  // 2. Test getByCode(code)
  const gtb = nigeria.getByCode('058');
  assert(gtb !== null, 'Should find GTBank');
  assert.strictEqual(gtb.slug, 'guaranty-trust-bank');
  assert.strictEqual(gtb.name, 'Guaranty Trust Bank');

  const kuda = nigeria.getByCode('50211');
  assert(kuda !== null, 'Should find Kuda');
  assert.strictEqual(kuda.slug, 'kuda-microfinance-bank');

  const noneBank = nigeria.getByCode('999999');
  assert.strictEqual(noneBank, null, 'Should return null for non-existent code');

  // 3. Test getBySlug(slug)
  const access = nigeria.getBySlug('access-bank');
  assert(access !== null, 'Should find Access Bank');
  assert.strictEqual(access.code, '044');

  const accessCase = nigeria.getBySlug('  AcCeSs-BaNk  ');
  assert(accessCase !== null, 'Should find Access Bank case-insensitively with spacing');
  assert.strictEqual(accessCase.code, '044');

  const noneSlug = nigeria.getBySlug('invalid-slug');
  assert.strictEqual(noneSlug, null);

  // 4. Test search(query)
  const wema = nigeria.search('wema');
  assert(wema.length >= 1);
  assert(wema.some(b => b.slug === 'wema-bank'));

  const mfbs = nigeria.search('microfinance');
  assert(mfbs.length > 100);

  const noMatch = nigeria.search('xyzunknownbank');
  assert.strictEqual(noMatch.length, 0);

  // 5. Test getLogoPath(slug)
  const logoPath = nigeria.getLogoPath('access-bank');
  assert(logoPath !== null);
  assert(fs.existsSync(logoPath));
  assert(logoPath.endsWith('.png'));

  const fallbackPath = nigeria.getLogoPath('non-existent-bank');
  assert(fallbackPath !== null);
  assert(fs.existsSync(fallbackPath));
  assert(fallbackPath.endsWith('default.svg'));

  // 6. Test getLogoBytes(slug)
  const bytes = nigeria.getLogoBytes('access-bank');
  assert(bytes instanceof Buffer);
  assert(bytes.length > 0);

  const fallbackBytes = nigeria.getLogoBytes('non-existent-bank');
  assert(fallbackBytes instanceof Buffer);
  assert(fallbackBytes.length > 0);

  // 7. Test getLogoBase64(slug)
  const b64 = nigeria.getLogoBase64('access-bank');
  assert(b64.startsWith('data:image/png;base64,'));

  const fallbackB64 = nigeria.getLogoBase64('non-existent-bank');
  assert(fallbackB64.startsWith('data:image/svg+xml;base64,'));

  console.log('All Node.js tests passed successfully!');
} catch (error) {
  console.error('Node.js test verification failed:');
  console.error(error);
  process.exit(1);
}
