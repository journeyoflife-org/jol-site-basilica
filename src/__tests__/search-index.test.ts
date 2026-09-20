import { describe, it, expect } from 'vitest';
import { searchIndex } from '@/lib/search-index';

describe('searchIndex', () => {
  it('contains entries for all searchable pages (23 of 24, excludes search itself)', () => {
    expect(searchIndex.length).toBe(23);
  });

  it('has unique URLs across all entries', () => {
    const urls = searchIndex.map((e) => e.url);
    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
  });

  it('all URLs start with / (locale-agnostic paths)', () => {
    for (const entry of searchIndex) {
      expect(entry.url).toMatch(/^\//);
      // Should NOT have locale prefix (search form adds it)
      expect(entry.url).not.toMatch(/^\/(lt|en|ru)\//);
    }
  });

  it('every entry has localized title for all 3 locales', () => {
    for (const entry of searchIndex) {
      expect(entry.title.lt).toBeTruthy();
      expect(entry.title.en).toBeTruthy();
      expect(entry.title.ru).toBeTruthy();
    }
  });

  it('every entry has localized description for all 3 locales', () => {
    for (const entry of searchIndex) {
      expect(entry.description.lt).toBeTruthy();
      expect(entry.description.en).toBeTruthy();
      expect(entry.description.ru).toBeTruthy();
    }
  });

  it('home page entry has url "/"', () => {
    const home = searchIndex.find((e) => e.url === '/');
    expect(home).toBeDefined();
    expect(home!.title.lt).toBe('Pradžia');
    expect(home!.title.en).toBe('Home');
  });

  it('includes key pages: about, worship, visit, contact, faq', () => {
    const urls = searchIndex.map((e) => e.url);
    expect(urls).toContain('/about/history');
    expect(urls).toContain('/worship/mass');
    expect(urls).toContain('/visit/info');
    expect(urls).toContain('/contact');
    expect(urls).toContain('/faq');
  });
});
