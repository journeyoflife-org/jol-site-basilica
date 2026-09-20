/**
 * Location & Directions page — /visit/location
 *
 * Renders map coordinates and directions link from the tenant fixture
 * mapLocation block. Uses self-hosted coordinate display (no third-party
 * map SDK embedded — per architecture decision).
 *
 * Spec §4.1: Visit → Location & Directions.
 */

import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import { breadcrumbListEntity } from '@journeyoflife-org/seo';
import Breadcrumb from '@/components/breadcrumb';
import TrackedLink from '@/components/tracked-link';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const locale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

export const metadata: Metadata = {
  title: resolveLocale(
    { lt: 'Vieta ir nuorodos', en: 'Location & Directions', ru: 'Местоположение и как добраться' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Kaip rasti Vilniaus arkikatedrą baziliką — adresas, koordinatės, kryptys',
      en: 'How to find Vilnius Cathedral Basilica — address, coordinates, directions',
      ru: 'Как найти Вильнюсский кафедральный собор — адрес, координаты, направление',
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

export default function LocationPage() {
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  const mapBlock = blocks.find((b) => b.type === 'mapLocation');
  const lat = mapBlock?.lat as number | undefined;
  const lng = mapBlock?.lng as number | undefined;
  const directionsUrl = mapBlock?.directionsUrl as string | undefined;

  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Lankytojams', en: 'Visit', ru: 'Посетителям' }, locale),
      href: '#',
    },
    {
      label: resolveLocale(
        { lt: 'Vieta ir nuorodos', en: 'Location & Directions', ru: 'Местоположение' },
        locale,
      ),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/visit/location`,
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
            { lt: 'Vieta ir nuorodos', en: 'Location & Directions', ru: 'Местоположение и как добраться' },
            locale,
          )}
        </h1>

        {/* Address */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale({ lt: 'Adresas', en: 'Address', ru: 'Адрес' }, locale)}
          </h2>
          <address className="not-italic p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 text-lg">{fixture.identity?.address}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${fixture.identity?.phone}`}
                className="text-amber-700 hover:underline"
              >
                {fixture.identity?.phone}
              </a>
              <a
                href={`mailto:${fixture.identity?.email}`}
                className="text-amber-700 hover:underline"
              >
                {fixture.identity?.email}
              </a>
            </div>
          </address>
        </section>

        {/* Coordinates */}
        {lat !== undefined && lng !== undefined && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Koordinatės', en: 'Coordinates', ru: 'Координаты' },
                locale,
              )}
            </h2>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">
                    {resolveLocale({ lt: 'Platuma', en: 'Latitude', ru: 'Широта' }, locale)}
                  </span>
                  <p className="text-lg font-mono text-gray-900">{lat}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    {resolveLocale({ lt: 'Ilguma', en: 'Longitude', ru: 'Долгота' }, locale)}
                  </span>
                  <p className="text-lg font-mono text-gray-900">{lng}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                {resolveLocale(
                  {
                    lt: 'GPS koordinatės navigacijai',
                    en: 'GPS coordinates for navigation',
                    ru: 'GPS-координаты для навигации',
                  },
                  locale,
                )}
              </p>
            </div>
          </section>
        )}

        {/* Directions */}
        {directionsUrl && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {resolveLocale(
                { lt: 'Nuorodos', en: 'Directions', ru: 'Как добраться' },
                locale,
              )}
            </h2>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-700 mb-4">
                {resolveLocale(
                  {
                    lt: 'Naudokite žemiau pateiktą nuorodą maršrutui apskaičiuoti',
                    en: 'Use the link below to calculate your route',
                    ru: 'Используйте ссылку ниже для расчёта маршрута',
                  },
                  locale,
                )}
              </p>
              <TrackedLink
                href={directionsUrl}
                className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
                eventPath="/visit/location"
                eventDestination={directionsUrl}
              >
                {resolveLocale(
                  { lt: 'Gauti nurodymus', en: 'Get Directions', ru: 'Получить направление' },
                  locale,
                )}
              </TrackedLink>
            </div>
          </section>
        )}

        {/* Public transport info */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {resolveLocale(
              { lt: 'Viešasis transportas', en: 'Public Transport', ru: 'Общественный транспорт' },
              locale,
            )}
          </h2>
          <div className="p-6 bg-gray-50 rounded-lg">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Autobusai: 10, 11, 33 — stotelė "Katedra"',
                    en: 'Buses: 10, 11, 33 — stop "Katedra"',
                    ru: 'Автобусы: 10, 11, 33 — остановка "Катедрa"',
                  },
                  locale,
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Troleibusai: 1, 3, 7 — stotelė "Katedra"',
                    en: 'Trolleybuses: 1, 3, 7 — stop "Katedra"',
                    ru: 'Троллейбусы: 1, 3, 7 — остановка "Катедрa"',
                  },
                  locale,
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5" aria-hidden="true">•</span>
                {resolveLocale(
                  {
                    lt: 'Pėsčiomis iš Rotušės aikštės: ~5 min',
                    en: 'Walking from Town Hall Square: ~5 min',
                    ru: 'Пешком от площади Ратуши: ~5 мин',
                  },
                  locale,
                )}
              </li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
