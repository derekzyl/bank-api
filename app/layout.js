import './global.css';

export const metadata = {
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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
