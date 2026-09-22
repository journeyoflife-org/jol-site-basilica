/** @type {import('next').NextConfig} */

// Indexing policy switch — must mirror src/lib/site-config.ts. Evaluated at
// build time (Next resolves headers() during `next build`). When false, an
// X-Robots-Tag: noindex, nofollow header is added to every response as
// defense-in-depth alongside layout.tsx metadata.robots and app/robots.ts.
const allowIndexing = process.env.ALLOW_INDEXING === 'true';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];

const nextConfig = {
  reactStrictMode: true,
  // Standalone output for Docker deployment (self-hosted)
  output: 'standalone',
  // Tenant resolution via X-Tenant header or subdomain
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: allowIndexing
          ? securityHeaders
          : [
              ...securityHeaders,
              // INV-SEO-01: defense-in-depth noindex — covers non-HTML
              // resources (SVGs, JSON) and provides a safety net if layout.tsx
              // metadata is accidentally removed.
              { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
            ],
      },
    ];
  },
};

module.exports = nextConfig;
