/**
 * SearchForm — client component for site-wide search.
 *
 * Performs client-side filtering of the search index using simple substring
 * matching across title, description, and keywords fields. Supports multiple
 * space-separated search terms (AND logic).
 *
 * Spec §7: Search results template — search input + results list.
 * Spec §8.2: SearchBar component.
 */

'use client';

import { useState, useMemo, useId } from 'react';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import type { SearchEntry } from '@/lib/search-index';

interface SearchFormProps {
  /** Full search index (passed from server component). */
  entries: SearchEntry[];
  /** Current locale for rendering. */
  locale: SupportedLocale;
}

/**
 * Normalize text for comparison: lowercase, collapse whitespace.
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Check if all query terms match at least one field in the entry.
 */
function matchesEntry(entry: SearchEntry, terms: string[]): boolean {
  if (terms.length === 0) return true;

  const fields = [
    resolveLocale(entry.title, 'lt'),
    resolveLocale(entry.description, 'lt'),
    entry.keywords ? resolveLocale(entry.keywords, 'lt') : '',
    // Also search across en/ru text
    entry.title.en ?? '',
    entry.title.ru ?? '',
    entry.description.en ?? '',
    entry.description.ru ?? '',
    entry.keywords?.en ?? '',
    entry.keywords?.ru ?? '',
  ].map(normalize);

  return terms.every((term) => fields.some((field) => field.includes(term)));
}

export default function SearchForm({ entries, locale }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const inputId = useId();

  const terms = useMemo(
    () => normalize(query).split(' ').filter(Boolean),
    [query],
  );

  const results = useMemo(
    () => entries.filter((entry) => matchesEntry(entry, terms)),
    [entries, terms],
  );

  const hasQuery = terms.length > 0;

  /** Prefix a path with the current locale for locale-aware routing. */
  function localeUrl(path: string): string {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  }

  return (
    <div>
      {/* Search input */}
      <div className="mb-8">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {resolveLocale(
            { lt: 'Paieška', en: 'Search', ru: 'Поиск' },
            locale,
          )}
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={resolveLocale(
            {
              lt: 'Įveskite paieškos žodį...',
              en: 'Enter search term...',
              ru: 'Введите поисковый запрос...',
            },
            locale,
          )}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-amber-600 focus:border-amber-600"
          autoFocus
        />
      </div>

      {/* Results summary */}
      {hasQuery && (
        <p className="text-sm text-gray-600 mb-4" aria-live="polite">
          {resolveLocale(
            {
              lt: `Rasta ${results.length} ${results.length === 1 ? 'rezultatas' : results.length < 10 ? 'rezultatai' : 'rezultatų'}`,
              en: `Found ${results.length} ${results.length === 1 ? 'result' : 'results'}`,
              ru: `Найдено ${results.length} ${results.length === 1 ? 'результат' : results.length < 10 ? 'результата' : 'результатов'}`,
            },
            locale,
          )}
        </p>
      )}

      {/* Results list */}
      {hasQuery && results.length > 0 && (
        <ul className="space-y-4" role="list">
          {results.map((entry) => (
            <li key={entry.url} className="border-b border-gray-100 pb-4">
              <a
                href={localeUrl(entry.url)}
                className="text-lg font-semibold text-amber-700 hover:text-amber-800 hover:underline"
              >
                {resolveLocale(entry.title, locale)}
              </a>
              <p className="text-sm text-gray-600 mt-1">
                {resolveLocale(entry.description, locale)}
              </p>
              <p className="text-xs text-gray-400 mt-1 font-mono">{entry.url}</p>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {hasQuery && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {resolveLocale(
              {
                lt: 'Nieko nerasta. Pabandykite kitus paieškos žodžius.',
                en: 'No results found. Try different search terms.',
                ru: 'Ничего не найдено. Попробуйте другие поисковые запросы.',
              },
              locale,
            )}
          </p>
        </div>
      )}

      {/* Browse all pages (shown when no query) */}
      {!hasQuery && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {resolveLocale(
              { lt: 'Visi puslapiai', en: 'All pages', ru: 'Все страницы' },
              locale,
            )}
          </h2>
          <ul className="space-y-3" role="list">
            {entries.map((entry) => (
              <li key={entry.url}>
                <a
                  href={localeUrl(entry.url)}
                  className="text-amber-700 hover:text-amber-800 hover:underline font-medium"
                >
                  {resolveLocale(entry.title, locale)}
                </a>
                <span className="text-gray-400 mx-2">—</span>
                <span className="text-sm text-gray-600">
                  {resolveLocale(entry.description, locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
