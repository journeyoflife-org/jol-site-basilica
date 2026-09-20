/**
 * Mass Schedule page — /worship/mass
 *
 * Renders the full mass schedule from the tenant fixture using the shared
 * ScheduleTable component. Emits Event JSON-LD for each scheduled mass
 * and BreadcrumbList structured data.
 *
 * Spec §4.1: Worship → Mass Schedule.
 * Spec §7: Schedule page template.
 */

import type { Metadata } from 'next';
import fixture from '@/fixtures/tenant.json';
import { resolveLocale } from '@/lib/resolve-locale';
import { resolvePageLocale } from '@/lib/locale-context';
import { massEventEntity, breadcrumbListEntity } from '@journeyoflife-org/seo';
import ScheduleTable from '@/components/schedule-table';
import Breadcrumb from '@/components/breadcrumb';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function generateMetadata({ params }: { params: Record<string, string> }): Metadata {
  const locale = resolvePageLocale(params);
  return {
  title: resolveLocale(
    { lt: 'Šv. Mišių tvarkaraštis', en: 'Mass Schedule', ru: 'Расписание Месс' },
    locale,
  ),
  description: resolveLocale(
    {
      lt: 'Šv. Mišių tvarkaraštis Vilniaus arkikatedroje bazilikoje — sekmadieniais ir šiokiadieniais',
      en: 'Mass schedule at Vilnius Cathedral Basilica — Sundays and weekdays',
      ru: 'Расписание Месс в Вильнюсском кафедральном соборе — по воскресеньям и будням',
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

/**
 * Parse a free-form address string into structured PostalAddress fields.
 */
function parseAddress(full: string): {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
} {
  const parts = full.split(',').map((s) => s.trim());
  const postalMatch = (parts[1] ?? '').match(/^(\d{5})\s+(.+)$/);
  return {
    streetAddress: parts[0] ?? '',
    postalCode: postalMatch?.[1] ?? '',
    addressLocality: postalMatch?.[2] ?? '',
    addressCountry: parts[2] === 'Lithuania' ? 'LT' : (parts[2] ?? ''),
  };
}

export default function MassSchedulePage({ params }: { params: Record<string, string> }) {
  const locale = resolvePageLocale(params);
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  const massBlock = blocks.find((b) => b.type === 'massSchedule');
  if (!massBlock || !Array.isArray(massBlock.masses)) return null;

  const masses = massBlock.masses as Array<{
    day: string;
    dayEn?: string;
    time: string;
    startDate: string;
    language?: string;
    notes?: { lt: string; en?: string; ru?: string };
  }>;

  const address = parseAddress(fixture.identity?.address ?? '');
  const locationName = resolveLocale(fixture.name, locale);

  // Event JSON-LD for each mass
  const massEvents = masses.map((m) =>
    massEventEntity({
      name: `Šv. Mišios — ${m.dayEn ?? m.day} ${m.time}`,
      startDate: m.startDate,
      location: { name: locationName, address },
    }),
  );

  // Breadcrumb
  const breadcrumbItems = [
    { label: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), href: '/' },
    {
      label: resolveLocale({ lt: 'Dievgarba', en: 'Worship', ru: 'Богослужение' }, locale),
      href: '#',
    },
    {
      label: resolveLocale({ lt: 'Šv. Mišių tvarkaraštis', en: 'Mass Schedule', ru: 'Расписание Месс' }, locale),
    },
  ];

  const breadcrumbJsonLd = breadcrumbListEntity(
    breadcrumbItems.map((item) => ({
      name: item.label,
      url: item.href ? `${BASE_URL}${item.href}` : `${BASE_URL}/worship/mass`,
    })),
  );

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {massEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': massEvents,
            }),
          }}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-12">
        <ScheduleTable
          masses={masses}
          locale={locale}
          heading={resolveLocale(
            { lt: 'Šv. Mišių tvarkaraštis', en: 'Mass Schedule', ru: 'Расписание Месс' },
            locale,
          )}
        />

        {/* Additional info */}
        <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-2">
            {resolveLocale(
              { lt: 'Svarbi informacija', en: 'Important information', ru: 'Важная информация' },
              locale,
            )}
          </h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>
              {resolveLocale(
                {
                  lt: 'Šv. Mišių intencijas galima užsakyti paskambinus telefonu arba el. paštu',
                  en: 'Mass intentions can be booked by phone or email',
                  ru: 'Намерения Мессы можно заказать по телефону или электронной почте',
                },
                locale,
              )}
            </li>
            <li>
              {resolveLocale(
                {
                  lt: 'Šventadieniais tvarkaraštis gali keistis',
                  en: 'Schedule may change on holy days',
                  ru: 'В праздничные дни расписание может меняться',
                },
                locale,
              )}
            </li>
          </ul>
          <div className="mt-4">
            <a
              href={`mailto:${fixture.identity?.email}?subject=${encodeURIComponent('Šv. Mišių intencija')}`}
              className="inline-block px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 text-sm"
            >
              {resolveLocale(
                { lt: 'Užsakyti Mišias', en: 'Book Mass Intention', ru: 'Заказать Мессу' },
                locale,
              )}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
