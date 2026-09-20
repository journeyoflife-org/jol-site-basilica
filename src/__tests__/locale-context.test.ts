import { describe, it, expect } from 'vitest';
import { resolvePageLocale } from '@/lib/locale-context';

describe('resolvePageLocale', () => {
  it('returns the locale from params when valid', () => {
    expect(resolvePageLocale({ locale: 'en' })).toBe('en');
    expect(resolvePageLocale({ locale: 'lt' })).toBe('lt');
    expect(resolvePageLocale({ locale: 'ru' })).toBe('ru');
  });

  it('falls back to fixture default for invalid locale', () => {
    const result = resolvePageLocale({ locale: 'fr' });
    expect(['lt', 'en', 'ru']).toContain(result);
  });

  it('falls back to fixture default when locale param is missing', () => {
    const result = resolvePageLocale({});
    expect(['lt', 'en', 'ru']).toContain(result);
  });

  it('falls back for empty string locale', () => {
    const result = resolvePageLocale({ locale: '' });
    expect(['lt', 'en', 'ru']).toContain(result);
  });
});
