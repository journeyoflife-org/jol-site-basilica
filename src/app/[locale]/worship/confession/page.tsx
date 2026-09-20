/**
 * Confession Schedule page — /worship/confession
 *
 * Renders confession schedule extracted from the tenant fixture sacramentList.
 * Emits BreadcrumbList structured data.
 *
 * Spec §4.1: Worship → Confession Schedule.
 * Spec §7: Schedule page template.
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
    { lt: 'Išpažinties tvarkaraštis', en: 'Confession Schedule', ru: 'Расписание исповеди' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Išpažinties tvarkaraštis Vilniaus arkikatedroje bazilikoje',
      en: 'Confession schedule at Vilnius Cathedral Basilica',
      ru: 'Расписание исповеди в Вильнюсском кафедральном соборе',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
  };
}

interface SacramentEntry {
  name: { lt: string; en?: string; ru?: string };
  description?: { lt: string; en?: string; ru?: string };
  schedule?: { lt: string; en?: string; ru?: string };
  requirements?: { lt: string; en?: string; ru?: string };
}

export default function ConfessionPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;

  const sacramentBlock = (homePage.contentBlocks as Array<{ type: string; [key: string]: unknown }>)
    .find((b) => b.type === 'sacramentList');

  // Find the Confession sacrament entry
  const confession = sacramentBlock && Array.isArray(sacramentBlock.sacraments)
    ? (sacramentBlock.sacraments as SacramentEntry[]).find(
        (s) => {
          const nameLt = s.name.lt.toLowerCase();
          return nameLt.includes('išpažintis') || nameLt.includes('confession');
        },
      )
    : undefined;

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Dievgarba', en: 'Worship', ru: 'Богослужение' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Išpažinties tvarkaraštis', en: 'Confession Schedule', ru: 'Расписание исповеди' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/worship/confession`,
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
          {resolveLocale(
            { lt: 'Išpažinties tvarkaraštis', en: 'Confession Schedule', ru: 'Расписание исповеди' },
            locale,
          )}
        </h1>

        {confession?.schedule ? (
          <div className="space-y-6">
            {/* Schedule card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">
                {resolveLocale(
                  { lt: 'Išpažinties laikas', en: 'Confession Time', ru: 'Время исповеди' },
                  locale,
                )}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {resolveLocale(confession.schedule, locale)}
              </p>
            </div>

            {/* Preparation info */}
            <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">
                {resolveLocale(
                  { lt: 'Pasiruošimas išpažinčiai', en: 'Preparing for Confession', ru: 'Подготовка к исповеди' },
                  locale,
                )}
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>
                  {resolveLocale(
                    {
                      lt: 'Patartina peržiūrėti sąžinės egzaminą prieš atvykstant',
                      en: 'It is recommended to review an examination of conscience before coming',
                      ru: 'Рекомендуется пересмотреть экзамен совести перед приходом',
                    },
                    locale,
                  )}
                </li>
                <li>
                  {resolveLocale(
                    {
                      lt: 'Išpažintis galima ir kitu metu — susitarkite su kunigu',
                      en: 'Confession is also available at other times — arrange with the priest',
                      ru: 'Исповедь также доступна в другое время — договоритесь со священником',
                    },
                    locale,
                  )}
                </li>
              </ul>
            </div>

            {/* Contact for appointments */}
            <div className="text-center">
              <p className="text-gray-600 mb-3">
                {resolveLocale(
                  {
                    lt: 'Dėl išpažinties kitu metu kreipkitės:',
                    en: 'For confession at other times, contact:',
                    ru: 'Для исповеди в другое время, свяжитесь:',
                  },
                  locale,
                )}
              </p>
              <a
                href={`tel:${fixture.identity?.phone}`}
                className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
              >
                {fixture.identity?.phone}
              </a>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            {resolveLocale(
              {
                lt: 'Išpažinties tvarkaraštis bus paskelbtas netrukus.',
                en: 'Confession schedule will be published soon.',
                ru: 'Расписание исповеди будет опубликовано в ближайшее время.',
              },
              locale,
            )}
          </p>
        )}
      </div>
    </>
  );
}
