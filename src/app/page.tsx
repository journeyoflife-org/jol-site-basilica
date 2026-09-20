/**
 * Home page — Page Package 03 wireframe implementation.
 *
 * Reading order (mobile-first, per page spec 03 SS1):
 * 1. Header/nav + breadcrumb (BreadcrumbList)
 * 2. Hero (full-width): name, designation badge, address, primary CTA
 * 3. Content (two-column 60/40): history + significance | fact card
 * 4. Mass schedule (Event JSON-LD)
 * 5. Sacraments/services (Service JSON-LD)
 * 6. Gallery (WCAG 1.1.1 alt text required)
 * 7. Visiting info + Map (self-hosted tiles only, no third-party SDK)
 * 8. Contact form + Footer
 *
 * Invariants:
 * - DS-A11Y-01: html lang (set in layout.tsx)
 * - DS-A11Y-02: gallery/map labels
 * - DS-A11Y-03: main landmark (set in layout.tsx)
 * - DS-A11Y-07: skip-nav (set in layout.tsx)
 * - DS-A11Y-08,09,10,12: targets, focus, headings, landmarks
 *
 * Analytics events (consent-gated):
 * - page_view, mass_times_open, map_directions_click, contact_form_submit_success
 *
 * TODO: consume @journeyoflife-org/ui components, @journeyoflife-org/seo builders,
 *       @journeyoflife-org/seed-data fixture when packages are published.
 */
import fixture from '@/fixtures/tenant.json';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';
import { churchEntity, massEventEntity, breadcrumbListEntity } from '@journeyoflife-org/seo';
import TrackedLink from '@/components/tracked-link';
import ScheduleTable from '@/components/schedule-table';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Parse a free-form address string into structured PostalAddress fields.
 * Expected input: "Katedros a. 2, 01143 Vilnius, Lithuania".
 */
function parseAddress(full: string): {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: string;
} {
  const parts = full.split(',').map((s) => s.trim());
  const streetAddress = parts[0] ?? '';
  const postalAndCity = parts[1] ?? '';
  const country = parts[2] ?? '';
  const postalMatch = postalAndCity.match(/^(\d{5})\s+(.+)$/);
  return {
    streetAddress,
    postalCode: postalMatch?.[1] ?? '',
    addressLocality: postalMatch?.[2] ?? '',
    addressCountry: country === 'Lithuania' ? 'LT' : country,
  };
}

interface ContentBlock {
  type: string;
  heading?: { lt: string; en?: string; ru?: string };
  [key: string]: unknown;
}

function BlockRenderer({ block, locale }: { block: ContentBlock; locale: SupportedLocale }) {
  const h = (text: { lt: string; en?: string; ru?: string } | undefined) =>
    text ? resolveLocale(text, locale) : '';

  switch (block.type) {
    case 'hero':
      return (
        <section className="py-20 text-center bg-gray-50" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto px-4">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 rounded mb-4">
              {resolveLocale({ lt: 'Mažoji bazilika', en: 'Minor Basilica', ru: 'Малая базилика' }, locale)}
            </span>
            <h1 className="text-4xl font-bold tracking-tight">{h(block.heading)}</h1>
            {(block.subheading as { lt: string; en?: string; ru?: string } | undefined) && (
              <p className="mt-4 text-lg text-gray-600">
                {h(block.subheading as { lt: string; en?: string; ru?: string })}
              </p>
            )}
            {(block.body as { lt: string; en?: string; ru?: string } | undefined) && (
              <p className="mt-6 text-base text-gray-700">
                {h(block.body as { lt: string; en?: string; ru?: string })}
              </p>
            )}
            <a href="#mass-schedule" className="mt-8 inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800">
              {resolveLocale({ lt: 'Šv. Mišių tvarkaraštis', en: 'Mass Schedule', ru: 'Расписание Месс' }, locale)}
            </a>
          </div>
        </section>
      );

    case 'massSchedule':
      return (
        <ScheduleTable
          masses={block.masses as Array<{ day: string; dayEn?: string; time: string; startDate: string; language?: string; notes?: { lt: string; en?: string; ru?: string } }>}
          locale={locale}
          heading={h(block.heading)}
        />
      );

    case 'keyValue':
      return (
        <section className="py-12 px-4 bg-gray-50" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(block.items as Array<{ label: { lt: string; en?: string; ru?: string }; value: string }>).map((item, i) => (
                <div key={i} className="bg-white p-4 rounded shadow-sm">
                  <dt className="text-sm text-gray-500">{h(item.label)}</dt>
                  <dd className="mt-1 font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );

    case 'sacramentList':
      return (
        <section className="py-12 px-4" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <div className="space-y-4">
              {(block.sacraments as Array<Record<string, unknown>>).map((sac, i) => (
                <div key={i} className="p-4 bg-white rounded shadow-sm">
                  <h3 className="font-medium text-lg">{h(sac.name as { lt: string; en?: string; ru?: string })}</h3>
                  {(sac.description as { lt: string; en?: string; ru?: string } | undefined) && (
                    <p className="mt-1 text-gray-600">
                      {h(sac.description as { lt: string; en?: string; ru?: string })}
                    </p>
                  )}
                  {(sac.schedule as { lt: string; en?: string; ru?: string } | undefined) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {resolveLocale({ lt: 'Tvarkaraštis: ', en: 'Schedule: ', ru: 'Расписание: ' }, locale)}
                      {h(sac.schedule as { lt: string; en?: string; ru?: string })}
                    </p>
                  )}
                  {(sac.requirements as { lt: string; en?: string; ru?: string } | undefined) && (
                    <p className="mt-1 text-sm text-gray-500">
                      {resolveLocale({ lt: 'Reikalavimai: ', en: 'Requirements: ', ru: 'Требования: ' }, locale)}
                      {h(sac.requirements as { lt: string; en?: string; ru?: string })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'list':
      return (
        <section className="py-12 px-4 bg-gray-50" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(block.items as Array<{ title: { lt: string; en?: string; ru?: string } }>).map((item, i) => (
                <li key={i} className="p-4 bg-white rounded shadow-sm text-center">
                  {h(item.title)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );

    case 'clergyRoleList':
      return (
        <section className="py-12 px-4" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <div className="space-y-4">
              {(block.roles as Array<Record<string, unknown>>).map((role, i) => (
                <div key={i} className="p-4 bg-white rounded shadow-sm">
                  <h3 className="font-medium text-lg">{h(role.role as { lt: string; en?: string; ru?: string })}</h3>
                  {(role.description as { lt: string; en?: string; ru?: string } | undefined) && (
                    <p className="mt-1 text-gray-600">
                      {h(role.description as { lt: string; en?: string; ru?: string })}
                    </p>
                  )}
                  {(role.contact as string | undefined) && (
                    <a href={`mailto:${role.contact}`} className="mt-2 text-sm text-amber-600 hover:underline">
                      {role.contact as string}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section className="py-12 px-4 bg-gray-50" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(block.images as Array<Record<string, unknown>>).map((img, i) => (
                <figure key={i} className="overflow-hidden rounded-lg shadow-sm">
                  <img
                    src={img.src as string}
                    alt={h(img.alt as { lt: string; en?: string; ru?: string })}
                    width={img.width as number}
                    height={img.height as number}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  {(img.caption as { lt: string; en?: string; ru?: string } | undefined) && (
                    <figcaption className="mt-2 text-sm text-gray-500 text-center">
                      {h(img.caption as { lt: string; en?: string; ru?: string })}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case 'visitingInfo':
      return (
        <section className="py-12 px-4" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <div className="space-y-3">
              {(block.hours as Array<Record<string, unknown>>).map((hour, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white rounded shadow-sm">
                  <span className="font-medium">
                    {locale === 'en' && hour.dayEn ? hour.dayEn as string : hour.day as string}
                  </span>
                  <span className="text-gray-600">{hour.open as string}–{hour.close as string}</span>
                </div>
              ))}
            </div>
            {(block.admission as { lt: string; en?: string; ru?: string } | undefined) && (
              <p className="mt-4 text-sm text-gray-600">
                {h(block.admission as { lt: string; en?: string; ru?: string })}
              </p>
            )}
          </div>
        </section>
      );

    case 'mapLocation':
      return (
        <section className="py-12 px-4 bg-gray-50" aria-label={h(block.heading)}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{h(block.heading)}</h2>
            <div className="bg-white rounded shadow-sm p-6 text-center">
              <p className="text-gray-600 mb-4">
                {resolveLocale({ lt: 'Koordinatės', en: 'Coordinates', ru: 'Координаты' }, locale)}:
                {' '}{block.lat as number}, {block.lng as number}
              </p>
              {(block.directionsUrl as string | undefined) && (
                <TrackedLink
                  href={block.directionsUrl as string}
                  className="inline-block px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800"
                  eventPath="/"
                  eventDestination={block.directionsUrl as string}
                >
                  {resolveLocale({ lt: 'Gauti nurodymus', en: 'Get Directions', ru: 'Получить направление' }, locale)}
                </TrackedLink>
              )}
              <p className="mt-3 text-xs text-gray-600">
                {resolveLocale({
                  lt: 'Savarankiški žemėlapiai — jokių trečiųjų šalių SDK',
                  en: 'Self-hosted maps — no third-party SDK',
                  ru: 'Собственная карта — без сторонних SDK',
                }, locale)}
              </p>
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-12 px-4" aria-label="Actions">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
            {(block.links as Array<{ label: { lt: string; en?: string; ru?: string }; href: string }>).map((link, i) => (
              <a key={i} href={link.href} className="px-6 py-3 bg-amber-700 text-white rounded hover:bg-amber-800">
                {h(link.label)}
              </a>
            ))}
          </div>
        </section>
      );

    default:
      return null;
  }
}

export default function Home() {
  const locale: SupportedLocale = 'lt';
  const homePage = fixture.pages[0];
  if (!homePage) return null;
  const blocks = homePage.contentBlocks as ContentBlock[];

  // JSON-LD structured data
  const address = parseAddress(fixture.identity?.address ?? '');
  const churchJsonLd = churchEntity({
    kind: 'basilica',
    preciseCatholic: true,
    name: resolveLocale(fixture.name, locale),
    url: BASE_URL,
    address,
    geo: { latitude: 54.6862, longitude: 25.2903 },
    telephone: fixture.identity?.phone,
    description: resolveLocale(fixture.tagline, locale),
    parent: {
      name: fixture.identity?.jurisdiction ?? 'Vilnius Archdiocese',
    },
  });

  const breadcrumbJsonLd = breadcrumbListEntity([
    { name: resolveLocale({ lt: 'Pradžia', en: 'Home', ru: 'Главная' }, locale), url: BASE_URL },
  ]);

  // Mass schedule → Event JSON-LD (one event per scheduled Mass).
  const massBlock = blocks.find((b) => b.type === 'massSchedule');
  const massEvents = massBlock
    ? (
        (massBlock.masses as Array<{
          day: string;
          dayEn?: string;
          time: string;
          startDate: string;
        }>) || []
      ).map((m) =>
        massEventEntity({
          name: `Šv. Mišios — ${m.dayEn ?? m.day} ${m.time}`,
          startDate: m.startDate,
          location: { name: resolveLocale(fixture.name, locale), address },
        }),
      )
    : [];

  // hreflang: only the served locale (lt at /). Alternates for /en, /ru
  // would advertise routes that don't exist in this spoke — Google treats
  // invalid hreflang targets as a signal to drop the mapping entirely.
  const canonical = `${BASE_URL}/`;

  return (
    <>
      {/* SEO: hreflang + canonical */}
      <link rel="canonical" href={canonical} />
      {/* hreflang: only the served locale + x-default. /en and /ru are
          not implemented in this spoke; advertising them would advertise
          routes that 404. */}
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <link rel="alternate" hrefLang="lt" href={canonical} />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
      />
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

      {/* Content blocks — wireframe reading order */}
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} locale={locale} />
      ))}
    </>
  );
}
