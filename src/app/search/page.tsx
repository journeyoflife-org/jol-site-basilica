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
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import Breadcrumb from '@/components/breadcrumb';
import SearchForm from '@/components/search-form';
import { searchIndex } from '@/lib/search-index';

const locale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

export const metadata: Metadata = {
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

export default function SearchPage() {
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
      <Breadcrumb items={breadcrumbItems} />

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
