/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tenant resolution via X-Tenant header or subdomain
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // INV-SEO-01: defense-in-depth noindex — covers non-HTML resources
          // (SVGs, JSON) and provides a safety net if layout.tsx metadata is
          // accidentally removed. Remove when ready for production indexing.
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
