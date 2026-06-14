const path = require('path');
const fs = require('fs');
const BANKS = require('./banks.json');

// Pre-index for fast lookups
const BANKS_BY_CODE = {};
const BANKS_BY_SLUG = {};

BANKS.forEach(bank => {
  if (bank.code) {
    const codeStr = String(bank.code).trim();
    BANKS_BY_CODE[codeStr] = bank;
  }
  if (bank.slug) {
    const slugStr = String(bank.slug).trim().toLowerCase();
    BANKS_BY_SLUG[slugStr] = bank;
  }
});

/**
 * Returns a list of all Nigerian banks, microfinance banks, and fintechs.
 */
function allBanks() {
  return BANKS.map(bank => ({ ...bank }));
}

/**
 * Alias for allBanks()
 */
function getBanks() {
  return allBanks();
}

/**
 * Retrieves a bank by its NIP/NIBSS routing code.
 */
function getByCode(code) {
  if (code === undefined || code === null) {
    return null;
  }
  const codeStr = String(code).trim();
  const bank = BANKS_BY_CODE[codeStr];
  return bank ? { ...bank } : null;
}

/**
 * Retrieves a bank by its unique slug.
 */
function getBySlug(slug) {
  if (!slug) {
    return null;
  }
  const slugStr = String(slug).trim().toLowerCase();
  const bank = BANKS_BY_SLUG[slugStr];
  return bank ? { ...bank } : null;
}

/**
 * Searches for banks matching a query string (checks name, slug, code, ussd).
 */
function search(query) {
  if (!query) {
    return [];
  }
  const queryStr = String(query).trim().toLowerCase();
  return BANKS.filter(bank => {
    const name = (bank.name || '').toLowerCase();
    const slug = (bank.slug || '').toLowerCase();
    const code = String(bank.code || '').toLowerCase();
    const ussd = String(bank.ussd || '').toLowerCase();

    return name.includes(queryStr) ||
           slug.includes(queryStr) ||
           code.includes(queryStr) ||
           ussd.includes(queryStr);
  }).map(bank => ({ ...bank }));
}

/**
 * Gets the absolute local path to the bank's logo.
 * Falls back to the default SVG logo path if not found.
 */
function getLogoPath(slug) {
  const bank = getBySlug(slug);
  const filename = bank ? (bank.logo_filename || 'default.svg') : 'default.svg';
  const logoPath = path.join(__dirname, 'nigeria', 'logos', filename);
  
  if (fs.existsSync(logoPath)) {
    return logoPath;
  }
  
  const defaultPath = path.join(__dirname, 'nigeria', 'logos', 'default.svg');
  return fs.existsSync(defaultPath) ? defaultPath : null;
}

/**
 * Retrieves the raw binary Buffer of the bank's logo file.
 */
function getLogoBytes(slug) {
  const logoPath = getLogoPath(slug);
  if (logoPath && fs.existsSync(logoPath)) {
    return fs.readFileSync(logoPath);
  }
  return Buffer.alloc(0);
}

/**
 * Retrieves the Base64-encoded Data URL of the bank's logo.
 */
function getLogoBase64(slug) {
  const bank = getBySlug(slug);
  if (bank && bank.logo_base64) {
    return bank.logo_base64;
  }
  
  const defaultPath = path.join(__dirname, 'nigeria', 'logos', 'default.svg');
  if (fs.existsSync(defaultPath)) {
    const content = fs.readFileSync(defaultPath).toString('base64');
    return `data:image/svg+xml;base64,${content}`;
  }
  
  return '';
}

module.exports = {
  allBanks,
  getBanks,
  getByCode,
  getBySlug,
  search,
  getLogoPath,
  getLogoBytes,
  getLogoBase64
};
