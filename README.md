# Global & Regional Banks Data Package (`banks-api`)

A comprehensive, lightweight, and type-safe dual-language (Python + Node.js/TypeScript) package providing up-to-date details for all registered banks in Nigeria (including commercial banks, microfinance institutions, mortgage banks, and fintechs), structured to easily expand globally.

It provides names, countries, slugs, NIP bank codes, USSD dial codes, and brand logo assets (available as local file paths, raw binary bytes, or embedded base64-encoded Data URLs).

🎯 **Live Developer Portal:** [https://banks.cybergenii.com](https://banks.cybergenii.com)
*(Features a responsive interactive directory, API Playground, service status monitor, and API client keys management)*

---

## ✨ Features

- **Rich Bank Metadata**: Accurate lookup database covering 440+ financial institutions.
- **Embedded Base64 Branding Logos**: Every bank includes high-quality logo branding embedded as `data:image/...;base64` strings for instant offline loading and zero network latency.
- **Dual-Language Native Support**: Native Python SDK (`pip`) and Node.js/TypeScript SDK (`npm`) wrapper libraries.
- **Next.js API & UI Server**: Complete out-of-the-box Next.js App Router project that hosts the developer portal and serves a fast, paginated REST API.
- **Premium Responsive Interface**: A Stitch-style developer dashboard with Light/Dark/System theming, responsive search grids, and modal inspectors.

---

## ⚡ Next.js API Endpoints

The Next.js App Router backend serves a fast REST API layer. The API supports both global paginated directory lookups and country-specific regional namespaces:

### 1. Global Paginated Endpoint (`GET /api/v1/banks`)
Retrieves all banks across all countries inside a paginated envelope.
* **Pagination**: `GET /api/v1/banks?page=1&limit=24` (Default: 50, Max: 100)
* **Country Filter**: `GET /api/v1/banks?country=nigeria` (Case-insensitive, accepts names or country codes/abbreviations: `ng`, `nig`)
* **Search**: `GET /api/v1/banks?search=kuda` (Substring matches across name, code, slug, or USSD code)
* **Exact Filters**: `GET /api/v1/banks?code=058` or `?slug=paycom`

### 2. Country Namespaced Endpoints (e.g., `/api/v1/nig/`)
Retrieves regional datasets directly without pagination envelopes.
* **`GET /api/v1/nig/banks`**: Retrieves all Nigerian banks in a raw array.
* **`GET /api/v1/nig/banks/[slug]`**: Retrieves details for a specific bank slug.
* **`GET /api/v1/nig/banks/[slug]/logo`**: Serves the binary logo file (PNG/SVG/ICO/JPG) directly with client-side caching headers.

---

## 🐍 Python SDK Usage

### Installation
For local development, navigate to the project root and run:
```bash
pip install -e .
```

### Quick Start
```python
import nigeria

# 1. Fetch all banks
banks = nigeria.all_banks()
print(f"Total Banks: {len(banks)}")

# 2. Get bank by code or slug
gtbank = nigeria.get_by_code("058")
kuda = nigeria.get_by_slug("kuda-microfinance-bank")

# 3. Search banks
results = nigeria.search("kuda")

# 4. Fetch logo representations
path = nigeria.get_logo_path("kuda-microfinance-bank")
raw_bytes = nigeria.get_logo_bytes("kuda-microfinance-bank")
base64_uri = nigeria.get_logo_base64("kuda-microfinance-bank")
```

---

## 🟢 Node.js / TypeScript SDK Usage

### Installation
For local development, navigate to the project root and run:
```bash
npm install .
```

### Quick Start
```typescript
import nigeria from 'nigerian-banks';

// 1. Fetch all banks
const all = nigeria.allBanks();

// 2. Get bank by code or slug
const zenith = nigeria.getByCode("057");
const carbon = nigeria.getBySlug("carbon");

// 3. Search banks
const searchResults = nigeria.search("carbon");

// 4. Fetch logo representations
const logoPath = nigeria.getLogoPath("carbon");
const logoBytes = nigeria.getLogoBytes("carbon"); // Returns a Buffer
const logoBase64 = nigeria.getLogoBase64("carbon"); // Returns a data URI string
```

---

## 🌐 Direct Database Access (Raw JSON & Images)

If you are not using Python or Node.js, you can read the JSON database and download logo assets directly from the repository main branches:

* **Raw Database (`banks.json`)**:
  `https://raw.githubusercontent.com/derekzyl/bank-api/main/banks.json`
* **Logo Assets**:
  `https://raw.githubusercontent.com/derekzyl/bank-api/main/nigeria/logos/<slug>.png` (or `.svg` / `.ico` based on format)
