/**
 * Locale context — resolves the active locale from page params.
 *
 * Used by all pages under the [locale] dynamic segment to determine
 * which locale to render. Falls back to fixture default if the URL
 * param is missing or invalid.
 */

import type { SupportedLocale } from './resolve-locale';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './resolve-locale';
import fixture from '@/fixtures/tenant.json';

/**
 * Resolve the active locale from page params.
 *
 * @param params - Next.js page params (from [locale] dynamic segment).
 * @returns The validated locale, falling back to fixture default.
 */
export function resolvePageLocale(
  params: Record<string, string>,
): SupportedLocale {
  const fromUrl = params.locale;
  if (fromUrl && SUPPORTED_LOCALES.includes(fromUrl as SupportedLocale)) {
    return fromUrl as SupportedLocale;
  }
  return (fixture.locale as SupportedLocale) ?? DEFAULT_LOCALE;
}
