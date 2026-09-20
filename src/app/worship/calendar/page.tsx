/**
 * Liturgical Calendar page — /worship/calendar
 *
 * Placeholder page — no fixture data for the liturgical calendar exists yet.
 * Displays a descriptive message and links to external resources.
 *
 * Spec §4.1: Worship → Liturgical Calendar.
 * TODO: replace with fixture-driven calendar when data becomes available.
 */

import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import { breadcrumbListEntity } from '@journeyoflife-org/seo';
import Breadcrumb from '@/components/breadcrumb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const locale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

export const metadata: Metadata = {
  title: resolveLocale(
    { lt: 'Liturginis kalendorius', en: 'Liturgical Calendar', ru: 'Литургический календарь' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Liturginis kalendorius — šventės ir ypatingos liturgijos Vilniaus arkikatedroje bazilikoje',
      en: 'Liturgical calendar — feasts and special liturgies at Vilnius Cathedral Basilica',
      ru: 'Литургический календарь — праздники и особые богослужения в Вильнюсском кафедральном соборе',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export default function LiturgicalCalendarPage() {
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Dievgarba', en: 'Worship', ru: 'Богослужение' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Liturginis kalendorius', en: 'Liturgical Calendar', ru: 'Литургический календарь' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/worship/calendar`,
    })),
  );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">
          {resolveLocale(
            { lt: 'Liturginis kalendorius', en: 'Liturgical Calendar', ru: 'Литургический календарь' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Čia bus skelbiamas liturginis kalendorius su šventėmis ir ypatingomis liturgijomis',
              en: 'The liturgical calendar with feasts and special liturgies will be published here',
              ru: 'Здесь будет опубликован литургический календарь с праздниками и особыми богослужениями',
            },
            locale,
          )}
        </p>

        {/* Upcoming highlights placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Artimiausios šventės', en: 'Upcoming Feasts', ru: 'Ближайшие праздники' },
              locale,
            )}
          </h2>
          <p className="text-gray-500 italic">
            {resolveLocale(
              {
                lt: 'Liturginio kalendoriaus duomenys bus pateikti netrukus',
                en: 'Liturgical calendar data will be available soon',
                ru: 'Данные литургического календаря будут доступны в ближайшее время',
              },
              locale,
            )}
          </p>
        </div>

        {/* External resource links */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">
            {resolveLocale(
              { lt: 'Nuorodos', en: 'Resources', ru: 'Ресурсы' },
              locale,
            )}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.lcn.lt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline"
              >
                {resolveLocale(
                  {
                    lt: 'Lietuvos vyskupų konferencija — liturginis kalendorius',
                    en: 'Lithuanian Bishops\' Conference — liturgical calendar',
                    ru: 'Конференция католических епископов Литвы — литургический календарь',
                  },
                  locale,
                )}
              </a>
            </li>
            <li>
              <a
                href="https://www.vaticannews.va/lt.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 hover:underline"
              >
                Vatican News — {resolveLocale({ lt: 'lietuviškai', en: 'in Lithuanian', ru: 'на литовском' }, locale)}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
