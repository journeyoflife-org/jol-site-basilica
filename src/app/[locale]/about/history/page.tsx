/**
 * History page — /about/history
 *
 * Renders the basilica's history using the hero block body text from the
 * tenant fixture, supplemented with additional historical context.
 *
 * Spec §4.1: About → History.
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
    { lt: 'Istorija', en: 'History', ru: 'История' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos istorija — nuo 1387 m. iki šių dienų',
      en: 'History of Vilnius Cathedral Basilica — from 1387 to the present day',
      ru: 'История Вильнюсского кафедрального собора — с 1387 года до наших дней',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
  };
}

interface ContentBlock {
  type: string;
  heading?: { lt: string; en?: string; ru?: string };
  [key: string]: unknown;
}

export const dynamic = 'force-static';

export default function HistoryPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  // Extract the hero body text which contains historical description
  const heroBlock = blocks.find((b) => b.type === 'hero');
  const heroBody = heroBlock?.body as { lt: string; en?: string; ru?: string } | undefined;

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Apie', en: 'About', ru: 'О нас' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Istorija', en: 'History', ru: 'История' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/about/history`,
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
          {resolveLocale({ lt: 'Istorija', en: 'History', ru: 'История' }, locale)}
        </h1>

        {/* Established badge */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 rounded">
            {resolveLocale(
              {
                lt: `Įkurta ${fixture.identity?.established ?? '1387'} m.`,
                en: `Established ${fixture.identity?.established ?? '1387'}`,
                ru: `Основана в ${fixture.identity?.established ?? '1387'} г.`,
              },
              locale,
            )}
          </span>
        </div>

        {/* Main historical description from fixture */}
        {heroBody && (
          <section className="mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {resolveLocale(heroBody, locale)}
              </p>
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {resolveLocale(
              { lt: 'Svarbūs data', en: 'Key Dates', ru: 'Важные даты' },
              locale,
            )}
          </h2>
          <div className="space-y-4">
            {[
              {
                year: '1387',
                text: resolveLocale(
                  {
                    lt: 'Pirmoji medinė katedra pastatyta Lietuvos krikšto proga',
                    en: 'First wooden cathedral built for the Baptism of Lithuania',
                    ru: 'Первый деревянный собор построен в связи с Крещением Литвы',
                  },
                  locale,
                ),
              },
              {
                year: '1387–1522',
                text: resolveLocale(
                  {
                    lt: 'Kelios medinės ir gotikinės katedros pastatytos ir sunaikintos',
                    en: 'Several wooden and Gothic cathedrals built and destroyed',
                    ru: 'Несколько деревянных и готических соборов построены и разрушены',
                  },
                  locale,
                ),
              },
              {
                year: '1522',
                text: resolveLocale(
                  {
                    lt: 'Gotikinė katedra su bokštais pastatyta',
                    en: 'Gothic cathedral with towers constructed',
                    ru: 'Построен готический собор с башнями',
                  },
                  locale,
                ),
              },
              {
                year: '1610',
                text: resolveLocale(
                  {
                    lt: 'Po gaisro atstatyta Renesanso stiliumi',
                    en: 'Rebuilt in Renaissance style after a fire',
                    ru: 'Перестроена в стиле Ренессанса после пожара',
                  },
                  locale,
                ),
              },
              {
                year: '1783–1801',
                text: resolveLocale(
                  {
                    lt: 'Architektas Laurynas Stuoka-Gucevičius atstatė katedrą klasicistiniu stiliumi',
                    en: 'Architect Laurynas Stuoka-Gucevičius rebuilt the cathedral in Classicist style',
                    ru: 'Архитектор Лауринас Стуока-Гуцевичюс перестроил собор в стиле классицизма',
                  },
                  locale,
                ),
              },
              {
                year: '1922',
                text: resolveLocale(
                  {
                    lt: 'Popiežius Pijus XI suteikė mažosios bazilikos titulą',
                    en: 'Pope Pius XI granted the title of minor basilica',
                    ru: 'Папа Пий XI присвоил титул малой базилики',
                  },
                  locale,
                ),
              },
              {
                year: '1985',
                text: resolveLocale(
                  {
                    lt: 'Atrasti katedros požemiai su senovinėmis relicvijomis',
                    en: 'Cathedral catacombs discovered with ancient relics',
                    ru: 'Обнаружены подземелья собора с древними реликвиями',
                  },
                  locale,
                ),
              },
              {
                year: '1989',
                text: resolveLocale(
                  {
                    lt: 'Šv. Kazimiero relikvijos grąžintos į katedrą',
                    en: 'Relics of St. Casimir returned to the cathedral',
                    ru: 'Мощи св. Казимира возвращены в собор',
                  },
                  locale,
                ),
              },
            ].map((entry, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-24 text-right font-mono text-amber-700 font-semibold">
                  {entry.year}
                </span>
                <div className="border-l-2 border-amber-200 pl-4 pb-4">
                  <p className="text-gray-700">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">
            {resolveLocale(
              { lt: 'Norite sužinoti daugiau?', en: 'Want to learn more?', ru: 'Хотите узнать больше?' },
              locale,
            )}
          </h2>
          <p className="text-gray-600 mb-4">
            {resolveLocale(
              {
                lt: 'Apsilankykite požemiuose — Bažnytinio paveldo muziejuje',
                en: 'Visit the catacombs — Church Heritage Museum',
                ru: 'Посетите подземелья — Музей церковного наследия',
              },
              locale,
            )}
          </p>
          <a
            href="https://www.bpmuziejus.lt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
          >
            {resolveLocale(
              { lt: 'Bažnytinio paveldo muziejus', en: 'Church Heritage Museum', ru: 'Музей церковного наследия' },
              locale,
            )}
          </a>
        </div>
      </div>
    </>
  );
}
