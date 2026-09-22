/**
 * Site footer — contact info, quick mass times, legal links, copyright.
 *
 * Server component: reads fixture data for contact info and mass schedule.
 * No client-side interactivity needed.
 */

import fixture from '@/fixtures/tenant.json';
import { legalNav } from '@/lib/navigation';
import { resolveLocale, type SupportedLocale } from '@/lib/resolve-locale';

const fixtureLocale: SupportedLocale = (fixture.locale as SupportedLocale) ?? 'lt';

/**
 * Extract the first few Sunday mass times for the quick reference.
 */
function getQuickMassTimes(): Array<{ day: string; time: string }> {
  const page = fixture.pages[0];
  if (!page) return [];

  const massBlock = page.contentBlocks.find((b) => b.type === 'massSchedule');
  if (!massBlock || !Array.isArray(massBlock.masses)) return [];

  // Take the first 3 Sunday masses as a quick reference
  const sundayMasses = (massBlock.masses as Array<Record<string, unknown>>)
    .filter((m) => {
      const day = m.day as string;
      const dayEn = m.dayEn as string | undefined;
      return day === 'Sekmadienis' || dayEn === 'Sunday';
    })
    .slice(0, 3);

  return sundayMasses.map((m) => ({
    day: fixtureLocale === 'en' && m.dayEn ? (m.dayEn as string) : (m.day as string),
    time: m.time as string,
  }));
}

export default function Footer({ locale = fixtureLocale }: { locale?: SupportedLocale } = {}) {
  const identity = fixture.identity;
  const massTimes = getQuickMassTimes();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              {resolveLocale({ lt: 'Kontaktai', en: 'Contact', ru: 'Контакты' }, locale)}
            </h2>
            <address className="not-italic space-y-2 text-sm">
              <p>{identity.address}</p>
              <p>
                <a
                  href={`tel:${identity.phone}`}
                  className="hover:text-amber-400 hover:underline"
                >
                  {identity.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${identity.email}`}
                  className="hover:text-amber-400 hover:underline"
                >
                  {identity.email}
                </a>
              </p>
              <p>
                <a
                  href={`https://${identity.domain}`}
                  className="hover:text-amber-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {identity.domain}
                </a>
              </p>
            </address>
          </div>

          {/* Quick mass times */}
          {massTimes.length > 0 && (
            <div>
              <h2 className="text-white font-semibold text-lg mb-4">
                {resolveLocale(
                  { lt: 'Šv. Mišios sekmadieniais', en: 'Sunday Mass', ru: 'Месса по воскресеньям' },
                  locale,
                )}
              </h2>
              <ul className="space-y-2 text-sm">
                {massTimes.map((m, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{m.day}</span>
                    <span className="text-amber-400 font-medium">{m.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal links */}
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">
              {resolveLocale({ lt: 'Teisinė informacija', en: 'Legal', ru: 'Правовая информация' }, locale)}
            </h2>
            <ul className="space-y-2 text-sm">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={`/${locale}${item.href}`}
                    className="hover:text-amber-400 hover:underline"
                  >
                    {resolveLocale(item.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>
            © {currentYear}{' '}
            {resolveLocale(
              { lt: 'Vilniaus arkivyskupija', en: 'Vilnius Archdiocese', ru: 'Виленская архиепархия' },
              locale,
            )}
            .{' '}
            {resolveLocale(
              {
                lt: 'Platinama pagal EUPL-1.2 licenciją.',
                en: 'Licensed under EUPL-1.2.',
                ru: 'Распространяется под лицензией EUPL-1.2.',
              },
              locale,
            )}
          </p>
          <p className="mt-2">
            {resolveLocale(
              {
                lt: 'Journey of Life platforma',
                en: 'Journey of Life platform',
                ru: 'Платформа Journey of Life',
              },
              locale,
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
