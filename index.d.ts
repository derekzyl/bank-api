export interface Bank {
    name: string;
    slug: string;
    code: string;
    ussd: string | null;
    logo_filename?: string;
    logo_base64?: string;
    country?: string;
}
/**
 * Returns a list of all Nigerian banks, microfinance banks, and fintechs.
 */
export declare function allBanks(): Bank[];
/**
 * Alias for allBanks()
 */
export declare function getBanks(): Bank[];
/**
 * Retrieves a bank by its NIP/NIBSS routing code.
 */
export declare function getByCode(code: string | number | null | undefined): Bank | null;
/**
 * Retrieves a bank by its unique slug.
 */
export declare function getBySlug(slug: string | null | undefined): Bank | null;
/**
 * Searches for banks matching a query string (checks name, slug, code, ussd).
 */
export declare function search(query: string | null | undefined): Bank[];
/**
 * Gets the absolute local path to the bank's logo.
 * Falls back to the default SVG logo path if not found.
 */
export declare function getLogoPath(slug: string | null | undefined): string | null;
/**
 * Retrieves the raw binary Buffer of the bank's logo file.
 */
export declare function getLogoBytes(slug: string | null | undefined): Buffer;
/**
 * Retrieves the Base64-encoded Data URL of the bank's logo.
 */
export declare function getLogoBase64(slug: string | null | undefined): string;
