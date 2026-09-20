/**
 * Contact page — /contact
 *
 * Renders contact information from the tenant fixture identity and keyValue
 * blocks. Provides phone, email, address, and website links.
 *
 * Spec §4.1: Contact.
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
    { lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos kontaktai — adresas, telefonas, el. paštas',
      en: 'Contact information for Vilnius Cathedral Basilica — address, phone, email',
      ru: 'Контакты Вильнюсского кафедрального собора — адрес, телефон, электронная почта',
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

export default function ContactPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  // Extract contact info from keyValue block
  const kvBlock = blocks.find((b) => b.type === 'keyValue');
  const contactItems = kvBlock && Array.isArray(kvBlock.items)
    ? (kvBlock.items as Array<{ label: { lt: string; en?: string; ru?: string }; value: string }>)
    : [];

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/contact`,
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
          {resolveLocale({ lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Susisiekite su Vilniaus arkikatedros bazilikos parapija',
              en: 'Get in touch with Vilnius Cathedral Basilica parish',
              ru: 'Свяжитесь с приходом Вильнюсского кафедрального собора',
            },
            locale,
          )}
        </p>

        {/* Contact details from fixture */}
        {contactItems.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Kontaktinė informacija', en: 'Contact Information', ru: 'Контактная информация' },
                locale,
              )}
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactItems.map((item, i) => {
                const label = resolveLocale(item.label, locale);
                const value = item.value;
                const isPhone = value.startsWith('+');
                const isEmail = value.includes('@');
                const isUrl = value.startsWith('http');

                return (
                  <div key={i} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <dt className="text-sm text-gray-500 mb-1">{label}</dt>
                    <dd className="font-medium">
                      {isPhone ? (
                        <a href={`tel:${value}`} className="text-amber-700 hover:underline">
                          {value}
                        </a>
                      ) : isEmail ? (
                        <a href={`mailto:${value}`} className="text-amber-700 hover:underline">
                          {value}
                        </a>
                      ) : isUrl ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-700 hover:underline"
                        >
                          {value.replace('https://', '')}
                        </a>
                      ) : (
                        <span className="text-gray-900">{value}</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}

        {/* Quick actions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Greiti veiksmai', en: 'Quick Actions', ru: 'Быстрые действия' },
              locale,
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={`mailto:${fixture.identity?.email}?subject=${encodeURIComponent('Šv. Mišių intencija')}`}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
            >
              <h3 className="font-semibold text-amber-700">
                {resolveLocale(
                  { lt: 'Užsakyti Mišias', en: 'Book Mass Intention', ru: 'Заказать Мессу' },
                  locale,
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {resolveLocale(
                  {
                    lt: 'Už šv. Mišias už gyvuosius ar mirusiuosius',
                    en: 'For Mass for the living or the deceased',
                    ru: 'За Мессу за живых или усопших',
                  },
                  locale,
                )}
              </p>
            </a>
            <a
              href="https://www.bpmuziejus.lt"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-amber-300 transition-colors"
            >
              <h3 className="font-semibold text-amber-700">
                {resolveLocale(
                  { lt: 'Ekskursijos ir požemiai', en: 'Tours and Catacombs', ru: 'Экскурсии и подземелья' },
                  locale,
                )}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {resolveLocale(
                  {
                    lt: 'Bažnytinio paveldo muziejus',
                    en: 'Church Heritage Museum',
                    ru: 'Музей церковного наследия',
                  },
                  locale,
                )}
              </p>
            </a>
          </div>
        </section>

        {/* Map reference */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Kaip mus rasti', en: 'How to Find Us', ru: 'Как нас найти' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-gray-700 mb-4">{fixture.identity?.address}</p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=54.6862,25.2903"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
            >
              {resolveLocale(
                { lt: 'Gauti nurodymus', en: 'Get Directions', ru: 'Получить направление' },
                locale,
              )}
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
