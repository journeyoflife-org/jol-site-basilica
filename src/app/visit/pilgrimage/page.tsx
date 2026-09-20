/**
 * Pilgrimage page — /visit/pilgrimage
 *
 * Placeholder page — no fixture data for pilgrimage information exists yet.
 * Provides general pilgrimage context and links to relevant resources.
 *
 * Spec §4.1: Visit → Pilgrimage.
 * TODO: replace with fixture-driven pilgrimage content when available.
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
    { lt: 'Piligrimystė', en: 'Pilgrimage', ru: 'Паломничество' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Piligrimystė Vilniaus arkikatedroje bazilikoje — dvasiniai maršrutai ir informacija',
      en: 'Pilgrimage at Vilnius Cathedral Basilica — spiritual routes and information',
      ru: 'Паломничество в Вильнюсском кафедральном соборе — духовные маршруты и информация',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export default function PilgrimagePage() {
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Lankytojams', en: 'Visit', ru: 'Посетителям' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Piligrimystė', en: 'Pilgrimage', ru: 'Паломничество' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/visit/pilgrimage`,
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
          {resolveLocale({ lt: 'Piligrimystė', en: 'Pilgrimage', ru: 'Паломничество' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Vilniaus arkikatedra bazilika yra svarbi piligrimystės vieta Lietuvos katalikų tradicijoje',
              en: 'Vilnius Cathedral Basilica is an important pilgrimage site in the Lithuanian Catholic tradition',
              ru: 'Вильнюсский кафедральный собор является важным местом паломничества в литовской католической традиции',
            },
            locale,
          )}
        </p>

        {/* Significance */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Dvasinė reikšmė', en: 'Spiritual Significance', ru: 'Духовное значение' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {resolveLocale(
                {
                  lt: 'Katedra stovi buvusios pagonių šventyklos vietoje ir yra Lietuvos krikšto simbolis. Čia saugomos šv. Kazimiero relikvijos — vienas svarbiausių Lietuvos piligrimystės objektų. Šv. Kazimiero koplyčia traukia maldininkus iš viso pasaulio.',
                  en: 'The cathedral stands on the site of a former pagan sanctuary and is a symbol of the Baptism of Lithuania. The relics of St. Casimir are kept here — one of the most important Lithuanian pilgrimage objects. The Chapel of St. Casimir draws pilgrims from around the world.',
                  ru: 'Собор стоит на месте бывшего языческого святилища и является символом Крещения Литвы. Здесь хранятся мощи св. Казимира — один из важнейших литовских объектов паломничества. Каплица св. Казимира привлекает паломников со всего мира.',
                },
                locale,
              )}
            </p>
          </div>
        </section>

        {/* What to expect */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Ką rasite', en: 'What You Will Find', ru: 'Что вы найдёте' },
              locale,
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-1">
                {resolveLocale(
                  { lt: 'Šv. Kazimiero koplyčia', en: 'Chapel of St. Casimir', ru: 'Каплица св. Казимира' },
                  locale,
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {resolveLocale(
                  {
                    lt: 'Su šventojo relikvijomis ir barokiniais paveikslais',
                    en: 'With the saint\'s relics and Baroque paintings',
                    ru: 'С мощами святого и барочными картинами',
                  },
                  locale,
                )}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-1">
                {resolveLocale(
                  { lt: 'Požemiai', en: 'Catacombs', ru: 'Подземелья' },
                  locale,
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {resolveLocale(
                  {
                    lt: 'Bažnytinio paveldo muziejus su senovinėmis relicvijomis',
                    en: 'Church Heritage Museum with ancient relics',
                    ru: 'Музей церковного наследия с древними реликвиями',
                  },
                  locale,
                )}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-1">
                {resolveLocale(
                  { lt: 'Šv. Mišios', en: 'Mass', ru: 'Месса' },
                  locale,
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {resolveLocale(
                  {
                    lt: 'Kasdien — tvarkaraštis skiltyje „Dievgarba"',
                    en: 'Daily — see schedule in the "Worship" section',
                    ru: 'Ежедневно — расписание в разделе «Богослужение»',
                  },
                  locale,
                )}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-1">
                {resolveLocale(
                  { lt: 'Išpažintis', en: 'Confession', ru: 'Исповедь' },
                  locale,
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {resolveLocale(
                  {
                    lt: 'Kasdien — tvarkaraštis skiltyje „Išpažintis"',
                    en: 'Daily — see schedule in the "Confession" section',
                    ru: 'Ежедневно — расписание в разделе «Исповедь»',
                  },
                  locale,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Practical info */}
        <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
          <h2 className="font-semibold text-amber-900 mb-2">
            {resolveLocale(
              { lt: 'Praktinė informacija', en: 'Practical Information', ru: 'Практическая информация' },
              locale,
            )}
          </h2>
          <p className="text-sm text-amber-800 mb-4">
            {resolveLocale(
              {
                lt: 'Piligrimų grupėms rekomenduojama iš anksto susitarti dėl gido ir apsilankymo laiko',
                en: 'Pilgrim groups are advised to arrange a guide and visit time in advance',
                ru: 'Паломническим группам рекомендуется заранее договориться о гиде и времени посещения',
              },
              locale,
            )}
          </p>
          <a
            href={`mailto:${fixture.identity?.email}?subject=${encodeURIComponent('Piligrimystė / Pilgrimage')}`}
            className="inline-block px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
          >
            {resolveLocale(
              { lt: 'Susisiekti dėl piligrimystės', en: 'Contact about pilgrimage', ru: 'Связаться по паломничеству' },
              locale,
            )}
          </a>
        </div>
      </div>
    </>
  );
}
