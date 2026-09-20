import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/lib/resolve-locale';

/**
 * Sitemap — generates sitemap.xml for all localized pages.
 *
 * Covers 24 pages × 3 locales = 72 URLs.
 * Currently noindex (pre-launch); remove X-Robots-Tag header when ready.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://baznycia.lt';

/** All page paths (locale-agnostic). */
const PAGE_PATHS = [
  '/',
  '/about/history',
  '/about/architecture',
  '/about/clergy',
  '/worship/mass',
  '/worship/confession',
  '/worship/sacraments',
  '/worship/calendar',
  '/community/services',
  '/community/events',
  '/community/news',
  '/visit/info',
  '/visit/hours',
  '/visit/location',
  '/visit/pilgrimage',
  '/contact',
  '/faq',
  '/gallery',
  '/resources',
  '/support',
  '/search',
  '/privacy',
  '/cookies',
  '/accessibility-statement',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PAGE_PATHS) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = path === '/' ? `${BASE_URL}/${locale}` : `${BASE_URL}/${locale}${path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [
              l,
              path === '/' ? `${BASE_URL}/${l}` : `${BASE_URL}/${l}${path}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
