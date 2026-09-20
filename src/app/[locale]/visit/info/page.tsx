/**
 * Visitor Information page — /visit/info
 *
 * Renders visiting hours summary and admission info from the tenant fixture
 * visitingInfo block. Provides a high-level overview with links to detailed
 * hours and location pages.
 *
 * Spec §4.1: Visit → Visitor Information.
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
    { lt: 'Lankytojo informacija', en: 'Visitor Information', ru: 'Информация для посетителей' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Informacija lankytojams — darbo laikas, lankymo taisyklės, patarimai',
      en: 'Information for visitors — opening hours, visiting guidelines, tips',
      ru: 'Информация для посетителей — часы работы, правила посещения, советы',
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

export default function VisitorInfoPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  const visitingBlock = blocks.find((b) => b.type === 'visitingInfo');
  const hours = visitingBlock && Array.isArray(visitingBlock.hours)
    ? (visitingBlock.hours as Array<{
        day: string;
        dayEn?: string;
        open: string;
        close: string;
        notes?: { lt: string; en?: string; ru?: string };
      }>)
    : [];
  const admission = visitingBlock?.admission as { lt: string; en?: string; ru?: string } | undefined;

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Lankytojams', en: 'Visit', ru: 'Посетителям' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Lankytojo informacija', en: 'Visitor Information', ru: 'Информация для посетителей' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/visit/info`,
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
            { lt: 'Lankytojo informacija', en: 'Visitor Information', ru: 'Информация для посетителей' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Sveiki atvykę į Vilniaus arkikatedrą baziliką. Čia rasite pagrindinę informaciją lankytojams.',
              en: 'Welcome to Vilnius Cathedral Basilica. Here you will find essential information for visitors.',
              ru: 'Добро пожаловать в Вильнюсский кафедральный собор. Здесь вы найдёте основную информацию для посетителей.',
            },
            locale,
          )}
        </p>

        {/* Opening hours summary */}
        {hours.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Lankymo laikas', en: 'Opening Hours', ru: 'Часы посещения' },
                locale,
              )}
            </h2>
            <div className="space-y-3">
              {hours.map((hour, i) => {
                const dayLabel = locale === 'en' && hour.dayEn ? hour.dayEn : hour.day;
                return (
                  <div
                    key={i}
                    className="flex flex-wrap justify-between items-center gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <span className="font-medium text-gray-900">{dayLabel}</span>
                    <span className="text-amber-700 font-semibold tabular-nums">
                      {hour.open}–{hour.close}
                    </span>
                  </div>
                );
              })}
            </div>
            {hours.some((h) => h.notes) && (
              <div className="mt-3">
                {hours
                  .filter((h) => h.notes)
                  .map((h, i) => (
                    <p key={i} className="text-sm text-gray-500 italic">
                      {resolveLocale(h.notes!, locale)}
                    </p>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Admission */}
        {admission && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Įėjimas', en: 'Admission', ru: 'Вход' },
                locale,
              )}
            </h2>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">{resolveLocale(admission, locale)}</p>
            </div>
          </section>
        )}

        {/* Guidelines */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Lankymo taisyklės', en: 'Guidelines', ru: 'Правила посещения' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Prašome tylėti ir elgtis pagarbiai maldos metu',
                    en: 'Please remain silent and respectful during services',
                    ru: 'Просим соблюдать тишину и уважение во время богослужений',
                  },
                  locale,
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Fotografavimas leidžiamas be blykstės',
                    en: 'Photography allowed without flash',
                    ru: 'Фотосъёмка разрешена без вспышки',
                  },
                  locale,
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Apranga turi būti tinkama bažnyčiai (pečiai ir keliai padengti)',
                    en: 'Dress modestly (shoulders and knees covered)',
                    ru: 'Одежда должна быть подходящей для церкви (плечи и колени покрыты)',
                  },
                  locale,
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Ekskursijos galimos tik su gidu',
                    en: 'Guided tours available by arrangement',
                    ru: 'Экскурсии доступны по договорённости',
                  },
                  locale,
                )}
              </li>
            </ul>
          </div>
        </section>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/visit/hours"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
          >
            <h3 className="font-semibold text-amber-700">
              {resolveLocale({ lt: 'Darbo laikas', en: 'Opening Hours', ru: 'Часы работы' }, locale)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {resolveLocale(
                { lt: 'Detalus darbo laiko tvarkaraštis', en: 'Detailed opening hours schedule', ru: 'Подробный график работы' },
                locale,
              )}
            </p>
          </a>
          <a
            href="/visit/location"
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
          >
            <h3 className="font-semibold text-amber-700">
              {resolveLocale(
                { lt: 'Vieta ir nuorodos', en: 'Location & Directions', ru: 'Местоположение' },
                locale,
              )}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {resolveLocale(
                { lt: 'Kaip mus rasti ir atvykti', en: 'How to find us and get here', ru: 'Как нас найти и добраться' },
                locale,
              )}
            </p>
          </a>
        </div>
      </div>
    </>
  );
}
