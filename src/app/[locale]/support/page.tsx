/**
 * Support page — /support
 *
 * Placeholder page for donations and GPM (Lithuanian tax allocation) info.
 * No fixture data for donation widgets exists yet.
 *
 * Spec §4.1: Support → Donations & GPM.
 * Spec §6.2: donationWidget block type.
 * TODO: replace with fixture-driven donation content when available.
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
    { lt: 'Parama', en: 'Support', ru: 'Поддержка' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Paremkite Vilniaus arkikatedrą baziliką — aukos ir GPM skyrimas',
      en: 'Support Vilnius Cathedral Basilica — donations and GPM allocation',
      ru: 'Поддержите Вильнюсский кафедральный собор — пожертвования и направление ГПН',
    },
    locale,
  ),
  robots: {
    index: false,
    follow: false,
  },
  };
}

export default function SupportPage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Parama', en: 'Support', ru: 'Поддержка' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/support`,
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
          {resolveLocale({ lt: 'Parama', en: 'Support', ru: 'Поддержка' }, locale)}
        </h1>
        <p className="text-gray-600 mb-8">
          {resolveLocale(
            {
              lt: 'Jūsų parama padeda išsaugoti Vilniaus arkikatedrą baziliką ir palaikyti parapijos veiklą',
              en: 'Your support helps preserve Vilnius Cathedral Basilica and maintain parish activities',
              ru: 'Ваша поддержка помогает сохранить Вильнюсский кафедральный собор и поддерживать деятельность прихода',
            },
            locale,
          )}
        </p>

        {/* GPM allocation */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'GPM skyrimas', en: 'GPM Allocation', ru: 'Направление ГПН' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              {resolveLocale(
                {
                  lt: 'Kiekvienas Lietuvos gyventojas gali skirti iki 1,2% savo gyventojų pajamų mokesčio (GPM) Vilniaus arkikatedros bazilikos parapijai. Tai nekainuoja nieko papildomai — tiesiog užpildykite formą FR0002.',
                  en: 'Every Lithuanian resident can allocate up to 1.2% of their personal income tax (GPM) to Vilnius Cathedral Basilica parish. It costs nothing extra — simply fill in form FR0002.',
                  ru: 'Каждый житель Литвы может направить до 1,2% своего подоходного налога (ГПН) приходу Вильнюсского кафедрального собора. Это не стоит ничего дополнительно — просто заполните форму FR0002.',
                },
                locale,
              )}
            </p>
            <div className="p-4 bg-amber-50 rounded border border-amber-200">
              <h3 className="font-semibold text-amber-900 mb-2">
                {resolveLocale(
                  { lt: 'Rekvizitės', en: 'Details', ru: 'Реквизиты' },
                  locale,
                )}
              </h3>
              <dl className="space-y-1 text-sm text-amber-800">
                <div className="flex gap-2">
                  <dt className="font-medium">{resolveLocale({ lt: 'Gavėjas', en: 'Recipient', ru: 'Получатель' }, locale)}:</dt>
                  <dd>Vilniaus arkivyskupijos Vilniaus katedros parapija</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-medium">{resolveLocale({ lt: 'Kodas', en: 'Code', ru: 'Код' }, locale)}:</dt>
                  <dd>9055653</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Direct donations */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Tiesioginės aukos', en: 'Direct Donations', ru: 'Прямые пожертвования' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              {resolveLocale(
                {
                  lt: 'Aukas galite paaukoti bankiniu pavedimu arba aukų dėžutėje katedroje',
                  en: 'You can donate by bank transfer or in the collection box at the cathedral',
                  ru: 'Пожертвования можно внести банковским переводом или в ящик для пожертвований в соборе',
                },
                locale,
              )}
            </p>
            <a
              href={`mailto:${fixture.identity?.email}?subject=${encodeURIComponent('Parama / Donation')}`}
              className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
            >
              {resolveLocale(
                { lt: 'Susisiekti dėl aukojimo', en: 'Contact about Donating', ru: 'Связаться по пожертвованию' },
                locale,
              )}
            </a>
          </div>
        </section>

        {/* Thank you */}
        <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
          <p className="text-green-800 font-medium">
            {resolveLocale(
              {
                lt: 'Dėkojame už jūsų dosnumą ir paramą!',
                en: 'Thank you for your generosity and support!',
                ru: 'Благодарим за вашу щедрость и поддержку!',
              },
              locale,
            )}
          </p>
        </div>
      </div>
    </>
  );
}
