/**
 * Single source of truth for the site origin and the search-indexing policy.
 *
 * Why this exists: canonical URLs, hreflang, the sitemap and robots.txt each
 * used to read the environment independently and with DIFFERENT fallbacks
 * (pages: `http://localhost:3000`; sitemap/robots: `https://baznycia.lt`). With
 * NEXT_PUBLIC_SITE_URL unset, the canonical and the sitemap therefore disagreed
 * about the host. Every indexing-critical module now derives from here so the
 * values cannot drift apart.
 *
 * Both values are resolved at BUILD time: all pages are `force-static`, and
 * Next.js resolves `headers()`, `robots()` and `sitemap()` during `next build`.
 * For the immutable standalone image, set these when building.
 */

/**
 * Canonical site origin (scheme + host, no trailing slash).
 *
 * Production MUST set `NEXT_PUBLIC_SITE_URL` to the approved canonical host.
 * The localhost default is a deliberately non-production fallback so a build
 * without the variable never emits a real domain.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Master switch for search-engine indexing. Defaults to `false` so the site
 * ships de-indexed. Set `ALLOW_INDEXING=true` and rebuild ONLY after explicit
 * release approval.
 *
 * This one flag drives all four protection layers together — `metadata.robots`
 * (layout.tsx), the `X-Robots-Tag` header (next.config.js), robots.txt
 * (app/robots.ts) and the sitemap (app/sitemap.ts) — so they can never disagree.
 */
export const ALLOW_INDEXING: boolean = process.env.ALLOW_INDEXING === 'true';
