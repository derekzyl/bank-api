# Global & Regional Banks Data Package (`banks-api`)

A comprehensive, lightweight dual-language (Python + Node.js) package providing up-to-date details for all registered banks in Nigeria (including commercial banks, microfinance institutions, and fintechs), structured to expand globally.

It provides names, countries, slugs, NIP bank codes, USSD dial codes, and logo assets (available as local file paths, raw binary bytes, or embedded base64-encoded Data URLs).

---

## 🌐 Direct GitHub Access (Raw JSON & Images)

If you are not using Python or Node.js, you can read the JSON database and download the logo assets directly from the GitHub repository:

*   **Raw Database (`banks.json`)**:
    `https://raw.githubusercontent.com/<username>/<repo>/main/banks.json`
*   **Logo Assets (PNG/SVG)**:
    `https://raw.githubusercontent.com/<username>/<repo>/main/nigeria/logos/<slug>.png` (or `default.svg` if the bank has no custom logo).

---

## ⚡ Next.js API Server (Self-Hosted/Vercel)

The repository includes a ready-to-deploy Next.js App Router server to host your own API (e.g. `banks.cybergenii.com`). The API supports both global paginated directory lookups and country-specific regional namespaces:

### 1. Global Paginated Endpoint (`GET /api/v1/banks`)
Retrieves all banks across all countries in a paginated envelope.
*   **Pagination**: `GET /api/v1/banks?page=1&limit=20` (default: 50, max: 100)
*   **Country Filter**: `GET /api/v1/banks?country=nigeria` (case-insensitive, accepts country name or abbreviations e.g. `ng`, `nig`)
*   **Search**: `GET /api/v1/banks?search=kuda` (substring matching names, codes, slugs, or USSD codes)
*   **Exact Filters**: `GET /api/v1/banks?code=058` or `?slug=paycom`

### 2. Country Namespaced Endpoints (e.g. `/api/v1/nig/`)
Retrieves regional datasets directly without pagination envelopes.
*   **`GET /api/v1/nig/banks`**: Retrieves all Nigerian banks.
*   **`GET /api/v1/nig/banks/[slug]`**: Retrieves details for a specific bank slug.
*   **`GET /api/v1/nig/banks/[slug]/logo`**: Dynamically serves the binary PNG/SVG logo file with caching headers.

---

## 🐍 Python Package Usage

### Installation
For local development, navigate to the directory and run:
```bash
pip install -e .
```

### Import the Package
```python
import nigeria
```

### API Methods

*   **`nigeria.all_banks()`**: Returns a list of all 440+ bank dictionaries.
*   **`nigeria.get_by_code(code)`**: Fetches a bank by its NIP/NIBSS routing code (e.g. `"058"`).
*   **`nigeria.get_by_slug(slug)`**: Fetches a bank by its slug (e.g. `"kuda-microfinance-bank"`).
*   **`nigeria.search(query)`**: Performs a case-insensitive search across names, slugs, codes, and USSD dial strings.
*   **`nigeria.get_logo_path(slug)`**: Returns the absolute local file path of the logo.
*   **`nigeria.get_logo_bytes(slug)`**: Returns the raw binary bytes of the logo file.
*   **`nigeria.get_logo_base64(slug)`**: Returns the base64-encoded Data URL of the logo.

---

## 🟢 Node.js Package Usage

### Installation
For local development, navigate to the directory and run:
```bash
npm install .
```

### Import the Package
```javascript
const nigeria = require('nigerian-banks');
```

### API Methods

*   **`nigeria.allBanks()`**: Returns a list of all 440+ bank objects.
*   **`nigeria.getByCode(code)`**: Fetches a bank by its NIP/NIBSS routing code (e.g. `"058"`).
*   **`nigeria.getBySlug(slug)`**: Fetches a bank by its slug (e.g. `"kuda-microfinance-bank"`).
*   **`nigeria.search(query)`**: Performs a case-insensitive search across names, slugs, codes, and USSD dial strings.
*   **`nigeria.getLogoPath(slug)`**: Returns the absolute local file path of the logo.
*   **`nigeria.getLogoBytes(slug)`**: Returns a Buffer containing the logo's raw binary bytes.
*   **`nigeria.getLogoBase64(slug)`**: Returns the base64-encoded Data URL of the logo.
