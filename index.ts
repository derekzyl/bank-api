import path from 'path';
import fs from 'fs';
import BANKS_JSON from './banks.json';

export interface Bank {
  name: string;
  slug: string;
  code: string;
  ussd: string | null;
  logo_filename?: string;
  logo_base64?: string;
  country?: string;
}

const BANKS = BANKS_JSON as Bank[];

// Pre-index for fast lookups
const BANKS_BY_CODE: Record<string, Bank> = {};
const BANKS_BY_SLUG: Record<string, Bank> = {};

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
export function allBanks(): Bank[] {
  return BANKS.map(bank => ({ ...bank }));
}

/**
 * Alias for allBanks()
 */
export function getBanks(): Bank[] {
  return allBanks();
}

/**
 * Retrieves a bank by its NIP/NIBSS routing code.
 */
export function getByCode(code: string | number | null | undefined): Bank | null {
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
export function getBySlug(slug: string | null | undefined): Bank | null {
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
export function search(query: string | null | undefined): Bank[] {
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
export function getLogoPath(slug: string | null | undefined): string | null {
  const bank = getBySlug(slug);
  const filename = bank ? (bank.logo_filename || 'default.svg') : 'default.svg';
  
  // Try process.cwd() first (for Next.js bundling/running)
  let logoPath = path.join(process.cwd(), 'nigeria', 'logos', filename);
  if (fs.existsSync(logoPath)) {
    return logoPath;
  }
  
  // Fallback to __dirname
  logoPath = path.join(__dirname, 'nigeria', 'logos', filename);
  if (fs.existsSync(logoPath)) {
    return logoPath;
  }
  
  const defaultCwd = path.join(process.cwd(), 'nigeria', 'logos', 'default.svg');
  if (fs.existsSync(defaultCwd)) {
    return defaultCwd;
  }

  const defaultDirname = path.join(__dirname, 'nigeria', 'logos', 'default.svg');
  return fs.existsSync(defaultDirname) ? defaultDirname : null;
}

/**
 * Retrieves the raw binary Buffer of the bank's logo file.
 */
export function getLogoBytes(slug: string | null | undefined): Buffer {
  const logoPath = getLogoPath(slug);
  if (logoPath && fs.existsSync(logoPath)) {
    return fs.readFileSync(logoPath);
  }
  return Buffer.alloc(0);
}

/**
 * Retrieves the Base64-encoded Data URL of the bank's logo.
 */
export function getLogoBase64(slug: string | null | undefined): string {
  const bank = getBySlug(slug);
  if (bank && bank.logo_base64) {
    return bank.logo_base64;
  }
  
  const logoPath = getLogoPath(slug);
  if (logoPath && fs.existsSync(logoPath)) {
    const contentType = logoPath.endsWith('.png') ? 'image/png' : 'image/svg+xml';
    const content = fs.readFileSync(logoPath).toString('base64');
    return `data:${contentType};base64,${content}`;
  }
  
  return '';
}
