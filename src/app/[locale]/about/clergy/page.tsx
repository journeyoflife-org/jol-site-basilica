/**
 * Clergy & Staff page — /about/clergy
 *
 * Renders clergy roles and contact information from the tenant fixture
 * clergyRoleList block.
 *
 * Spec §4.1: About → Clergy & Staff.
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
    { lt: 'Dvasininkija ir personalas', en: 'Clergy & Staff', ru: 'Духовенство и персонал' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos dvasininkija ir personalas — klebonas, vikaras, darbuotojai',
      en: 'Clergy and staff of Vilnius Cathedral Basilica — parish priest, vicar, employees',
      ru: 'Духовенство и персонал Вильнюсского кафедрального собора — настоятель, викарий, сотрудники',
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

interface ClergyRole {
  role: { lt: string; en?: string; ru?: string };
  description?: { lt: string; en?: string; ru?: string };
  contact?: string;
}

export const dynamic = 'force-static';

export default function ClergyPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  const clergyBlock = blocks.find((b) => b.type === 'clergyRoleList');
  const roles = clergyBlock && Array.isArray(clergyBlock.roles)
    ? (clergyBlock.roles as ClergyRole[])
    : [];

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Apie', en: 'About', ru: 'О нас' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Dvasininkija ir personalas', en: 'Clergy & Staff', ru: 'Духовенство и персонал' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/about/clergy`,
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
          {resolveLocale(
            { lt: 'Dvasininkija ir personalas', en: 'Clergy & Staff', ru: 'Духовенство и персонал' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Vilniaus arkikatedros bazilikos sielovados komanda',
              en: 'Pastoral team of Vilnius Cathedral Basilica',
              ru: 'Пастырская команда Вильнюсского кафедрального собора',
            },
            locale,
          )}
        </p>

        {roles.length > 0 ? (
          <div className="space-y-6">
            {roles.map((role, i) => (
              <article
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar placeholder */}
                  <div
                    className="shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-8 h-8 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {resolveLocale(role.role, locale)}
                    </h2>
                    {role.description && (
                      <p className="mt-1 text-gray-600">
                        {resolveLocale(role.description, locale)}
                      </p>
                    )}
                    {role.contact && (
                      <div className="mt-3">
                        <a
                          href={`mailto:${role.contact}`}
                          className="inline-flex items-center gap-1 text-amber-700 hover:underline text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                          </svg>
                          {role.contact}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            {resolveLocale(
              {
                lt: 'Dvasininkijos informacija bus paskelbta netrukus.',
                en: 'Clergy information will be published soon.',
                ru: 'Информация о духовенстве будет опубликована в ближайшее время.',
              },
              locale,
            )}
          </p>
        )}

        {/* General contact */}
        <div className="mt-10 p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">
            {resolveLocale(
              { lt: 'Bendras kontaktas', en: 'General Contact', ru: 'Общий контакт' },
              locale,
            )}
          </h2>
          <p className="text-gray-600 mb-4">
            {resolveLocale(
              {
                lt: 'Dėl bendrų klausimų kreipkitės į parapijos raštinę',
                en: 'For general inquiries, contact the parish office',
                ru: 'По общим вопросам обращайтесь в приходскую канцелярию',
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
