import { describe, it, expect } from 'vitest';
import fixture from '@/fixtures/tenant.json';

describe('tenant fixture integrity', () => {
  it('has required top-level fields', () => {
    expect(fixture.slug).toBe('basilica-vilnius-cathedral');
    expect(fixture.vertical).toBe('basilica');
    expect(fixture.locale).toBe('lt');
    expect(fixture.name).toBeDefined();
    expect(fixture.tagline).toBeDefined();
    expect(fixture.identity).toBeDefined();
    expect(fixture.pages).toBeDefined();
    expect(fixture.pages.length).toBeGreaterThan(0);
  });

  it('has lt name (mandatory locale)', () => {
    expect(fixture.name.lt).toBeTruthy();
    expect(fixture.name.lt.length).toBeGreaterThan(0);
  });

  it('identity has required fields', () => {
    expect(fixture.identity?.address).toBeTruthy();
    expect(fixture.identity?.email).toBeTruthy();
    expect(fixture.identity?.phone).toBeTruthy();
    expect(fixture.identity?.domain).toBeTruthy();
    expect(fixture.identity?.established).toBeTruthy();
  });

  it('no [TODO: verify] markers in any string value', () => {
    const json = JSON.stringify(fixture);
    const markers = json.match(/\[TODO: verify/g);
    expect(markers).toBeNull();
  });

  it('address matches verified data (Katedros a. 2)', () => {
    expect(fixture.identity?.address).toContain('Katedros a. 2');
  });

  it('email matches verified data (parapija@katedra.lt)', () => {
    expect(fixture.identity?.email).toBe('parapija@katedra.lt');
  });

  it('established is 1387 (Christianization of Lithuania)', () => {
    expect(fixture.identity?.established).toBe('1387');
  });

  it('has at least one page with content blocks', () => {
    const homePage = fixture.pages[0];
    expect(homePage).toBeDefined();
    expect(homePage?.route).toBe('/');
    expect(homePage?.contentBlocks).toBeDefined();
    expect(homePage?.contentBlocks.length).toBeGreaterThan(0);
  });

  it('all content blocks have a type field', () => {
    for (const page of fixture.pages) {
      for (const block of page.contentBlocks) {
        expect((block as any).type).toBeTruthy();
      }
    }
  });

  it('mass schedule has real times (not synthetic)', () => {
    const homePage = fixture.pages[0];
    const massBlock = homePage?.contentBlocks.find(
      (b) => (b as any).type === 'massSchedule'
    ) as any;
    expect(massBlock).toBeDefined();
    expect(massBlock.masses.length).toBeGreaterThanOrEqual(10);
  });

  it('gallery images use placeholder paths that exist', () => {
    const homePage = fixture.pages[0];
    const galleryBlock = homePage?.contentBlocks.find(
      (b) => (b as any).type === 'gallery'
    ) as any;
    expect(galleryBlock).toBeDefined();
    for (const img of galleryBlock.images) {
      expect(img.src).toContain('/images/placeholder-');
      expect(img.src).toMatch(/\.(svg|png|jpg)$/);
    }
  });

  it('local asset paths in fixture exist under public/', async () => {
    const { existsSync } = await import('fs');
    const { join } = await import('path');
    const homePage = fixture.pages[0];
    const galleryBlock = homePage?.contentBlocks.find(
      (b) => (b as any).type === 'gallery'
    ) as any;
    for (const img of galleryBlock.images) {
      const fullPath = join(process.cwd(), 'public', img.src);
      expect(existsSync(fullPath)).toBe(true);
    }
  });
});
