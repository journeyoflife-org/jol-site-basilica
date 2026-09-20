/**
 * News page — /community/news
 *
 * Placeholder page — no fixture data for news exists yet.
 * Will display news cards when data becomes available.
 *
 * Spec §4.1: Community → News.
 * Spec §6.2: newsList block type.
 * TODO: replace with fixture-driven news listing when data becomes available.
 */

import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale } from '@/lib/resolve-locale';
import { resolvePageLocale } from '@/lib/locale-context';
import { breadcrumbListEntity } from '@journeyoflife-org/seo';
import Breadcrumb from '@/components/breadcrumb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  const locale = resolvePageLocale(params);
  return {
  title: resolveLocale(
    { lt: 'Naujienos', en: 'News', ru: 'Новости' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos naujienos ir skelbimai',
      en: 'News and announcements from Vilnius Cathedral Basilica',
      ru: 'Новости и объявления Вильнюсского кафедрального собора',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
  };
}

export const dynamic = 'force-static';

export default function NewsPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Bendruomenė', en: 'Community', ru: 'Община' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Naujienos', en: 'News', ru: 'Новости' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/community/news`,
    })),
  );

  return (
    <>
      <Breadcrumb locale={locale} items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          {resolveLocale({ lt: 'Naujienos', en: 'News', ru: 'Новости' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Paskutinės katedros bendruomenės naujienos ir skelbimai',
              en: 'Latest news and announcements from the cathedral community',
              ru: 'Последние новости и объявления общины собора',
            },
            locale,
          )}
        </p>

        {/* Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"
            />
          </svg>
          <p className="text-gray-500 italic">
            {resolveLocale(
              {
                lt: 'Naujienų sąrašas bus paskelbtas netrukus',
                en: 'The news listing will be published soon',
                ru: 'Список новостей будет опубликован в ближайшее время',
              },
              locale,
            )}
          </p>
        </div>

        {/* Contact for news tips */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">
            {resolveLocale(
              { lt: 'Turite naujienų?', en: 'Have News?', ru: 'Есть новости?' },
              locale,
            )}
          </h2>
          <p className="text-gray-600 mb-4">
            {resolveLocale(
              {
                lt: 'Jei norite pasidalinti naujienomis ar skelbimu, kreipkitės:',
                en: 'If you would like to share news or an announcement, contact:',
                ru: 'Если вы хотите поделиться новостями или объявлением, свяжитесь:',
              },
              locale,
            )}
          </p>
          <a
            href={`mailto:${fixture.identity?.email}?subject=${encodeURIComponent('Naujiena / News')}`}
            className="inline-block px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
          >
            {fixture.identity?.email}
          </a>
        </div>
      </div>
    </>
  );
}
