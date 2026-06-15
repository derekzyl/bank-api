'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Bank {
  name: string;
  slug: string;
  code: string;
  ussd: string | null;
  country?: string;
}

function DirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(24); // 24 cards per page grid
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Sync search input with URL search param if present on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Fetch banks from the API
  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) {
          queryParams.append('search', search);
        }
        
        const res = await fetch(`/api/v1/banks?${queryParams.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setBanks(result.data || []);
          setTotalPages(result.pages || 1);
          setTotalRecords(result.total || 0);
        }
      } catch (err) {
        console.error('Error fetching banks directory:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add brief debounce for search queries
    const delayDebounce = setTimeout(() => {
      fetchBanks();
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [page, search, limit]);

  // Reset page when search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const copyBankCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const openPlayground = (slug: string) => {
    router.push(`/explorer?slug=${slug}`);
  };

  return (
    <div className="page-shell">
      <h1 className="headline-md" style={{ marginBottom: '8px' }}>Bank Directory</h1>
      <p className="body-md" style={{ marginBottom: '32px' }}>
        Search, explore, and retrieve integration details for financial institutions, microfinance banks, and fintechs covered under our API.
      </p>

      {/* Directory controls */}
      <div className="directory-controls">
        <div className="directory-search">
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--outline)' }}>search</span>
          <input 
            type="text" 
            placeholder="Search bank name, routing code, or USSD code..." 
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="directory-result-count">
          Found {totalRecords} financial institutions
        </div>
      </div>

      {/* Grid of Bank Cards */}
      {loading ? (
        <div className="directory-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bank-card" style={{ opacity: 0.6, pointerEvents: 'none' }}>
              <div className="bank-card-logo" style={{ animation: 'pulse 1.5s infinite', backgroundColor: 'var(--outline-variant)' }}></div>
              <div style={{ width: '60%', height: '14px', backgroundColor: 'var(--outline-variant)', borderRadius: '4px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ width: '40%', height: '12px', backgroundColor: 'var(--outline-variant)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            </div>
          ))}
        </div>
      ) : banks.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '1px dashed var(--outline-variant)', borderRadius: 'var(--radius-xl)', padding: '48px', color: 'var(--outline)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '16px' }}>search_off</span>
          <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>No Banks Found</h3>
          <p className="body-sm" style={{ textAlign: 'center', margin: 0 }}>We couldn't find any bank matching "{search}". Try searching another name or routing code.</p>
        </div>
      ) : (
        <div className="directory-grid">
          {banks.map((bank, index) => {
            const logoUrl = bank.slug ? `/api/v1/nig/banks/${bank.slug}/logo` : '/logo.svg';
            return (
              <div key={index} className="bank-card" onClick={() => setSelectedBank(bank)}>
                <div className="bank-card-logo">
                  <img src={logoUrl} alt={`${bank.name} Logo`} onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }} />
                </div>
                <h3 className="bank-card-title">{bank.name}</h3>
                {bank.code && <span className="bank-card-code">Code: {bank.code}</span>}
                <div className="bank-card-meta">
                  <div className="bank-card-meta-item">
                    <span className="bank-card-meta-label">USSD Code</span>
                    <span className="bank-card-meta-value">{bank.ussd || 'N/A'}</span>
                  </div>
                  <div className="bank-card-meta-item">
                    <span className="bank-card-meta-label">Country</span>
                    <span className="bank-card-meta-value">{bank.country || 'Nigeria'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && !loading && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button 
            className="pagination-btn" 
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      {/* Details View Modal */}
      {selectedBank && (
        <div className="modal-overlay" onClick={() => setSelectedBank(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBank(null)}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="modal-header-row">
              <div 
                className="bank-card-logo" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  padding: '10px', 
                  margin: 0, 
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <img 
                  src={selectedBank.slug ? `/api/v1/nig/banks/${selectedBank.slug}/logo` : '/logo.svg'} 
                  alt={selectedBank.name} 
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
                />
              </div>
              <div>
                <h2 className="headline-sm" style={{ margin: 0 }}>{selectedBank.name}</h2>
                <p className="body-sm" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '4px 0 0 0', wordBreak: 'break-all' }}>
                  {selectedBank.slug}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              <div className="detail-row">
                <span className="font-code" style={{ fontSize: '12px', color: 'var(--outline)' }}>ROUTING CODE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-code" style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{selectedBank.code || 'N/A'}</span>
                  {selectedBank.code && (
                    <button 
                      className="icon-btn" 
                      style={{ width: '24px', height: '24px' }}
                      onClick={() => copyBankCode(selectedBank.code)}
                      title="Copy code"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {copiedCode ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="detail-row">
                <span className="font-code" style={{ fontSize: '12px', color: 'var(--outline)' }}>USSD DIAL CODE</span>
                <span className="font-code" style={{ fontWeight: '700', color: 'var(--on-surface)' }}>{selectedBank.ussd || 'N/A'}</span>
              </div>

              <div className="detail-row">
                <span className="font-code" style={{ fontSize: '12px', color: 'var(--outline)' }}>COUNTRY REGION</span>
                <span style={{ fontWeight: '600', color: 'var(--on-surface-variant)' }}>{selectedBank.country || 'Nigeria'}</span>
              </div>

              <div className="detail-row">
                <span className="font-code" style={{ fontSize: '12px', color: 'var(--outline)' }}>LOGO CDN LINK</span>
                <a 
                  href={`/api/v1/nig/banks/${selectedBank.slug}/logo`} 
                  target="_blank" 
                  className="font-code" 
                  style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'underline' }}
                >
                  View CDN Logo
                </a>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => { setSelectedBank(null); openPlayground(selectedBank.slug); }}
              >
                <span className="material-symbols-outlined">api</span>
                Open in Playground
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedBank(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pulse Animation Definition */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}} />
    </div>
  );
}

export default function Directory() {
  return (
    <Suspense fallback={<div>Loading Bank Directory...</div>}>
      <DirectoryContent />
    </Suspense>
  );
}
