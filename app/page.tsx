'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [copiedText, setCopiedText] = useState<Record<string, string | null>>({});

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText((prev) => ({ ...prev, [id]: 'Copied!' }));
    setTimeout(() => {
      setCopiedText((prev) => ({ ...prev, [id]: null }));
    }, 2000);
  };

  // Set up intersection observer for scroll-spying hash tags in the sidebar
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    const handleScroll = () => {
      let currentSectionId = '';
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop;
        // Check if section is currently visible on screen
        if (window.scrollY >= sectionTop - 140) {
          const id = htmlSection.getAttribute('id');
          if (id) currentSectionId = id;
        }
      });

      sidebarLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.includes('#')) {
          const targetId = href.split('#')[1];
          if (targetId === currentSectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const codeSnippets = {
    getGlobal: 'curl -X GET "https://banks.cybergenii.com/api/v1/banks?page=1&limit=5"',
    getCountry: 'curl -X GET "https://banks.cybergenii.com/api/v1/nig/banks"',
    getSingle: 'curl -X GET "https://banks.cybergenii.com/api/v1/nig/banks/access-bank"',
    getLogo: 'curl -I "https://banks.cybergenii.com/api/v1/nig/banks/access-bank/logo"',
  };

  const jsonResponses = {
    getGlobal: {
      total: 442,
      page: 1,
      limit: 5,
      pages: 89,
      data: [
        {
          name: "Access Bank",
          slug: "access-bank",
          code: "044",
          ussd: "*901#",
          country: "Nigeria"
        },
        {
          name: "Citibank",
          slug: "citibank",
          code: "023",
          ussd: null,
          country: "Nigeria"
        }
      ]
    },
    getCountry: [
      {
        name: "Guaranty Trust Bank",
        slug: "guaranty-trust-bank",
        code: "058",
        ussd: "*737#",
        country: "Nigeria"
      },
      {
        name: "Zenith Bank",
        slug: "zenith-bank",
        code: "057",
        ussd: "*966#",
        country: "Nigeria"
      }
    ],
    getSingle: {
      name: "Access Bank",
      slug: "access-bank",
      code: "044",
      ussd: "*901#",
      country: "Nigeria"
    }
  };

  // Client-side syntax highlighting
  const renderHighlightedJSON = (obj: any) => {
    const jsonString = JSON.stringify(obj, null, 2);
    return jsonString.split('\n').map((line, index) => {
      const keyMatch = line.match(/^(\s*)"([^"]+)"(\s*:\s*)(.*)$/);
      if (keyMatch) {
        const indent = keyMatch[1];
        const key = keyMatch[2];
        const colon = keyMatch[3];
        const val = keyMatch[4];
        
        let valEl = <span className="syntax-val">{val}</span>;
        if (val.startsWith('"')) {
          valEl = <span className="syntax-str">{val}</span>;
        } else if (val.match(/^(true|false),?$/)) {
          valEl = <span className="syntax-bool">{val}</span>;
        } else if (val.match(/^[0-9.-]+,?$/)) {
          valEl = <span className="syntax-num">{val}</span>;
        } else if (val.startsWith('null')) {
          valEl = <span className="syntax-null">{val}</span>;
        }
        
        return (
          <div key={index}>
            {indent}
            <span className="syntax-key">"{key}"</span>
            <span className="syntax-punc">{colon}</span>
            {valEl}
          </div>
        );
      }
      return <div key={index} className="syntax-punc">{line}</div>;
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="introduction" className="hero-card">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <span className="hero-badge">REST v1.1.0</span>
          <h1 className="display-lg" style={{ marginBottom: '24px' }}>
            Global & Regional Banks API
          </h1>
          <p className="body-md" style={{ marginBottom: '32px' }}>
            High-performance, zero-dependency REST endpoints for retrieving accurate bank routing codes, logos, slugs, and USSD codes globally. Powered by a high-availability infrastructure.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => router.push('/explorer')}>
              <span className="material-symbols-outlined">rocket_launch</span>
              Start Building
            </button>
            <button className="btn btn-secondary" onClick={() => router.push('/directory')}>
              <span className="material-symbols-outlined">database</span>
              View Directory
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="bento-grid">
        <div className="bento-card bento-card-large" id="getting-started">
          <div>
            <div className="bento-card-icon">
              <span className="material-symbols-outlined">electric_bolt</span>
            </div>
            <h3 className="headline-sm" style={{ marginBottom: '12px' }}>Getting Started</h3>
            <p className="body-sm">
              Our endpoints are built for maximum speed and scale. You can query bank details directly from your web browser, mobile apps, or backend servers. Responses are returned in lightweight JSON format.
            </p>
          </div>
          <div className="bento-card-footer-code">
            // Base API Endpoint URL<br />
            https://banks.cybergenii.com/api/v1
          </div>
        </div>
        <div className="bento-card" id="authentication">
          <div>
            <div className="bento-card-icon" style={{ backgroundColor: 'var(--tertiary-container)', color: 'var(--on-tertiary-container)' }}>
              <span className="material-symbols-outlined">verified_user</span>
            </div>
            <h3 className="headline-sm" style={{ marginBottom: '12px' }}>Zero-Auth</h3>
            <p className="body-sm">
              Frictionless integration. No authentication headers or accounts required for public endpoints.
            </p>
          </div>
          <div className="bento-card-footer-code" style={{ color: 'var(--tertiary)' }}>
            Authorization: None
          </div>
        </div>
      </div>

      {/* API Reference sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* Global Banks */}
        <section className="api-section" id="global-banks">
          <div className="api-section-left">
            <div className="endpoint-url-box">
              <span className="endpoint-badge get">GET</span>
              <span className="endpoint-url">/api/v1/banks</span>
            </div>
            <h2 className="headline-md">Global Banks Index</h2>
            <p className="body-md">
              Fetches all supported financial institutions globally. Responses are paginated and sortable.
            </p>
            
            <div className="parameter-table-container">
              <h4 className="font-code" style={{ fontSize: '12px', color: 'var(--outline)', marginBottom: '8px' }}>QUERY PARAMETERS</h4>
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th>PARAM</th>
                    <th>TYPE</th>
                    <th>DEFAULT</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="param-name">page</td>
                    <td className="param-type">int</td>
                    <td>1</td>
                    <td><span className="param-opt">Optional</span>. Page offset index.</td>
                  </tr>
                  <tr>
                    <td className="param-name">limit</td>
                    <td className="param-type">int</td>
                    <td>50</td>
                    <td><span className="param-opt">Optional</span>. Records per query (max 100).</td>
                  </tr>
                  <tr>
                    <td className="param-name">country</td>
                    <td className="param-type">string</td>
                    <td>-</td>
                    <td><span className="param-opt">Optional</span>. Filter by country name or code (e.g. <code>nigeria</code>).</td>
                  </tr>
                  <tr>
                    <td className="param-name">search</td>
                    <td className="param-type">string</td>
                    <td>-</td>
                    <td><span className="param-opt">Optional</span>. Search term matching bank name, slug, or code.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="api-section-right">
            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">REQUEST EXAMPLE</span>
                <button className="code-panel-copy" onClick={() => copyToClipboard(codeSnippets.getGlobal, 'getGlobal')}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                  {copiedText.getGlobal || 'COPY'}
                </button>
              </div>
              <div className="code-panel-body">{codeSnippets.getGlobal}</div>
            </div>

            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">RESPONSE PAYLOAD</span>
              </div>
              <div className="code-panel-body max-h">
                {renderHighlightedJSON(jsonResponses.getGlobal)}
              </div>
            </div>
          </div>
        </section>

        {/* Country Specific */}
        <section className="api-section" id="country-specific">
          <div className="api-section-left">
            <div className="endpoint-url-box">
              <span className="endpoint-badge get">GET</span>
              <span className="endpoint-url">/api/v1/nig/banks</span>
            </div>
            <h2 className="headline-md">Country Specific (NIG)</h2>
            <p className="body-md">
              Retrieves the full, unpaginated dataset of all financial institutions in Nigeria. Ideal for client-side local caching.
            </p>
            <div className="parameter-table-container">
              <h4 className="font-code" style={{ fontSize: '12px', color: 'var(--outline)', marginBottom: '8px' }}>QUERY PARAMETERS</h4>
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th>PARAM</th>
                    <th>TYPE</th>
                    <th>DEFAULT</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="param-name">code</td>
                    <td className="param-type">string</td>
                    <td>-</td>
                    <td><span className="param-opt">Optional</span>. Filter by exact bank NIP routing code.</td>
                  </tr>
                  <tr>
                    <td className="param-name">slug</td>
                    <td className="param-type">string</td>
                    <td>-</td>
                    <td><span className="param-opt">Optional</span>. Filter by exact bank identifier slug.</td>
                  </tr>
                  <tr>
                    <td className="param-name">search</td>
                    <td className="param-type">string</td>
                    <td>-</td>
                    <td><span className="param-opt">Optional</span>. Perform text searches.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="api-section-right">
            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">REQUEST EXAMPLE</span>
                <button className="code-panel-copy" onClick={() => copyToClipboard(codeSnippets.getCountry, 'getCountry')}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                  {copiedText.getCountry || 'COPY'}
                </button>
              </div>
              <div className="code-panel-body">{codeSnippets.getCountry}</div>
            </div>

            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">RESPONSE PAYLOAD</span>
              </div>
              <div className="code-panel-body max-h">
                {renderHighlightedJSON(jsonResponses.getCountry)}
              </div>
            </div>
          </div>
        </section>

        {/* Single Bank */}
        <section className="api-section" id="get-single">
          <div className="api-section-left">
            <div className="endpoint-url-box">
              <span className="endpoint-badge get">GET</span>
              <span className="endpoint-url">/api/v1/nig/banks/[slug]</span>
            </div>
            <h2 className="headline-md">Single Bank Lookup</h2>
            <p className="body-md">
              Retrieves the complete routing, USSD, and branding metadata for a single bank matching the path slug parameter.
            </p>
            <div className="parameter-table-container">
              <h4 className="font-code" style={{ fontSize: '12px', color: 'var(--outline)', marginBottom: '8px' }}>PATH VARIABLES</h4>
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th>VARIABLE</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="param-name">slug</td>
                    <td className="param-type">string</td>
                    <td><span className="param-req">Required</span></td>
                    <td>The unique bank slug (e.g. <code>access-bank</code>).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="api-section-right">
            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">REQUEST EXAMPLE</span>
                <button className="code-panel-copy" onClick={() => copyToClipboard(codeSnippets.getSingle, 'getSingle')}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                  {copiedText.getSingle || 'COPY'}
                </button>
              </div>
              <div className="code-panel-body">{codeSnippets.getSingle}</div>
            </div>

            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">RESPONSE PAYLOAD</span>
              </div>
              <div className="code-panel-body max-h">
                {renderHighlightedJSON(jsonResponses.getSingle)}
              </div>
            </div>
          </div>
        </section>

        {/* Bank Logo CDN */}
        <section className="api-section" id="logos">
          <div className="api-section-left">
            <div className="endpoint-url-box">
              <span className="endpoint-badge get">GET</span>
              <span className="endpoint-url">/api/v1/nig/banks/[slug]/logo</span>
            </div>
            <h2 className="headline-md">Bank Logo CDN</h2>
            <p className="body-md">
              Serves PNG/SVG branding logos directly with immutable cache-control headers, enabling high-performance rendering in your UI templates.
            </p>
            <div className="parameter-table-container">
              <h4 className="font-code" style={{ fontSize: '12px', color: 'var(--outline)', marginBottom: '8px' }}>PATH VARIABLES</h4>
              <table className="parameter-table">
                <thead>
                  <tr>
                    <th>VARIABLE</th>
                    <th>TYPE</th>
                    <th>STATUS</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="param-name">slug</td>
                    <td className="param-type">string</td>
                    <td><span className="param-req">Required</span></td>
                    <td>Unique slug key for the bank logo.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 className="font-code" style={{ fontSize: '12px', color: 'var(--outline)', marginBottom: '12px' }}>COVERED BRANDING LOGOS</h4>
              <div className="assets-grid">
                <div className="asset-card">
                  <img src="/api/v1/nig/banks/access-bank/logo" className="asset-logo" alt="Access Logo" />
                  <span className="asset-name">Access</span>
                </div>
                <div className="asset-card">
                  <img src="/api/v1/nig/banks/guaranty-trust-bank/logo" className="asset-logo" alt="GTBank Logo" />
                  <span className="asset-name">GTBank</span>
                </div>
                <div className="asset-card">
                  <img src="/api/v1/nig/banks/zenith-bank/logo" className="asset-logo" alt="Zenith Logo" />
                  <span className="asset-name">Zenith</span>
                </div>
                <div className="asset-card">
                  <img src="/api/v1/nig/banks/united-bank-for-africa/logo" className="asset-logo" alt="UBA Logo" />
                  <span className="asset-name">UBA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="api-section-right">
            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">REQUEST EXAMPLE</span>
                <button className="code-panel-copy" onClick={() => copyToClipboard(codeSnippets.getLogo, 'getLogo')}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                  {copiedText.getLogo || 'COPY'}
                </button>
              </div>
              <div className="code-panel-body">{codeSnippets.getLogo}</div>
            </div>

            <div className="code-panel">
              <div className="code-panel-header">
                <span className="code-panel-title">RESPONSE HEADERS</span>
              </div>
              <div className="code-panel-body">
                HTTP/1.1 200 OK<br />
                Content-Type: image/png<br />
                Cache-Control: public, max-age=31536000, immutable<br />
                Access-Control-Allow-Origin: *
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="footer">
        <div>
          <span className="footer-text">© 2026 Banks API. All rights reserved.</span>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Security Center</a>
          <a href="#" className="footer-link">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
