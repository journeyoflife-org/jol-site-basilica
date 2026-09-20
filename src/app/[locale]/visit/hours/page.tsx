/**
 * Opening Hours page — /visit/hours
 *
 * Detailed opening hours display from the tenant fixture visitingInfo block.
 * Separated from /visit/info for users who specifically need schedule data.
 *
 * Spec §4.1: Visit → Opening Hours.
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
    { lt: 'Darbo laikas', en: 'Opening Hours', ru: 'Часы работы' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos darbo laikas — šiokiadieniais ir sekmadieniais',
      en: 'Opening hours of Vilnius Cathedral Basilica — weekdays and Sundays',
      ru: 'Часы работы Вильнюсского кафедрального собора — по будням и воскресеньям',
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

export default function OpeningHoursPage({ params }: { params: Record<string, string> }) {
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

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Lankytojams', en: 'Visit', ru: 'Посетителям' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Darbo laikas', en: 'Opening Hours', ru: 'Часы работы' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/visit/hours`,
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
        <h1 className="text-3xl font-bold mb-8">
          {resolveLocale({ lt: 'Darbo laikas', en: 'Opening Hours', ru: 'Часы работы' }, locale)}
        </h1>

        {hours.length > 0 ? (
          <div className="space-y-4">
            {hours.map((hour, i) => {
              const dayLabel = locale === 'en' && hour.dayEn ? hour.dayEn : hour.day;
              return (
                <div
                  key={i}
                  className="flex flex-wrap justify-between items-center gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{dayLabel}</h2>
                    {hour.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {resolveLocale(hour.notes, locale)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <time dateTime={`${hour.open}:00`} className="text-lg font-semibold text-amber-700 tabular-nums">
                      {hour.open}
                    </time>
                    <span className="text-gray-400">–</span>
                    <time dateTime={`${hour.close}:00`} className="text-lg font-semibold text-amber-700 tabular-nums">
                      {hour.close}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">
            {resolveLocale(
              {
                lt: 'Darbo laikas bus paskelbtas netrukus.',
                en: 'Opening hours will be published soon.',
                ru: 'Часы работы будут опубликованы в ближайшее время.',
              },
              locale,
            )}
          </p>
        )}

        {/* Holy days notice */}
        <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
          <h2 className="font-semibold text-amber-900 mb-2">
            {resolveLocale(
              { lt: 'Šventadieniai', en: 'Holy Days', ru: 'Праздничные дни' },
              locale,
            )}
          </h2>
          <p className="text-sm text-amber-800">
            {resolveLocale(
              {
                lt: 'Švenčių ir šventadienių darbo laikas gali skirtis. Prašome sekti informaciją arba skambinti.',
                en: 'Hours on feasts and holy days may differ. Please check announcements or call ahead.',
                ru: 'В праздничные дни часы работы могут отличаться. Пожалуйста, следите за объявлениями или позвоните.',
              },
              locale,
            )}
          </p>
        </div>

        {/* Contact for questions */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">
            {resolveLocale(
              { lt: 'Klausimai?', en: 'Questions?', ru: 'Вопросы?' },
              locale,
            )}
          </p>
          <a
            href={`tel:${fixture.identity?.phone}`}
            className="inline-block px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
          >
            {fixture.identity?.phone}
          </a>
        </div>
      </div>
    </>
  );
}
