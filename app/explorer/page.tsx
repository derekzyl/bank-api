'use client';

import React, { useState, useEffect } from 'react';

interface ParamsState {
  page: number;
  limit: number;
  country: string;
  search: string;
  code: string;
  slug: string;
}

interface StatusState {
  code: number;
  text: string;
}

interface HeaderItem {
  name: string;
  value: string;
}

interface ResponseState {
  type: 'image' | 'json';
  url?: string;
  data?: any;
}

export default function Explorer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('global');
  const [params, setParams] = useState<ParamsState>({
    page: 1,
    limit: 10,
    country: '',
    search: '',
    code: '',
    slug: 'access-bank',
  });
  const [response, setResponse] = useState<ResponseState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusState | null>(null);
  const [headers, setHeaders] = useState<HeaderItem[]>([]);

  // Default parameters for each endpoint
  useEffect(() => {
    if (selectedEndpoint === 'single' || selectedEndpoint === 'logo') {
      setParams(prev => ({ ...prev, slug: prev.slug || 'access-bank' }));
    }
  }, [selectedEndpoint]);

  const handleParamChange = (name: keyof ParamsState, value: any) => {
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const getRequestURL = (): string => {
    if (selectedEndpoint === 'global') {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.country) queryParams.append('country', params.country);
      if (params.search) queryParams.append('search', params.search);
      const queryString = queryParams.toString();
      return `/api/v1/banks${queryString ? '?' + queryString : ''}`;
    } else if (selectedEndpoint === 'country') {
      const queryParams = new URLSearchParams();
      if (params.code) queryParams.append('code', params.code);
      if (params.slug && params.slug !== 'access-bank') queryParams.append('slug', params.slug);
      if (params.search) queryParams.append('search', params.search);
      const queryString = queryParams.toString();
      return `/api/v1/nig/banks${queryString ? '?' + queryString : ''}`;
    } else if (selectedEndpoint === 'single') {
      return `/api/v1/nig/banks/${params.slug || 'access-bank'}`;
    } else if (selectedEndpoint === 'logo') {
      return `/api/v1/nig/banks/${params.slug || 'access-bank'}/logo`;
    }
    return '';
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);
    setResponseTime(null);
    setStatus(null);
    setHeaders([]);
    
    const url = getRequestURL();
    const startTime = performance.now();
    
    try {
      const res = await fetch(url);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatus({ code: res.status, text: res.statusText });
      
      // Extract headers
      const resHeaders: HeaderItem[] = [];
      res.headers.forEach((value, name) => {
        resHeaders.push({ name, value });
      });
      setHeaders(resHeaders);

      if (selectedEndpoint === 'logo') {
        if (res.ok) {
          // It's a binary logo, set response to the URL to render it as image
          setResponse({ type: 'image', url });
        } else {
          const errData = await res.json();
          setResponse({ type: 'json', data: errData });
        }
      } else {
        const data = await res.json();
        setResponse({ type: 'json', data });
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setStatus({ code: 500, text: 'Client Fetch Error' });
      setResponse({ type: 'json', data: { error: 'Failed to fetch', details: err.message } });
    } finally {
      setLoading(false);
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
      <h1 className="headline-md" style={{ marginBottom: '8px' }}>API Playground</h1>
      <p className="body-md" style={{ marginBottom: '32px' }}>
        Interact with the live Banks API endpoints directly from your browser. Configure headers, path bindings, and query parameters to test responses.
      </p>

      <div className="playground-grid">
        {/* Left Column - Parameters Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="bento-card" style={{ padding: '24px', justifyContent: 'flex-start' }}>
            <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '16px' }}>Endpoint Selection</h3>
            
            <div className="form-group">
              <label>Select Route</label>
              <select 
                className="form-control"
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
              >
                <option value="global">GET /api/v1/banks (Global Index)</option>
                <option value="country">GET /api/v1/nig/banks (Country Index)</option>
                <option value="single">GET /api/v1/nig/banks/[slug] (Single Bank)</option>
                <option value="logo">GET /api/v1/nig/banks/[slug]/logo (Logo CDN)</option>
              </select>
            </div>

            <div className="playground-params-box">
              <h4 className="font-code" style={{ fontSize: '11px', color: 'var(--outline)', marginBottom: '16px' }}>PARAMETERS</h4>
              
              {selectedEndpoint === 'global' && (
                <>
                  <div className="form-group">
                    <label>Page</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={params.page}
                      onChange={(e) => handleParamChange('page', parseInt(e.target.value, 10) || 1)}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Limit</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={params.limit}
                      onChange={(e) => handleParamChange('limit', parseInt(e.target.value, 10) || 10)}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country filter</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={params.country}
                      onChange={(e) => handleParamChange('country', e.target.value)}
                      placeholder="e.g. nigeria"
                    />
                  </div>
                  <div className="form-group">
                    <label>Search Query</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={params.search}
                      onChange={(e) => handleParamChange('search', e.target.value)}
                      placeholder="e.g. zenith"
                    />
                  </div>
                </>
              )}

              {selectedEndpoint === 'country' && (
                <>
                  <div className="form-group">
                    <label>Code Filter</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={params.code}
                      onChange={(e) => handleParamChange('code', e.target.value)}
                      placeholder="e.g. 044"
                    />
                  </div>
                  <div className="form-group">
                    <label>Slug Filter</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={params.slug}
                      onChange={(e) => handleParamChange('slug', e.target.value)}
                      placeholder="e.g. access-bank"
                    />
                  </div>
                  <div className="form-group">
                    <label>Search Query</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={params.search}
                      onChange={(e) => handleParamChange('search', e.target.value)}
                      placeholder="e.g. guaranty"
                    />
                  </div>
                </>
              )}

              {(selectedEndpoint === 'single' || selectedEndpoint === 'logo') && (
                <div className="form-group">
                  <label>Slug (Path variable)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={params.slug}
                    onChange={(e) => handleParamChange('slug', e.target.value)}
                    placeholder="e.g. access-bank"
                  />
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '24px' }}
              onClick={executeRequest}
              disabled={loading}
            >
              {loading ? (
                <span>Executing Request...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Response Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="code-panel" style={{ flex: 1, minHeight: '400px' }}>
            <div className="code-panel-header">
              <span className="code-panel-title">REQUEST URL</span>
            </div>
            <div className="code-panel-body" style={{ color: 'var(--primary)', borderBottom: '1px solid var(--outline-variant)' }}>
              GET {typeof window !== 'undefined' ? window.location.origin : ''}{getRequestURL()}
            </div>

            <div className="code-panel-header" style={{ borderTop: 'none' }}>
              <span className="code-panel-title">RESPONSE VIEWER</span>
            </div>
            
            {status && (
              <div className="code-panel-body" style={{ borderBottom: '1px solid var(--outline-variant)', padding: '12px 16px' }}>
                <div className="playground-response-info">
                  <span>STATUS:</span>
                  <span className={`status-badge ${status.code >= 200 && status.code < 300 ? 'status-2xx' : 'status-4xx'}`}>
                    {status.code} {status.text}
                  </span>
                  <span>TIME:</span>
                  <span style={{ color: 'var(--primary)' }}>{responseTime} ms</span>
                </div>
              </div>
            )}

            <div className="code-panel-body max-h" style={{ flex: 1, padding: '24px' }}>
              {!response ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--outline)', minHeight: '200px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '12px' }}>api</span>
                  <p className="body-sm" style={{ textAlign: 'center', margin: 0 }}>Configure parameters and click "Send Request" to perform a live API lookup.</p>
                </div>
              ) : response.type === 'image' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', height: '100%' }}>
                  <img 
                    src={response.url} 
                    alt="Logo Response" 
                    style={{ maxWidth: '120px', maxHeight: '120px', padding: '12px', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-xl)', backgroundColor: '#ffffff', objectFit: 'contain', marginBottom: '16px' }}
                  />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--outline)' }}>
                    Rendered bank logo CDN image payload.
                  </div>
                </div>
              ) : (
                renderHighlightedJSON(response.data)
              )}
            </div>

            {headers.length > 0 && (
              <>
                <div className="code-panel-header" style={{ borderTop: '1px solid var(--outline-variant)' }}>
                  <span className="code-panel-title">RESPONSE HEADERS</span>
                </div>
                <div className="code-panel-body" style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '12px' }}>
                  {headers.map((h, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{h.name}:</span>
                      <span>{h.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
