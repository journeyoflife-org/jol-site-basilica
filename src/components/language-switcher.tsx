/**
 * LanguageSwitcher — lt/en/ru locale toggle for the header.
 *
 * Renders links to the same page in all 3 locales. The current locale
 * is displayed as static text (not a link). Uses the [locale] URL segment
 * to determine the current locale and build alternate links.
 *
 * Spec §8.2: LanguageSwitcher component.
 */

import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from '@/lib/resolve-locale';

interface LanguageSwitcherProps {
  /** Currently active locale. */
  currentLocale: SupportedLocale;
  /** Current page path without locale prefix (e.g. "/about/history"). */
  currentPath: string;
}

/**
 * Build the URL for a given locale, preserving the current page path.
 */
function localeUrl(locale: SupportedLocale, path: string): string {
  const cleanPath = path === '/' ? '' : path;
  return `/${locale}${cleanPath}`;
}

/** Short labels for each locale (displayed in their own language). */
const LOCALE_LABELS: Record<SupportedLocale, string> = {
  lt: 'LT',
  en: 'EN',
  ru: 'RU',
};

export default function LanguageSwitcher({
  currentLocale,
  currentPath,
}: LanguageSwitcherProps) {
  return (
    <nav aria-label="Kalbų perjungimas" className="flex items-center space-x-1">
      {SUPPORTED_LOCALES.map((locale, index) => {
        const isCurrent = locale === currentLocale;
        const href = localeUrl(locale, currentPath);

        return (
          <span key={locale} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-300 mx-0.5" aria-hidden="true">
                |
              </span>
            )}
            {isCurrent ? (
              <span
                aria-current="true"
                className="px-1.5 py-0.5 text-xs font-semibold text-white bg-amber-700 rounded"
              >
                {LOCALE_LABELS[locale]}
              </span>
            ) : (
              <a
                href={href}
                hrefLang={locale}
                className="px-1.5 py-0.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                {LOCALE_LABELS[locale]}
              </a>
            )}
          </span>
        );
      })}
    </nav>
  );
}
