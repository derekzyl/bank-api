'use client';

import React, { useState } from 'react';

export default function Home() {
  const [copiedText, setCopiedText] = useState({});

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText((prev) => ({ ...prev, [id]: 'Copied!' }));
    setTimeout(() => {
      setCopiedText((prev) => ({ ...prev, [id]: null }));
    }, 2000);
  };

  const codeSnippets = {
    getGlobalPaginated: `curl -X GET "https://banks.cybergenii.com/api/v1/banks?page=1&limit=10"`,
    getGlobalByCountry: `curl -X GET "https://banks.cybergenii.com/api/v1/banks?country=nigeria"`,
    getNigAll: `curl -X GET "https://banks.cybergenii.com/api/v1/nig/banks"`,
    getNigSingle: `curl -X GET "https://banks.cybergenii.com/api/v1/nig/banks/access-bank"`,
    getNigLogo: `curl -I "https://banks.cybergenii.com/api/v1/nig/banks/access-bank/logo"`,
  };

  const responseExamples = {
    getGlobal: `{
  "total": 442,
  "page": 1,
  "limit": 10,
  "pages": 45,
  "data": [
    {
      "name": "Access Bank",
      "slug": "access-bank",
      "code": "044",
      "ussd": "*901#",
      "logo_filename": "access-bank.png",
      "logo_base64": "data:image/png;base64,...",
      "country": "Nigeria"
    },
    ...
  ]
}`,
    getNigSingle: `{
  "name": "Guaranty Trust Bank",
  "slug": "guaranty-trust-bank",
  "code": "058",
  "ussd": "*737#",
  "logo_filename": "guaranty-trust-bank.png",
  "logo_base64": "data:image/png;base64,...",
  "country": "Nigeria"
}`
  };

  return (
    <div className="layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" alt="Logo" style={{ width: '28px', height: '28px' }} />
          <span>Banks API</span>
          <span className="nav-logo-badge">v1.1</span>
        </div>
        <ul className="nav-links">
          <li><a href="#introduction">Introduction</a></li>
          <li><a href="#authentication">Authentication</a></li>
          <li><a href="#global-paginated">Global Banks (Paginated)</a></li>
          <li><a href="#country-specific">Country Specific (NIG)</a></li>
          <li><a href="#get-single">Get Single Bank</a></li>
          <li><a href="#get-logo">Get Bank Logo</a></li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <section id="introduction">
          <h1>Global & Regional Banks API</h1>
          <p>
            Welcome to the Banks API developer portal. This service provides high-performance,
            zero-dependency REST endpoints for retrieving accurate bank routing codes, logos, slugs, and USSD codes
            globally. It features a main paginated index and country-specific namespaces to scale as new regions are supported.
          </p>
        </section>

        <section id="authentication" style={{ marginTop: '2rem' }}>
          <h2>Authentication</h2>
          <p>
            No API keys or authentication headers are required. All endpoints are publicly accessible
            with zero rate-limiting constraints to facilitate seamless development.
          </p>
        </section>

        {/* Endpoint 1: Global Paginated Banks */}
        <section id="global-paginated" className="card" style={{ marginTop: '3rem' }}>
          <div className="endpoint-header">
            <span className="method get">GET</span>
            <span className="path">/api/v1/banks</span>
          </div>
          <p>
            Fetches all supported banks globally. The response is enveloped in a pagination container
            supporting page navigation and records limits.
          </p>

          <h3>Query Parameters</h3>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="param-name">page</td>
                <td className="param-type">integer</td>
                <td>1</td>
                <td>The page index to fetch (must be &ge; 1).</td>
              </tr>
              <tr>
                <td className="param-name">limit</td>
                <td className="param-type">integer</td>
                <td>50</td>
                <td>Number of records per page (max 100).</td>
              </tr>
              <tr>
                <td className="param-name">country</td>
                <td className="param-type">string</td>
                <td>-</td>
                <td>Filters by country name or code (e.g. <code>Nigeria</code>, <code>NG</code>, <code>nig</code>). Case-insensitive.</td>
              </tr>
              <tr>
                <td className="param-name">search</td>
                <td className="param-type">string</td>
                <td>-</td>
                <td>Case-insensitive query matching bank name, code, slug, or USSD code.</td>
              </tr>
            </tbody>
          </table>

          <h3>Paginated Request Example</h3>
          <pre>
            <code>{codeSnippets.getGlobalPaginated}</code>
            <button className="copy-btn" onClick={() => copyToClipboard(codeSnippets.getGlobalPaginated, 'getGlobalPaginated')}>
              {copiedText.getGlobalPaginated || 'Copy'}
            </button>
          </pre>

          <h3>Country-Filtered Request Example</h3>
          <pre>
            <code>{codeSnippets.getGlobalByCountry}</code>
            <button className="copy-btn" onClick={() => copyToClipboard(codeSnippets.getGlobalByCountry, 'getGlobalByCountry')}>
              {copiedText.getGlobalByCountry || 'Copy'}
            </button>
          </pre>

          <h3>Response Example</h3>
          <pre>
            <code>{responseExamples.getGlobal}</code>
          </pre>
        </section>

        {/* Endpoint 2: Country Specific (NIG) */}
        <section id="country-specific" className="card">
          <div className="endpoint-header">
            <span className="method get">GET</span>
            <span className="path">/api/v1/nig/banks</span>
          </div>
          <p>
            Retrieves the full, unpaginated dataset of all financial institutions in Nigeria. Use this
            if you require the complete list immediately without querying page offsets.
          </p>

          <h3>Request Example</h3>
          <pre>
            <code>{codeSnippets.getNigAll}</code>
            <button className="copy-btn" onClick={() => copyToClipboard(codeSnippets.getNigAll, 'getNigAll')}>
              {copiedText.getNigAll || 'Copy'}
            </button>
          </pre>
        </section>

        {/* Endpoint 3: Get Single Bank */}
        <section id="get-single" className="card">
          <div className="endpoint-header">
            <span className="method get">GET</span>
            <span className="path">/api/v1/nig/banks/[slug]</span>
          </div>
          <p>Retrieves metadata for a specific bank slug in the specified country namespace (e.g. Nigeria).</p>

          <h3>Request Example</h3>
          <pre>
            <code>{codeSnippets.getNigSingle}</code>
            <button className="copy-btn" onClick={() => copyToClipboard(codeSnippets.getNigSingle, 'getNigSingle')}>
              {copiedText.getNigSingle || 'Copy'}
            </button>
          </pre>

          <h3>Response Example</h3>
          <pre>
            <code>{responseExamples.getNigSingle}</code>
          </pre>
        </section>

        {/* Endpoint 4: Serve Bank Logo */}
        <section id="get-logo" className="card">
          <div className="endpoint-header">
            <span className="method get">GET</span>
            <span className="path">/api/v1/nig/banks/[slug]/logo</span>
          </div>
          <p>
            Directly serves the binary PNG/SVG logo image of the requested bank. It includes long-term caching
            headers, allowing you to source this URL directly inside HTML image components.
          </p>

          <h3>cURL Header Check Example</h3>
          <pre>
            <code>{codeSnippets.getNigLogo}</code>
            <button className="copy-btn" onClick={() => copyToClipboard(codeSnippets.getNigLogo, 'getNigLogo')}>
              {copiedText.getNigLogo || 'Copy'}
            </button>
          </pre>
        </section>
      </main>
    </div>
  );
}
