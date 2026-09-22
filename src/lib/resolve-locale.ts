/**
 * Resolve locale for this spoke.
 *
 * Spoke-local locale resolution with [TODO: verify] marker detection.
 * The hub @journeyoflife-org/i18n package does not export resolveLocale,
 * hreflang, or canonical builders, so the spoke must provide its own.
 */

export type SupportedLocale = 'lt' | 'en' | 'ru';

export const SUPPORTED_LOCALES: SupportedLocale[] = ['lt', 'en', 'ru'];
export const DEFAULT_LOCALE: SupportedLocale = 'lt';

export interface LocalizedText {
  lt: string;
  en?: string;
  ru?: string;
}

/**
 * Resolve a localized text object to a plain string for the given locale.
 *
 * Policy: `lt` is mandatory and always present. For `en` and `ru`, if the
 * key is missing, the function returns the `lt` fallback ONLY if the
 * [TODO: verify] marker is NOT present — otherwise it returns a visible
 * placeholder to prevent silent fallback (Phase 3 spec S3.2 Step 4).
 */
export function resolveLocale(text: LocalizedText, locale: SupportedLocale): string {
  const value = text[locale];
  if (value !== undefined) return value;

  if (locale === 'lt') return text.lt;

  const ltFallback = text.lt;
  if (ltFallback.includes('[TODO: verify')) {
    return `[${locale.toUpperCase()} translation pending] ${ltFallback}`;
  }

  return ltFallback;
}

/**
 * Build hreflang alternates for all supported locales.
 */
export function buildHreflang(
  _baseUrl: string,
  path: string,
): Array<{ locale: SupportedLocale; url: string }> {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale,
    url: `/${locale}${path === '/' ? '' : path}`,
  }));
}

/**
 * Build canonical URL for the current locale + path.
 */
export function buildCanonical(baseUrl: string, locale: SupportedLocale, path: string): string {
  return `${baseUrl}/${locale}${path === '/' ? '' : path}`;
}
