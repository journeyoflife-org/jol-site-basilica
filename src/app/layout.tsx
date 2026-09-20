import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type SupportedLocale,
} from '@/lib/resolve-locale';

/**
 * Root layout — consumed by all pages in this vertical.
 *
 * Invariants enforced:
 * - DS-A11Y-01: html lang attribute (dynamic from [locale] segment)
 * - DS-A11Y-07: skip-navigation link
 * - Security headers via next.config.js
 */

export const metadata: Metadata = {
  title: 'Basilica of Vilnius Cathedral | Journey of Life',
  description: 'Basilica of Vilnius Cathedral — Journey of Life Catholic Church platform',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Record<string, string>;
}) {
  const locale: SupportedLocale =
    params.locale && SUPPORTED_LOCALES.includes(params.locale as SupportedLocale)
      ? (params.locale as SupportedLocale)
      : DEFAULT_LOCALE;

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen">
        {/* DS-A11Y-07: Skip navigation link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:p-2"
        >
          Pereiti prie pagrindinio turinio
        </a>
        <Header locale={locale} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
