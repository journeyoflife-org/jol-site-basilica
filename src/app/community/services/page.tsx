/**
 * Parish Services page — /community/services
 *
 * Renders the list of cathedral services from the tenant fixture `list` block.
 * Includes additional service descriptions and contact information.
 *
 * Spec §4.1: Community → Parish Services.
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
    { lt: 'Parapijos paslaugos', en: 'Parish Services', ru: 'Приходские службы' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Vilniaus arkikatedros bazilikos parapijos paslaugos — koplyčios, muziejus, adoracija, koncertai',
      en: 'Parish services of Vilnius Cathedral Basilica — chapels, museum, adoration, concerts',
      ru: 'Приходские службы Вильнюсского кафедрального собора — каплицы, музей, поклонение, концерты',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
};

interface ContentBlock {
  type: string;
  heading?: { lt: string; en?: string; ru?: string };
  [key: string]: unknown;
}

export default function ParishServicesPage() {
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  // Extract the list block (Cathedral Services)
  const listBlock = blocks.find((b) => b.type === 'list');
  const services = listBlock && Array.isArray(listBlock.items)
    ? (listBlock.items as Array<{ title: { lt: string; en?: string; ru?: string } }>)
    : [];

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Bendruomenė', en: 'Community', ru: 'Община' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Parapijos paslaugos', en: 'Parish Services', ru: 'Приходские службы' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/community/services`,
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
            { lt: 'Parapijos paslaugos', en: 'Parish Services', ru: 'Приходские службы' },
            locale,
          )}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Vilniaus arkikatedra bazilika siūlo įvairias dvasines ir kultūrines paslaugas parapijiečiams ir lankytojams',
              en: 'Vilnius Cathedral Basilica offers various spiritual and cultural services for parishioners and visitors',
              ru: 'Вильнюсский кафедральный собор предлагает различные духовные и культурные службы для прихожан и посетителей',
            },
            locale,
          )}
        </p>

        {/* Services from fixture */}
        {services.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Katedros tarnystės', en: 'Cathedral Services', ru: 'Службы собора' },
                locale,
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-amber-700 mt-1" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </span>
                    <p className="text-gray-700">{resolveLocale(service.title, locale)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Additional services */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Sielovadinė pagalba', en: 'Pastoral Care', ru: 'Пастырская помощь' },
              locale,
            )}
          </h2>
          <div className="space-y-4">
            {[
              {
                title: resolveLocale(
                  { lt: 'Dvasinis vadovavimas', en: 'Spiritual Direction', ru: 'Духовное руководство' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Individualūs susitikimai su dvasiniu vadovu — reikia išankstinio susitarimo',
                    en: 'Individual meetings with a spiritual director — advance arrangement required',
                    ru: 'Индивидуальные встречи с духовным наставником — требуется предварительная договорённость',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Ligonų lankymas', en: 'Visiting the Sick', ru: 'Посещение больных' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Kunigas lanko ligonius namuose ir ligoninėse — kreipkitės į parapijos raštinę',
                    en: 'The priest visits the sick at home and in hospitals — contact the parish office',
                    ru: 'Священник посещает больных на дому и в больницах — обратитесь в приходскую канцелярию',
                  },
                  locale,
                ),
              },
              {
                title: resolveLocale(
                  { lt: 'Intencijos už mirusiuosius', en: 'Intentions for the Deceased', ru: 'Намерения за усопших' },
                  locale,
                ),
                desc: resolveLocale(
                  {
                    lt: 'Šv. Mišių intencijos už mirusiuosius — užsakymai priimami raštinėje',
                    en: 'Mass intentions for the deceased — bookings accepted at the office',
                    ru: 'Намерения Мессы за усопших — заявки принимаются в канцелярии',
                  },
                  locale,
                ),
              },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2">
            {resolveLocale(
              { lt: 'Reikia pagalbos?', en: 'Need Assistance?', ru: 'Нужна помощь?' },
              locale,
            )}
          </h2>
          <p className="text-gray-600 mb-4">
            {resolveLocale(
              {
                lt: 'Kreipkitės į parapijos raštinę — mielai padėsime',
                en: 'Contact the parish office — we will be happy to help',
                ru: 'Обратитесь в приходскую канцелярию — мы будем рады помочь',
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
