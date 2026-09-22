import { describe, it, expect, afterEach, vi } from 'vitest';

/**
 * Indexing-policy tests. These pin the single-switch behaviour that keeps all
 * four protection layers (metadata.robots, X-Robots-Tag, robots.txt, sitemap)
 * consistent, and guard against the canonical/sitemap host drift (gap G3).
 *
 * site-config resolves env at module load, so each case stubs env, resets the
 * module registry, and re-imports to observe both states.
 */

async function loadIndexing() {
  vi.resetModules();
  const [cfg, robotsMod, sitemapMod] = await Promise.all([
    import('@/lib/site-config'),
    import('@/app/robots'),
    import('@/app/sitemap'),
  ]);
  return {
    cfg,
    robots: robotsMod.default(),
    sitemap: sitemapMod.default(),
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('site-config defaults', () => {
  it('ships de-indexed with a non-production site URL when env is unset', async () => {
    vi.stubEnv('ALLOW_INDEXING', '');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    const { cfg } = await loadIndexing();
    expect(cfg.ALLOW_INDEXING).toBe(false);
    expect(cfg.SITE_URL).toBe('http://localhost:3000');
  });

  it('reflects the configured origin and indexing flag when env is set', async () => {
    vi.stubEnv('ALLOW_INDEXING', 'true');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.lt');
    const { cfg } = await loadIndexing();
    expect(cfg.ALLOW_INDEXING).toBe(true);
    expect(cfg.SITE_URL).toBe('https://example.lt');
  });
});

describe('indexing disabled (default / pre-launch)', () => {
  it('disallows all crawlers, omits the sitemap reference, and emits an empty sitemap', async () => {
    vi.stubEnv('ALLOW_INDEXING', '');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.lt');
    const { robots, sitemap } = await loadIndexing();
    expect(robots.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(robots.sitemap).toBeUndefined();
    expect(sitemap).toEqual([]);
  });
});

describe('indexing enabled (post release-approval)', () => {
  it('allows crawlers, references the sitemap, and uses one consistent origin', async () => {
    vi.stubEnv('ALLOW_INDEXING', 'true');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.lt');
    const { robots, sitemap } = await loadIndexing();
    expect(robots.rules).toEqual({ userAgent: '*', allow: '/' });
    expect(robots.sitemap).toBe('https://example.lt/sitemap.xml');
    expect(sitemap.length).toBeGreaterThan(0);
    // G3 guard: every sitemap URL and its alternates share the canonical origin.
    for (const entry of sitemap) {
      expect(entry.url.startsWith('https://example.lt/')).toBe(true);
      const languages = entry.alternates?.languages ?? {};
      for (const href of Object.values(languages)) {
        expect((href as string).startsWith('https://example.lt/')).toBe(true);
      }
    }
  });
});
