"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allBanks = allBanks;
exports.getBanks = getBanks;
exports.getByCode = getByCode;
exports.getBySlug = getBySlug;
exports.search = search;
exports.getLogoPath = getLogoPath;
exports.getLogoBytes = getLogoBytes;
exports.getLogoBase64 = getLogoBase64;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const banks_json_1 = __importDefault(require("./banks.json"));
const BANKS = banks_json_1.default;
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
    // Try process.cwd() first (for Next.js bundling/running)
    let logoPath = path_1.default.join(process.cwd(), 'nigeria', 'logos', filename);
    if (fs_1.default.existsSync(logoPath)) {
        return logoPath;
    }
    // Fallback to __dirname
    logoPath = path_1.default.join(__dirname, 'nigeria', 'logos', filename);
    if (fs_1.default.existsSync(logoPath)) {
        return logoPath;
    }
    const defaultCwd = path_1.default.join(process.cwd(), 'nigeria', 'logos', 'default.svg');
    if (fs_1.default.existsSync(defaultCwd)) {
        return defaultCwd;
    }
    const defaultDirname = path_1.default.join(__dirname, 'nigeria', 'logos', 'default.svg');
    return fs_1.default.existsSync(defaultDirname) ? defaultDirname : null;
}
/**
 * Retrieves the raw binary Buffer of the bank's logo file.
 */
function getLogoBytes(slug) {
    const logoPath = getLogoPath(slug);
    if (logoPath && fs_1.default.existsSync(logoPath)) {
        return fs_1.default.readFileSync(logoPath);
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
    const logoPath = getLogoPath(slug);
    if (logoPath && fs_1.default.existsSync(logoPath)) {
        const contentType = logoPath.endsWith('.png') ? 'image/png' : 'image/svg+xml';
        const content = fs_1.default.readFileSync(logoPath).toString('base64');
        return `data:${contentType};base64,${content}`;
    }
    return '';
}
