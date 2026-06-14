'use client';

import React, { useState, useEffect } from 'react';

export default function Status() {
  const [lastChecked, setLastChecked] = useState<string>('');

  useEffect(() => {
    // Generate actual human date format
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    setLastChecked(new Date().toLocaleDateString('en-US', dateOptions));
  }, []);

  // Mock days array for uptime bar grid (30 days)
  // 0: fully operational (green), 1: partial outage (yellow), 2: major outage (red)
  const documentationUptime = Array.from({ length: 30 }, () => 0);
  
  const gatewayUptime = Array.from({ length: 30 }, (_, i) => {
    if (i === 12) return 1; // 1 day of minor partial outage
    return 0;
  });

  const cdnUptime = Array.from({ length: 30 }, (_, i) => {
    if (i === 6) return 2; // 1 day of major outage
    if (i === 7) return 1; // recovery day
    return 0;
  });

  const getDayColorClass = (status: number) => {
    if (status === 0) return 'uptime-day';
    if (status === 1) return 'uptime-day partial';
    return 'uptime-day down';
  };

  const getDayTooltip = (status: number, dayAgo: number) => {
    const dateStr = `${dayAgo} days ago`;
    if (status === 0) return `${dateStr}: 100% operational`;
    if (status === 1) return `${dateStr}: Partial service disruption (98.4% uptime)`;
    return `${dateStr}: Major service disruption (92.1% uptime)`;
  };

  return (
    <div>
      <h1 className="headline-md" style={{ marginBottom: '8px' }}>Service Status</h1>
      <p className="body-md" style={{ marginBottom: '32px' }}>
        Live service status monitor showing node health, CDN delivery latency, and recent systems logs.
      </p>

      {/* Main Health Banner */}
      <div className="status-banner">
        <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>check_circle</span>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>All Systems Operational</div>
          <div style={{ fontSize: '13px', opacity: 0.8, fontFamily: 'var(--font-mono)' }}>Last check passed: {lastChecked}</div>
        </div>
      </div>

      {/* Health Grids */}
      <h2 className="headline-sm" style={{ marginBottom: '20px' }}>Uptime History (Last 30 Days)</h2>
      <div className="status-grid">
        {/* Gateway Service */}
        <div className="status-card">
          <div className="status-card-header">
            <span className="status-card-title">REST API Gateway</span>
            <span style={{ color: 'var(--tertiary)', fontWeight: '700', fontSize: '14px' }}>99.98% Uptime</span>
          </div>
          <div className="uptime-bar">
            {gatewayUptime.map((status, index) => (
              <div 
                key={index} 
                className={getDayColorClass(status)}
                title={getDayTooltip(status, 30 - index)}
              />
            ))}
          </div>
          <div className="uptime-footer">
            <span>30 days ago</span>
            <span>100.0% operational</span>
            <span>Today</span>
          </div>
        </div>

        {/* CDN Service */}
        <div className="status-card">
          <div className="status-card-header">
            <span className="status-card-title">Bank Logo CDN</span>
            <span style={{ color: 'var(--tertiary)', fontWeight: '700', fontSize: '14px' }}>99.94% Uptime</span>
          </div>
          <div className="uptime-bar">
            {cdnUptime.map((status, index) => (
              <div 
                key={index} 
                className={getDayColorClass(status)}
                title={getDayTooltip(status, 30 - index)}
              />
            ))}
          </div>
          <div className="uptime-footer">
            <span>30 days ago</span>
            <span>99.94% operational</span>
            <span>Today</span>
          </div>
        </div>

        {/* Documentation Portal */}
        <div className="status-card">
          <div className="status-card-header">
            <span className="status-card-title">Developer Reference Portal</span>
            <span style={{ color: 'var(--tertiary)', fontWeight: '700', fontSize: '14px' }}>100.0% Uptime</span>
          </div>
          <div className="uptime-bar">
            {documentationUptime.map((status, index) => (
              <div 
                key={index} 
                className={getDayColorClass(status)}
                title={getDayTooltip(status, 30 - index)}
              />
            ))}
          </div>
          <div className="uptime-footer">
            <span>30 days ago</span>
            <span>100.0% operational</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Latency Section */}
      <div className="bento-grid">
        <div className="bento-card bento-card-large" style={{ padding: '24px', display: 'block' }}>
          <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '16px' }}>Regional Latencies</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--outline-variant)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>public</span>
                <span>Lagos, NG (AF-SOUTH-1)</span>
              </span>
              <span className="font-code" style={{ color: 'var(--tertiary)', fontWeight: '700' }}>14 ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--outline-variant)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>public</span>
                <span>London, UK (EU-WEST-2)</span>
              </span>
              <span className="font-code" style={{ color: 'var(--tertiary)', fontWeight: '700' }}>58 ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--outline-variant)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>public</span>
                <span>Frankfurt, DE (EU-CENTRAL-1)</span>
              </span>
              <span className="font-code" style={{ color: 'var(--tertiary)', fontWeight: '700' }}>65 ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--outline-variant)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>public</span>
                <span>New York, US (US-EAST-1)</span>
              </span>
              <span className="font-code" style={{ color: 'var(--tertiary)', fontWeight: '700' }}>109 ms</span>
            </div>
          </div>
        </div>

        <div className="bento-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Gateway Health</h3>
            <p className="body-sm" style={{ margin: 0 }}>API node response rates across the edge network are operating normally.</p>
          </div>
          <div className="bento-card-footer-code" style={{ color: 'var(--tertiary)' }}>
            SSL Security: ACTIVE<br />
            DNS Resolve: 4ms
          </div>
        </div>
      </div>

      {/* Incident logs */}
      <div className="bento-card" style={{ padding: '24px', display: 'block', marginTop: '32px' }}>
        <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '16px' }}>Incident Logs</h3>
        
        <div className="incident-row">
          <div className="incident-header">
            <span className="incident-title" style={{ color: 'var(--primary)' }}>Resolved: Logo CDN Asset Delivery Disruption</span>
            <span className="incident-date">June 08, 2026</span>
          </div>
          <p className="body-sm" style={{ margin: 0 }}>
            Our content delivery network provider experienced a routing loop affecting static media queries. CDN cache headers were flushed and routes re-established. Total downtime was 28 minutes.
          </p>
        </div>

        <div className="incident-row">
          <div className="incident-header">
            <span className="incident-title" style={{ color: 'var(--outline)' }}>Resolved: Minor API Gateway Latency Spikes</span>
            <span className="incident-date">May 24, 2026</span>
          </div>
          <p className="body-sm" style={{ margin: 0 }}>
            Increased latency was observed across African routing clusters due to upstream fiber outages. Gateway routes automatically rerouted to backup nodes.
          </p>
        </div>
      </div>
    </div>
  );
}
