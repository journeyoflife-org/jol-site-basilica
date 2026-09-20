/**
 * Search page — /search
 *
 * Site-wide search with client-side filtering. Renders a search input that
 * filters across all page titles, descriptions, and keywords in all 3 locales.
 *
 * Spec §4.3: Search — site-wide search (critical for 20+ pages).
 * Spec §7: Search results template — search input + results list.
 * Spec §8.2: SearchBar component.
 */

import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/resolve-locale';
import { resolvePageLocale } from '@/lib/locale-context';
import Breadcrumb from '@/components/breadcrumb';
import SearchForm from '@/components/search-form';
import { searchIndex } from '@/lib/search-index';


export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  const locale = resolvePageLocale(params);
  return {
  title: resolveLocale(
    { lt: 'Paieška', en: 'Search', ru: 'Поиск' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Svetainės paieška — raskite informaciją apie katedrą, mišias, sakramentus',
      en: 'Site search — find information about the cathedral, mass, sacraments',
      ru: 'Поиск по сайту — найдите информацию о соборе, мессе, таинствах',
    },
    locale,
  ),
  robots: { index: false, follow: false },
  };
}

export const dynamic = 'force-static';

export default function SearchPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const breadcrumbItems = [
    {
      label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale),
      href: '/',
    },
    {
      label: resolveLocale({ lt: 'Paieška', en: 'Search', ru: 'Поиск' }, locale),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb locale={locale} items={breadcrumbItems} />

      <h1 className="text-2xl font-bold mb-6">
        {resolveLocale(
          { lt: 'Svetainės paieška', en: 'Site Search', ru: 'Поиск по сайту' },
          locale,
        )}
      </h1>

      <SearchForm entries={searchIndex} locale={locale} />
    </div>
  );
}
