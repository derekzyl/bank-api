import os
import base64
from .data import BANKS

# Get the directory where this file resides
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
LOGOS_DIR = os.path.join(CURRENT_DIR, "logos")

# Pre-index for fast lookups
_BANKS_BY_CODE = {}
_BANKS_BY_SLUG = {}

for bank in BANKS:
    code = bank.get("code")
    if code:
        # Normalize code to string and strip whitespace
        code_str = str(code).strip()
        _BANKS_BY_CODE[code_str] = bank
    
    slug = bank.get("slug")
    if slug:
        slug_str = str(slug).strip().lower()
        _BANKS_BY_SLUG[slug_str] = bank

def all_banks():
    """
    Returns a list of all Nigerian banks, microfinance banks, and fintechs.
    Each bank is represented as a dictionary with keys:
    - name: Official bank name
    - slug: URL-friendly unique identifier
    - code: NIP/NIBSS routing code (or None)
    - ussd: USSD dial code (or None)
    - logo_filename: The filename of the local logo asset
    - logo_base64: The base64-encoded Data URL of the bank's logo
    """
    # Return a copy to prevent mutation of the internal data
    return [bank.copy() for bank in BANKS]

def get_banks():
    """Alias for all_banks()"""
    return all_banks()

def get_by_code(code):
    """
    Retrieves a bank by its NIP/NIBSS code.
    Returns the bank dictionary, or None if not found.
    """
    if code is None:
        return None
    code_str = str(code).strip()
    bank = _BANKS_BY_CODE.get(code_str)
    return bank.copy() if bank else None

def get_by_slug(slug):
    """
    Retrieves a bank by its slug.
    Returns the bank dictionary, or None if not found.
    """
    if not slug:
        return None
    slug_str = str(slug).strip().lower()
    bank = _BANKS_BY_SLUG.get(slug_str)
    return bank.copy() if bank else None

def search(query):
    """
    Searches for banks matching a query string.
    Checks name, slug, code, and ussd (case-insensitive substring match).
    Returns a list of matching bank dictionaries.
    """
    if not query:
        return []
    
    query_str = str(query).strip().lower()
    results = []
    
    for bank in BANKS:
        name = bank.get("name", "") or ""
        slug = bank.get("slug", "") or ""
        code = bank.get("code", "") or ""
        ussd = bank.get("ussd", "") or ""
        
        if (query_str in name.lower() or
            query_str in slug.lower() or
            query_str in str(code).lower() or
            query_str in str(ussd).lower()):
            results.append(bank.copy())
            
    return results

def get_logo_path(slug):
    """
    Gets the absolute local file path to the bank's logo.
    Falls back to the default SVG logo path if not found.
    """
    bank = get_by_slug(slug)
    filename = "default.svg"
    if bank:
        filename = bank.get("logo_filename") or "default.svg"
        
    path = os.path.join(LOGOS_DIR, filename)
    if os.path.exists(path):
        return path
        
    # Ultimate fallback to default.svg
    default_path = os.path.join(LOGOS_DIR, "default.svg")
    return default_path if os.path.exists(default_path) else None

def get_logo_bytes(slug):
    """
    Retrieves the raw binary bytes of the bank's logo file.
    """
    path = get_logo_path(slug)
    if path and os.path.exists(path):
        with open(path, "rb") as f:
            return f.read()
    return b""

def get_logo_base64(slug):
    """
    Retrieves the Base64-encoded Data URL of the bank's logo.
    Examples:
    - 'data:image/png;base64,...'
    - 'data:image/svg+xml;base64,...'
    """
    bank = get_by_slug(slug)
    if bank and bank.get("logo_base64"):
        return bank.get("logo_base64")
        
    # If bank not found or lacks logo, encode the default logo
    default_path = os.path.join(LOGOS_DIR, "default.svg")
    if os.path.exists(default_path):
        with open(default_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/svg+xml;base64,{encoded}"
        
    return ""
