/**
 * Sacraments page — /worship/sacraments
 *
 * Renders all sacrament entries from the tenant fixture sacramentList block.
 * Each sacrament shows name, description, schedule (if any), and requirements
 * (if any). Emits BreadcrumbList structured data.
 *
 * Spec §4.1: Worship → Sacraments (Baptism, Marriage, etc.).
 * Spec §6.2: sacramentList block type.
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
    { lt: 'Sakramentai', en: 'Sacraments', ru: 'Таинства' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Sakramentai Vilniaus arkikatedroje bazilikoje — krikštas, santuoka, išpažintis',
      en: 'Sacraments at Vilnius Cathedral Basilica — baptism, marriage, confession',
      ru: 'Таинства в Вильнюсском кафедральном соборе — крещение, брак, исповедь',
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

export const dynamic = 'force-static';

export default function SacramentsPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;

  const sacramentBlock = (homePage.contentBlocks as Array<{ type: string; [key: string]: unknown }>)
    .find((b) => b.type === 'sacramentList');

  const sacraments = sacramentBlock && Array.isArray(sacramentBlock.sacraments)
    ? (sacramentBlock.sacraments as SacramentEntry[])
    : [];

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Dievgarba', en: 'Worship', ru: 'Богослужение' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Sakramentai', en: 'Sacraments', ru: 'Таинства' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/worship/sacraments`,
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
          {resolveLocale({ lt: 'Sakramentai', en: 'Sacraments', ru: 'Таинства' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Vilniaus arkikatedra bazilika teikia šiuos sakramentus ir tarnystes',
              en: 'Vilnius Cathedral Basilica offers the following sacraments and ministries',
              ru: 'Вильнюсский кафедральный собор совершает следующие таинства и служения',
            },
            locale,
          )}
        </p>

        {sacraments.length > 0 ? (
          <div className="space-y-6">
            {sacraments.map((sac, i) => (
              <article
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
              >
                <h2 className="text-xl font-semibold mb-3">
                  {resolveLocale(sac.name, locale)}
                </h2>

                {sac.description && (
                  <p className="text-gray-700 mb-3">
                    {resolveLocale(sac.description, locale)}
                  </p>
                )}

                {sac.schedule && (
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {resolveLocale(
                        { lt: 'Tvarkaraštis', en: 'Schedule', ru: 'Расписание' },
                        locale,
                      )}
                    </h3>
                    <p className="text-gray-700">
                      {resolveLocale(sac.schedule, locale)}
                    </p>
                  </div>
                )}

                {sac.requirements && (
                  <div className="mt-4 p-4 bg-amber-50 rounded border border-amber-100">
                    <h3 className="text-sm font-medium text-amber-700 uppercase tracking-wide mb-1">
                      {resolveLocale(
                        { lt: 'Reikalavimai', en: 'Requirements', ru: 'Требования' },
                        locale,
                      )}
                    </h3>
                    <p className="text-amber-800">
                      {resolveLocale(sac.requirements, locale)}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            {resolveLocale(
              {
                lt: 'Informacija apie sakramentus bus paskelbta netrukus.',
                en: 'Sacrament information will be published soon.',
                ru: 'Информация о таинствах будет опубликована в ближайшее время.',
              },
              locale,
            )}
          </p>
        )}

        {/* Contact CTA */}
        <div className="mt-10 text-center p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            {resolveLocale(
              { lt: 'Klausimai apie sakramentus?', en: 'Questions about sacraments?', ru: 'Вопросы о таинствах?' },
              locale,
            )}
          </h2>
          <p className="text-gray-600 mb-4">
            {resolveLocale(
              {
                lt: 'Kreipkitės į parapijos raštinę dėl daugiau informacijos',
                en: 'Contact the parish office for more information',
                ru: 'Свяжитесь с приходской канцелярией для получения дополнительной информации',
              },
              locale,
            )}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${fixture.identity?.phone}`}
              className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
            >
              {fixture.identity?.phone}
            </a>
            <a
              href={`mailto:${fixture.identity?.email}`}
              className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
            >
              {fixture.identity?.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
