import type { MetadataRoute } from 'next';

/**
 * Robots — generates robots.txt.
 *
 * Currently disallows all crawlers (pre-launch noindex policy).
 * When ready for production indexing, change to:
 *   allow: '/'
 *   sitemap: `${BASE_URL}/sitemap.xml`
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://baznycia.lt';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
