'use client';

import React, { useState } from 'react';

interface EventsState {
  update: boolean;
  logo: boolean;
  outage: boolean;
}

interface WebhookResult {
  ok: boolean;
  status: number;
  latency: string;
}

export default function Settings() {
  const [webhookUrl, setWebhookUrl] = useState<string>('https://api.mycompany.com/webhooks/banks');
  const [events, setEvents] = useState<EventsState>({
    update: true,
    logo: false,
    outage: true
  });
  const [domain, setDomain] = useState<string>('cdn.mycompany.com');
  const [alertThreshold, setAlertThreshold] = useState<number>(80);
  const [alertEmail, setAlertEmail] = useState<string>('dev-alerts@mycompany.com');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [testingWebhook, setTestingWebhook] = useState<boolean>(false);
  const [webhookResult, setWebhookResult] = useState<WebhookResult | null>(null);

  const handleEventChange = (name: keyof EventsState) => {
    setEvents(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setWebhookResult(null);
    setTimeout(() => {
      setTestingWebhook(false);
      setWebhookResult({ ok: true, status: 200, latency: '124ms' });
    }, 1500);
  };

  return (
    <div>
      <h1 className="headline-md" style={{ marginBottom: '8px' }}>Developer Settings</h1>
      <p className="body-md" style={{ marginBottom: '32px' }}>
        Configure webhook endpoints, custom domains, notification alerts, and developer profiles.
      </p>

      {saveSuccess && (
        <div style={{ backgroundColor: 'rgba(78, 222, 163, 0.08)', border: '1px solid rgba(78, 222, 163, 0.2)', color: 'var(--tertiary)', padding: '16px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined">check_circle</span>
          <span>Configuration options saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Webhooks Section */}
        <div className="bento-card" style={{ padding: '24px', display: 'block' }}>
          <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Webhook Subscriptions</h3>
          <p className="body-sm" style={{ marginBottom: '20px' }}>Receive real-time HTTP POST notifications when routing rules or bank lists change.</p>
          
          <div className="form-group">
            <label>Payload Destination URL</label>
            <div className="input-row">
              <input 
                type="url" 
                className="form-control" 
                style={{ flex: 1 }}
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/webhook"
                required
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleTestWebhook}
                disabled={testingWebhook || !webhookUrl}
              >
                {testingWebhook ? 'Testing...' : 'Test Delivery'}
              </button>
            </div>
            {webhookResult && (
              <div style={{ marginTop: '8px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: webhookResult.ok ? 'var(--tertiary)' : 'var(--error)' }}>
                Response Code: {webhookResult.status} OK | Round-trip latency: {webhookResult.latency}
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <label className="font-code" style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              TRIGGER EVENTS
            </label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={events.update} 
                  onChange={() => handleEventChange('update')}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <div>
                  <strong>bank.directory.updated</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--outline)' }}>Triggered when new banks are added or metadata updates.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={events.logo} 
                  onChange={() => handleEventChange('logo')}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <div>
                  <strong>bank.logo.refreshed</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--outline)' }}>Triggered when bank vector branding graphics are updated.</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={events.outage} 
                  onChange={() => handleEventChange('outage')}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                />
                <div>
                  <strong>system.health.incident</strong>
                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--outline)' }}>Triggered immediately if gateway latencies spike or nodes fail.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Custom Domains */}
        <div className="bento-card" style={{ padding: '24px', display: 'block' }}>
          <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Custom CDN Domain</h3>
          <p className="body-sm" style={{ marginBottom: '20px' }}>Map bank logo CDN endpoints directly to your company subdomain.</p>
          
          <div className="form-group">
            <label>CNAME Subdomain</label>
            <input 
              type="text" 
              className="form-control" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="cdn.yourcompany.com"
            />
            <p className="body-sm" style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '8px', marginBottom: 0 }}>
              Point your domain CNAME DNS record to <code>banks.cybergenii.com</code> to activate routing.
            </p>
          </div>
        </div>

        {/* Alert Notifications */}
        <div className="bento-card" style={{ padding: '24px', display: 'block' }}>
          <h3 className="headline-sm" style={{ fontSize: '18px', marginBottom: '8px' }}>Limit Alerts</h3>
          <p className="body-sm" style={{ marginBottom: '20px' }}>Get notified when your application approaches its query threshold limits.</p>
          
          <div className="form-group">
            <label>Usage Threshold Alert (%)</label>
            <input 
              type="number" 
              className="form-control" 
              min="50" 
              max="99"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value, 10) || 80)}
            />
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Alert Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              placeholder="developer@yourcompany.com"
              required
            />
          </div>
        </div>

        {/* Submit button bar */}
        <div>
          <button type="submit" className="btn btn-primary" style={{ minWidth: '180px' }}>
            <span className="material-symbols-outlined">save</span>
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
