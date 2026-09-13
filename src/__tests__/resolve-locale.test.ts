import { describe, it, expect } from 'vitest';
import {
  resolveLocale,
  buildHreflang,
  buildCanonical,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type LocalizedText,
} from '@/lib/resolve-locale';

describe('resolveLocale', () => {
  const text: LocalizedText = {
    lt: 'Vilniaus arkikatedra',
    en: 'Vilnius Cathedral',
    ru: 'Вильнюсский собор',
  };

  it('returns the lt value for lt locale', () => {
    expect(resolveLocale(text, 'lt')).toBe('Vilniaus arkikatedra');
  });

  it('returns the en value for en locale', () => {
    expect(resolveLocale(text, 'en')).toBe('Vilnius Cathedral');
  });

  it('returns the ru value for ru locale', () => {
    expect(resolveLocale(text, 'ru')).toBe('Вильнюсский собор');
  });

  it('falls back to lt when en is missing', () => {
    const ltOnly: LocalizedText = { lt: 'Tik lietuviškai' };
    expect(resolveLocale(ltOnly, 'en')).toBe('Tik lietuviškai');
  });

  it('falls back to lt when ru is missing', () => {
    const ltOnly: LocalizedText = { lt: 'Tik lietuviškai' };
    expect(resolveLocale(ltOnly, 'ru')).toBe('Tik lietuviškai');
  });

  it('always returns lt for lt locale even if lt is the only key', () => {
    const ltOnly: LocalizedText = { lt: 'Viena reikšmė' };
    expect(resolveLocale(ltOnly, 'lt')).toBe('Viena reikšmė');
  });

  it('adds [LOCALE translation pending] prefix when lt fallback contains [TODO: verify]', () => {
    const withMarker: LocalizedText = {
      lt: '[TODO: verify] Tikrinama',
      en: 'Verified text',
    };
    // en is present, so it returns en directly
    expect(resolveLocale(withMarker, 'en')).toBe('Verified text');
  });

  it('adds translation pending prefix for ru when lt has marker and ru is missing', () => {
    const withMarker: LocalizedText = {
      lt: '[TODO: verify] Tikrinama',
    };
    expect(resolveLocale(withMarker, 'ru')).toBe('[RU translation pending] [TODO: verify] Tikrinama');
  });
});

describe('buildHreflang', () => {
  it('returns entries for all 3 supported locales', () => {
    const result = buildHreflang('https://katedra.lt', '/');
    expect(result).toHaveLength(3);
    expect(result.map(r => r.locale)).toEqual(['lt', 'en', 'ru']);
  });

  it('builds correct URLs for root path', () => {
    const result = buildHreflang('https://katedra.lt', '/');
    expect(result[0]?.url).toBe('/lt');
    expect(result[1]?.url).toBe('/en');
    expect(result[2]?.url).toBe('/ru');
  });

  it('builds correct URLs for non-root path', () => {
    const result = buildHreflang('https://katedra.lt', '/privacy');
    expect(result[0]?.url).toBe('/lt/privacy');
    expect(result[1]?.url).toBe('/en/privacy');
    expect(result[2]?.url).toBe('/ru/privacy');
  });
});

describe('buildCanonical', () => {
  it('builds canonical URL for lt locale and root path', () => {
    expect(buildCanonical('https://katedra.lt', 'lt', '/')).toBe('https://katedra.lt/lt');
  });

  it('builds canonical URL for en locale and non-root path', () => {
    expect(buildCanonical('https://katedra.lt', 'en', '/privacy')).toBe('https://katedra.lt/en/privacy');
  });
});

describe('constants', () => {
  it('SUPPORTED_LOCALES contains lt, en, ru', () => {
    expect(SUPPORTED_LOCALES).toEqual(['lt', 'en', 'ru']);
  });

  it('DEFAULT_LOCALE is lt', () => {
    expect(DEFAULT_LOCALE).toBe('lt');
  });
});
