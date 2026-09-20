/**
 * Events page — /community/events
 *
 * Placeholder page — no fixture data for events exists yet.
 * Will display event cards when data becomes available.
 *
 * Spec §4.1: Community → Events.
 * Spec §6.2: eventList block type.
 * TODO: replace with fixture-driven event listing when data becomes available.
 */

import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/resolve-locale';
import { resolvePageLocale } from '@/lib/locale-context';
import { breadcrumbListEntity } from '@journeyoflife-org/seo';
import Breadcrumb from '@/components/breadcrumb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  const locale = resolvePageLocale(params);
  return {
  title: resolveLocale(
    { lt: 'Renginiai', en: 'Events', ru: 'События' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos renginiai — koncertai, šventės, susitikimai',
      en: 'Events at Vilnius Cathedral Basilica — concerts, feasts, meetings',
      ru: 'События в Вильнюсском кафедральном соборе — концерты, праздники, встречи',
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

export default function EventsPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Bendruomenė', en: 'Community', ru: 'Община' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Renginiai', en: 'Events', ru: 'События' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/community/events`,
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
          {resolveLocale({ lt: 'Renginiai', en: 'Events', ru: 'События' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Artimiausi katedros bendruomenės renginiai ir susibūrimai',
              en: 'Upcoming cathedral community events and gatherings',
              ru: 'Ближайшие события и собрания общины собора',
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
            />
          </svg>
          <p className="text-gray-500 italic">
            {resolveLocale(
              {
                lt: 'Renginių sąrašas bus paskelbtas netrukus',
                en: 'The event listing will be published soon',
                ru: 'Список событий будет опубликован в ближайшее время',
              },
              locale,
            )}
          </p>
        </div>

        {/* Recurring events info */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Kasmetiniai renginiai', en: 'Annual Events', ru: 'Ежегодные события' },
              locale,
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: resolveLocale(
                  { lt: 'Vox Organi Cathedralis', en: 'Vox Organi Cathedralis', ru: 'Vox Organi Cathedralis' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Vasaros vargonų muzikos koncertų ciklas',
                    en: 'Summer organ music concert series',
                    ru: 'Летний цикл концертов органной музыки',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Šv. Kazimiero diena', en: 'Feast of St. Casimir', ru: 'День св. Казимира' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Kovo 4 d. — šventojo globėjo šventė',
                    en: 'March 4 — feast of the patron saint',
                    ru: '4 марта — праздник святого покровителя',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Kalėdinės Mišios', en: 'Christmas Masses', ru: 'Рождественские Мессы' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Gruodžio 24–25 d. — šventinis Mišių tvarkaraštis',
                    en: 'December 24–25 — festive Mass schedule',
                    ru: '24–25 декабря — праздничное расписание Месс',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Velykinės Mišios', en: 'Easter Masses', ru: 'Пасхальные Мессы' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Šv. Velykų tridienis — specialus liturginis tvarkaraštis',
                    en: 'Easter Triduum — special liturgical schedule',
                    ru: 'Пасхальное триденствие — особое литургическое расписание',
                  },
                  locale,
                ),
              },
            ].map((event, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
