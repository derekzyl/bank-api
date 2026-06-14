import { ReactNode } from 'react';
import './global.css';
import LayoutShell from './LayoutShell';

export const metadata = {
  metadataBase: new URL('https://banks.cybergenii.com'),
  title: 'Banks API | Global Financial Directory Developer Portal',
  description: 'A high-performance, developer-friendly API for global financial institutions, starting with comprehensive coverage of Nigerian banks, microfinance banks, and fintechs.',
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'Banks API | Global Financial Directory Developer Portal',
    description: 'A high-performance, developer-friendly API for global financial institutions, starting with comprehensive coverage of Nigerian banks, microfinance banks, and fintechs.',
    url: 'https://banks.cybergenii.com',
    siteName: 'Banks API',
    images: [
      {
        url: 'https://banks.cybergenii.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Banks API Social Media Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banks API | Global Financial Directory Developer Portal',
    description: 'A high-performance, developer-friendly API for global financial institutions, starting with comprehensive coverage of Nigerian banks, microfinance banks, and fintechs.',
    images: ['https://banks.cybergenii.com/og-image.png'],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flashing */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'system';
                const root = document.documentElement;
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
