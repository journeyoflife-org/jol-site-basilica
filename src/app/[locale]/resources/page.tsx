/**
 * Resources page — /resources
 *
 * Placeholder page for downloadable documents and parish resources.
 * No fixture data for documents exists yet.
 *
 * Spec §4.1: Resources → Documents & Downloads.
 * Spec §6.2: documentList block type.
 * TODO: replace with fixture-driven document listing when data becomes available.
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
    { lt: 'Dokumentai ir ištekliai', en: 'Documents & Resources', ru: 'Документы и ресурсы' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Parapijos dokumentai ir ištekliai — statutas, ataskaitos, formos',
      en: 'Parish documents and resources — statutes, reports, forms',
      ru: 'Приходские документы и ресурсы — устав, отчёты, бланки',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
  };
}

export default function ResourcesPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale(
        { lt: 'Dokumentai ir ištekliai', en: 'Documents & Resources', ru: 'Документы и ресурсы' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/resources`,
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
            { lt: 'Dokumentai ir ištekliai', en: 'Documents & Resources', ru: 'Документы и ресурсы' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Parapijos dokumentai, ataskaitos ir naudingi ištekliai',
              en: 'Parish documents, reports, and useful resources',
              ru: 'Приходские документы, отчёты и полезные ресурсы',
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
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p className="text-gray-500 italic">
            {resolveLocale(
              {
                lt: 'Dokumentų sąrašas bus paskelbtas netrukus',
                en: 'The document listing will be published soon',
                ru: 'Список документов будет опубликован в ближайшее время',
              },
              locale,
            )}
          </p>
        </div>

        {/* Contact for documents */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-3">
            {resolveLocale(
              {
                lt: 'Jei ieškote konkretaus dokumento, kreipkitės:',
                en: 'If you are looking for a specific document, contact:',
                ru: 'Если вы ищете конкретный документ, свяжитесь:',
              },
              locale,
            )}
          </p>
          <a
            href={`mailto:${fixture.identity?.email}`}
            className="inline-block px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
          >
            {fixture.identity?.email}
          </a>
        </div>
      </div>
    </>
  );
}
