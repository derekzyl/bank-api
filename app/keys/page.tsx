'use client';

import React, { useState } from 'react';

interface ApiKey {
  id: number;
  name: string;
  val: string;
  scope: string;
  created: string;
  active: boolean;
  revealed: boolean;
}

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: 1, name: 'Production Main API Key', val: 'bk_live_8f3a9e22db49210a56e7e8b91a', scope: 'Read Only', created: '2026-05-12', active: true, revealed: false },
    { id: 2, name: 'Staging Environment Key', val: 'bk_live_2a7e55bc11884dd00ea39ff01b', scope: 'Full Access', created: '2026-06-02', active: true, revealed: false }
  ]);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyScope, setNewKeyScope] = useState<string>('Read Only');
  const [chartType, setChartType] = useState<string>('volume'); // volume or latency

  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null);

  const copyKey = (val: string, id: number) => {
    navigator.clipboard.writeText(val);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const deleteKey = (id: number) => {
    if (confirm('Are you sure you want to delete this API Key? Any application using it will lose access immediately.')) {
      setKeys(prev => prev.filter(k => k.id !== id));
    }
  };

  const toggleReveal = (id: number) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, revealed: !k.revealed } : k));
  };

  const toggleStatus = (id: number) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, active: !k.active } : k));
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    // Generate random hexadecimal values
    const randomHex = Array.from({ length: 26 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newKey: ApiKey = {
      id: Date.now(),
      name: newKeyName.trim(),
      val: `bk_live_${randomHex}`,
      scope: newKeyScope,
      created: new Date().toISOString().split('T')[0],
      active: true,
      revealed: false
    };

    setKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    setShowCreateModal(false);
  };

  // Mask function
  const maskKey = (val: string) => {
    return `${val.substring(0, 10)}...${val.substring(val.length - 4)}`;
  };

  return (
    <div>
      <h1 className="headline-md" style={{ marginBottom: '8px' }}>Developer Dashboard</h1>
      <p className="body-md" style={{ marginBottom: '32px' }}>
        Manage your API credentials, view request analytics, monitor rate limits, and track integration metrics.
      </p>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Request Limits (Monthly)</div>
          <div className="metric-value">14,205 <span style={{ fontSize: '14px', color: 'var(--outline)' }}>/ 50,000</span></div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: '28.4%' }}></div>
          </div>
          <div className="body-sm" style={{ marginTop: '8px', fontSize: '12px' }}>28.4% volume consumed. Resets in 16 days.</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Average API Latency</div>
          <div className="metric-value">24 ms</div>
          <div className="metric-sub">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_down</span>
            <span>-2ms improvement (last 7 days)</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Success Rate</div>
          <div className="metric-value">99.98%</div>
          <div className="metric-sub">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>trending_up</span>
            <span>+0.01% increase</span>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bento-card" style={{ padding: '24px', marginBottom: '32px', display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }} className="section-header-row">
          <div>
            <h3 className="headline-sm" style={{ fontSize: '18px' }}>Integration Analytics</h3>
            <p className="body-sm" style={{ margin: 0 }}>API usage stats over the last week.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn btn-sm ${chartType === 'volume' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChartType('volume')}
            >
              Request Volume
            </button>
            <button 
              className={`btn btn-sm ${chartType === 'latency' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setChartType('latency')}
            >
              Latency (ms)
            </button>
          </div>
        </div>

        <div className="chart-container">
          {chartType === 'volume' ? (
            <svg viewBox="0 0 700 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="680" y2="20" stroke="var(--outline-variant)" strokeDasharray="4" />
              <line x1="50" y1="70" x2="680" y2="70" stroke="var(--outline-variant)" strokeDasharray="4" />
              <line x1="50" y1="120" x2="680" y2="120" stroke="var(--outline-variant)" strokeDasharray="4" />
              <line x1="50" y1="170" x2="680" y2="170" stroke="var(--outline-variant)" strokeWidth="1.5" />
              
              {/* Y Axis Labels */}
              <text x="15" y="24" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">3.0k</text>
              <text x="15" y="74" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">2.0k</text>
              <text x="15" y="124" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">1.0k</text>
              <text x="25" y="174" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">0</text>
              
              {/* Graph Line */}
              <path 
                d="M 50 140 L 150 110 L 250 130 L 350 80 L 450 60 L 550 90 L 680 40" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Area under the path */}
              <path 
                d="M 50 170 L 50 140 L 150 110 L 250 130 L 350 80 L 450 60 L 550 90 L 680 40 L 680 170 Z" 
                fill="url(#glowGradient)"
                opacity="0.1"
              />
              
              {/* Data points */}
              <circle cx="50" cy="140" r="5" fill="var(--primary)" />
              <circle cx="150" cy="110" r="5" fill="var(--primary)" />
              <circle cx="250" cy="130" r="5" fill="var(--primary)" />
              <circle cx="350" cy="80" r="5" fill="var(--primary)" />
              <circle cx="450" cy="60" r="5" fill="var(--primary)" />
              <circle cx="550" cy="90" r="5" fill="var(--primary)" />
              <circle cx="680" cy="40" r="5" fill="var(--primary)" />

              {/* Tooltip value */}
              <rect x="420" y="20" width="60" height="25" rx="4" fill="var(--surface-container-highest)" stroke="var(--outline-variant)" />
              <text x="450" y="36" fill="var(--on-surface)" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700">2,410</text>
              
              {/* X Axis Labels */}
              <text x="50" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Mon</text>
              <text x="150" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Tue</text>
              <text x="250" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Wed</text>
              <text x="350" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Thu</text>
              <text x="450" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Fri (Today)</text>
              <text x="550" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Sat</text>
              <text x="680" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Sun</text>

              <defs>
                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg viewBox="0 0 700 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="680" y2="20" stroke="var(--outline-variant)" strokeDasharray="4" />
              <line x1="50" y1="70" x2="680" y2="70" stroke="var(--outline-variant)" strokeDasharray="4" />
              <line x1="50" y1="120" x2="680" y2="120" stroke="var(--outline-variant)" strokeDasharray="4" />
              <line x1="50" y1="170" x2="680" y2="170" stroke="var(--outline-variant)" strokeWidth="1.5" />
              
              {/* Y Axis Labels */}
              <text x="15" y="24" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">75ms</text>
              <text x="15" y="74" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">50ms</text>
              <text x="15" y="124" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">25ms</text>
              <text x="25" y="174" fill="var(--outline)" fontFamily="var(--font-mono)" fontSize="10">0</text>
              
              {/* Graph Line */}
              <path 
                d="M 50 115 L 150 120 L 250 125 L 350 110 L 450 118 L 550 122 L 680 120" 
                fill="none" 
                stroke="var(--tertiary)" 
                strokeWidth="3" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Area under the path */}
              <path 
                d="M 50 170 L 50 115 L 150 120 L 250 125 L 350 110 L 450 118 L 550 122 L 680 120 L 680 170 Z" 
                fill="url(#tertiaryGradient)"
                opacity="0.1"
              />
              
              {/* Data points */}
              <circle cx="50" cy="115" r="5" fill="var(--tertiary)" />
              <circle cx="150" cy="120" r="5" fill="var(--tertiary)" />
              <circle cx="250" cy="125" r="5" fill="var(--tertiary)" />
              <circle cx="350" cy="110" r="5" fill="var(--tertiary)" />
              <circle cx="450" cy="118" r="5" fill="var(--tertiary)" />
              <circle cx="550" cy="122" r="5" fill="var(--tertiary)" />
              <circle cx="680" cy="120" r="5" fill="var(--tertiary)" />

              {/* Tooltip value */}
              <rect x="320" y="65" width="60" height="25" rx="4" fill="var(--surface-container-highest)" stroke="var(--outline-variant)" />
              <text x="350" y="81" fill="var(--on-surface)" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700">22ms</text>
              
              {/* X Axis Labels */}
              <text x="50" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Mon</text>
              <text x="150" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Tue</text>
              <text x="250" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Wed</text>
              <text x="350" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Thu</text>
              <text x="450" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Fri (Today)</text>
              <text x="550" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Sat</text>
              <text x="680" y="192" fill="var(--outline)" fontFamily="var(--font-sans)" fontSize="11" textAnchor="middle">Sun</text>

              <defs>
                <linearGradient id="tertiaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--tertiary)" />
                  <stop offset="100%" stopColor="var(--tertiary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
      </div>

      {/* API Key management */}
      <div className="bento-card" style={{ padding: '24px', display: 'block' }}>
        <div style={{ marginBottom: '24px' }} className="section-header-row">
          <div>
            <h3 className="headline-sm" style={{ fontSize: '18px' }}>API Credentials</h3>
            <p className="body-sm" style={{ margin: 0 }}>Create and manage private API keys for your servers.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
            Generate Key
          </button>
        </div>

        {keys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--outline)' }}>
            No credentials found. Generate a key above to start query integrations.
          </div>
        ) : (
          <div style={{ border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            {keys.map((k) => (
              <div key={k.id} className="key-row">
                <div className="key-info">
                  <div className="key-name">{k.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="key-value">
                      {k.revealed ? k.val : maskKey(k.val)}
                    </span>
                    <button 
                      className="icon-btn" 
                      style={{ width: '24px', height: '24px' }}
                      onClick={() => toggleReveal(k.id)}
                      title={k.revealed ? 'Hide secret key' : 'Show secret key'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {k.revealed ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                    <button 
                      className="icon-btn" 
                      style={{ width: '24px', height: '24px' }}
                      onClick={() => copyKey(k.val, k.id)}
                      title="Copy to clipboard"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {copiedKeyId === k.id ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="nav-version-badge" style={{ textTransform: 'uppercase', fontSize: '9px' }}>
                    {k.scope}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--outline)' }}>
                    Created {k.created}
                  </span>
                  
                  {/* Status Toggle Switch */}
                  <button 
                    className={`btn btn-sm ${k.active ? 'btn-secondary' : 'btn-primary'}`} 
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '11px',
                      backgroundColor: k.active ? 'rgba(78, 222, 163, 0.1)' : 'rgba(255, 180, 171, 0.1)',
                      color: k.active ? 'var(--tertiary)' : 'var(--error)',
                      border: '1px solid currentColor'
                    }}
                    onClick={() => toggleStatus(k.id)}
                  >
                    {k.active ? 'Active' : 'Revoked'}
                  </button>

                  <button 
                    className="icon-btn" 
                    style={{ color: 'var(--error)' }}
                    onClick={() => deleteKey(k.id)}
                    title="Delete Key"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Key Modal Overlay */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <form className="modal-content" onSubmit={handleCreateKey} onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowCreateModal(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>

            <h2 className="headline-sm" style={{ marginBottom: '8px' }}>Generate Secret Key</h2>
            <p className="body-sm" style={{ marginBottom: '24px' }}>Provide a human-readable identifier to distinguish this credential.</p>

            <div className="form-group">
              <label>Key Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Production Mobile App Client" 
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Token Scope</label>
              <select 
                className="form-control"
                value={newKeyScope}
                onChange={(e) => setNewKeyScope(e.target.value)}
              >
                <option value="Read Only">Read Only (Highly Recommended)</option>
                <option value="Full Access">Full Write Access</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Generate Credentials
              </button>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
