/**
 * ScheduleTable — renders mass/confession times with semantic <time dateTime>.
 *
 * Spec §8.2 P0 requirement: ScheduleTable component with <time dateTime>
 * for machine-readable schedule data (SEO + accessibility).
 *
 * Groups masses into Sunday and weekday sections.
 * Used by both the homepage (inline block) and /worship/mass page.
 */

import { resolveLocale, type SupportedLocale, type LocalizedText } from '@/lib/resolve-locale';

export interface MassEntry {
  day: string;
  dayEn?: string;
  time: string;
  startDate: string;
  language?: string;
  notes?: LocalizedText;
}

interface ScheduleTableProps {
  masses: MassEntry[];
  locale: SupportedLocale;
  heading: string;
}

/**
 * Convert a display time like "08:00" or "08.00" to a valid time token
 * for the <time dateTime> attribute (HH:MM format).
 */
function toTimeToken(time: string): string {
  return time.replace('.', ':');
}

export default function ScheduleTable({ masses, locale, heading }: ScheduleTableProps) {
  const sundayMasses = masses.filter(
    (m) => m.day === 'Sekmadienis' || m.dayEn === 'Sunday',
  );
  const weekdayMasses = masses.filter(
    (m) => m.day !== 'Sekmadienis' && m.dayEn !== 'Sunday',
  );

  const renderGroup = (label: string, entries: MassEntry[]) => {
    if (entries.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">{label}</h3>
        <div className="space-y-2">
          {entries.map((mass, i) => {
            const dayLabel =
              locale === 'en' && mass.dayEn ? mass.dayEn : mass.day;
            return (
              <div
                key={i}
                className="flex flex-wrap justify-between items-center gap-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <time dateTime={mass.startDate} className="font-medium text-gray-900">
                    {dayLabel}
                  </time>
                  <time
                    dateTime={`1900-01-01T${toTimeToken(mass.time)}:00`}
                    className="text-amber-700 font-semibold tabular-nums"
                  >
                    {mass.time}
                  </time>
                </div>
                {mass.notes && (
                  <span className="text-sm text-gray-500">
                    {resolveLocale(mass.notes, locale)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section aria-label={heading}>
      <h2 className="text-2xl font-bold mb-6">{heading}</h2>
      {renderGroup(
        resolveLocale(
          { lt: 'Sekmadienis', en: 'Sunday', ru: 'Воскресенье' },
          locale,
        ),
        sundayMasses,
      )}
      {renderGroup(
        resolveLocale(
          {
            lt: 'Šiokiadieniais ir šeštadieniais',
            en: 'Weekdays and Saturday',
            ru: 'Будни и суббота',
          },
          locale,
        ),
        weekdayMasses,
      )}
    </section>
  );
}
