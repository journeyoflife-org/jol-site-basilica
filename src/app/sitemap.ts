import type { MetadataRoute } from 'next';
import { SUPPORTED_LOCALES } from '@/lib/resolve-locale';
import { SITE_URL, ALLOW_INDEXING } from '@/lib/site-config';

/**
 * Sitemap — generates sitemap.xml for all localized pages.
 *
 * Covers 24 pages × 3 locales = 72 URLs when indexing is enabled. While the
 * site is de-indexed (ALLOW_INDEXING=false) it emits an empty sitemap so we do
 * not advertise URLs we are simultaneously asking crawlers not to index.
 */

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
  if (!ALLOW_INDEXING) return [];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of PAGE_PATHS) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = path === '/' ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === '/' ? 'daily' : 'weekly',
        priority: path === '/' ? 1.0 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [
              l,
              path === '/' ? `${SITE_URL}/${l}` : `${SITE_URL}/${l}${path}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
