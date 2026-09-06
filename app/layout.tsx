import type { Metadata, Viewport } from 'next';
import { Heebo, Frank_Ruhl_Libre, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const ui = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-ui',
});

const display = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-display',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "מדריך תקשורת ורשתות רמה ב' — עיריית רעננה | מפל אחוזה ומעבדות שטח",
  description:
    "פלטפורמת הכשרה וסימולציות שטח מ-0 לתפקיד איש/ת תקשורת ורשתות רמה ב' (משרה 7274) בעיריית רעננה. כולל תרחיש 'מפל אחוזה', 10 מעבדות שטח אינטראקטיביות, מפת ה-NOC ויועץ AI.",
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
  openGraph: {
    title: "מדריך תקשורת ורשתות רמה ב' — עיריית רעננה | מפל אחוזה ומעבדות שטח",
    description:
      "One municipal morning. Every topic on the Level II path is a visible force in the same cascade — Ra'anana Municipality.",
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0e0d0b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0e0d0b" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body
        suppressHydrationWarning
        className={`${ui.variable} ${display.variable} ${mono.variable} min-h-screen bg-[var(--canvas)] font-sans text-[var(--ink)] antialiased selection:bg-[var(--brass)] selection:text-[#1a160f]`}
      >
        <LanguageProvider>{children}</LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('NetMap Pro ServiceWorker active:', reg.scope);
                  }).catch(function(err) {
                    console.warn('NetMap Pro ServiceWorker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
