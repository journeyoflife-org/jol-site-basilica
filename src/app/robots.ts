import type { MetadataRoute } from 'next';
import { SITE_URL, ALLOW_INDEXING } from '@/lib/site-config';

/**
 * Robots — the single source of truth for robots.txt.
 *
 * The static `public/robots.txt` was removed because a file in `/public`
 * shadows this metadata route (verified at runtime), which would have made a
 * go-live edit here silently ineffective.
 *
 * Indexing is governed by ALLOW_INDEXING (see src/lib/site-config.ts): the site
 * ships de-indexed and only advertises a sitemap once indexing is enabled at
 * build time after explicit release approval.
 */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
