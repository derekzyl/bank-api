'use client';

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface LayoutShellProps {
  children: ReactNode;
}

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [theme, setTheme] = useState<string>('system');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stars, setStars] = useState<number | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch GitHub stars on mount
  useEffect(() => {
    fetch('https://api.github.com/repos/derekzyl/bank-api')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => {
        if (data && typeof data.stargazers_count === 'number') {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        // Sensible fallback value if offline or rate-limited
        setStars(28);
      });
  }, []);

  // Load theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System preference
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    localStorage.setItem('theme', theme);

    // Listen for system changes if system theme is selected
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  // Handle clicking outside theme dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile sidebar on page navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Direct query to Explorer or search on Directory page
      router.push(`/directory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return 'dark_mode';
    if (theme === 'light') return 'light_mode';
    return 'desktop_windows';
  };

  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="layout-root">
      {/* Top Navbar */}
      <header className="top-nav">
        <div className="top-nav-left">
          <button className="icon-btn menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
          
          <div className="top-nav-logo" onClick={() => router.push('/')}>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px', color: 'var(--primary)' }}>
              account_balance
            </span>
            <span>Banks API</span>
          </div>

          <div className="top-nav-search">
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--outline)' }}>search</span>
            <input 
              type="text" 
              placeholder="Search banks (press Enter)..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>

        <nav className="top-nav-center">
          <span className="nav-version-badge">v2.4.0</span>
          <span className={`nav-item ${isLinkActive('/') ? 'active' : ''}`} onClick={() => router.push('/')}>
            Documentation
          </span>
          <span className={`nav-item ${isLinkActive('/explorer') ? 'active' : ''}`} onClick={() => router.push('/explorer')}>
            Playground
          </span>
          <span className={`nav-item ${isLinkActive('/directory') ? 'active' : ''}`} onClick={() => router.push('/directory')}>
            Bank Directory
          </span>
          <span className={`nav-item ${isLinkActive('/status') ? 'active' : ''}`} onClick={() => router.push('/status')}>
            Status
          </span>
        </nav>

        <div className="top-nav-right">
          {/* GitHub Link & Star Count */}
          <a
            href="https://github.com/derekzyl/bank-api"
            target="_blank"
            rel="noopener noreferrer"
            className="github-star-badge"
            title="Star derekzyl/bank-api on GitHub"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ marginRight: '6px' }}>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.867 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Star</span>
            {stars !== null && (
              <span className="github-star-count">{stars}</span>
            )}
          </a>

          {/* Theme Selector Toggle */}
          <div className="theme-selector-container" ref={dropdownRef}>
            <button 
              className="icon-btn" 
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              title="Toggle theme preference"
            >
              <span className="material-symbols-outlined">{getThemeIcon()}</span>
            </button>

            {themeDropdownOpen && (
              <div className="theme-dropdown">
                <button 
                  className={`theme-dropdown-item ${theme === 'light' ? 'active' : ''}`} 
                  onClick={() => { setTheme('light'); setThemeDropdownOpen(false); }}
                >
                  <span className="material-symbols-outlined">light_mode</span>
                  <span>Light</span>
                </button>
                <button 
                  className={`theme-dropdown-item ${theme === 'dark' ? 'active' : ''}`} 
                  onClick={() => { setTheme('dark'); setThemeDropdownOpen(false); }}
                >
                  <span className="material-symbols-outlined">dark_mode</span>
                  <span>Midnight</span>
                </button>
                <button 
                  className={`theme-dropdown-item ${theme === 'system' ? 'active' : ''}`} 
                  onClick={() => { setTheme('system'); setThemeDropdownOpen(false); }}
                >
                  <span className="material-symbols-outlined">desktop_windows</span>
                  <span>System</span>
                </button>
              </div>
            )}
          </div>

          <button className="icon-btn" onClick={() => router.push('/keys')} title="Developer dashboard">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <div className="layout-shell">
        {/* Sidebar Navigation */}
        <aside className={`sidebar-nav ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
          <div className="sidebar-section">
            <div className="sidebar-section-title">CORE REFERENCE</div>
            <div className="sidebar-links">
              <a 
                href={pathname === '/' ? '#introduction' : '/#introduction'} 
                className={`sidebar-link ${pathname === '/' ? 'active' : ''}`}
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span>Overview</span>
              </a>
              <a href={pathname === '/' ? '#getting-started' : '/#getting-started'} className="sidebar-link">
                <span className="material-symbols-outlined">rocket_launch</span>
                <span>Getting Started</span>
              </a>
              <a href={pathname === '/' ? '#authentication' : '/#authentication'} className="sidebar-link">
                <span className="material-symbols-outlined">lock</span>
                <span>Authentication</span>
              </a>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">API ENDPOINTS</div>
            <div className="sidebar-links">
              <a href={pathname === '/' ? '#global-banks' : '/#global-banks'} className="sidebar-link">
                <span className="material-symbols-outlined">account_balance</span>
                <span>Global Index</span>
              </a>
              <a href={pathname === '/' ? '#country-specific' : '/#country-specific'} className="sidebar-link">
                <span className="material-symbols-outlined">receipt_long</span>
                <span>Country List</span>
              </a>
              <a href={pathname === '/' ? '#get-single' : '/#get-single'} className="sidebar-link">
                <span className="material-symbols-outlined">paid</span>
                <span>Single Lookup</span>
              </a>
              <a href={pathname === '/' ? '#logos' : '/#logos'} className="sidebar-link">
                <span className="material-symbols-outlined">photo_library</span>
                <span>Logo CDN</span>
              </a>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">DEVELOPER CONSOLE</div>
            <div className="sidebar-links">
              <button 
                onClick={() => router.push('/explorer')} 
                className={`sidebar-link ${isLinkActive('/explorer') ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">api</span>
                <span>API Playground</span>
              </button>
              
              <button 
                onClick={() => router.push('/directory')} 
                className={`sidebar-link ${isLinkActive('/directory') ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">database</span>
                <span>Bank Directory</span>
              </button>

              <button 
                onClick={() => router.push('/keys')} 
                className={`sidebar-link ${isLinkActive('/keys') ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">vpn_key</span>
                <span>API Keys</span>
              </button>

              <button 
                onClick={() => router.push('/settings')} 
                className={`sidebar-link ${isLinkActive('/settings') ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </button>

              <button 
                onClick={() => router.push('/status')} 
                className={`sidebar-link ${isLinkActive('/status') ? 'active' : ''}`}
                style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">monitoring</span>
                <span>Uptime Status</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar overlay */}
        {mobileOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content Area */}
        <main className="main-canvas">
          {children}
        </main>
      </div>
    </div>
  );
}
