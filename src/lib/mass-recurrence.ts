/**
 * Mass schedule recurrence utilities.
 *
 * Computes the next occurrence of a recurring mass from a dayOfWeek + time
 * pair, relative to a reference date (defaults to build time). This prevents
 * JSON-LD Event.startDate from becoming stale.
 *
 * ISO 8601 day-of-week: 1 = Monday, 7 = Sunday.
 */

/**
 * Compute the next date matching the given dayOfWeek (1-7) at the given time.
 *
 * @param dayOfWeek ISO 8601 day-of-week (1 = Monday, 7 = Sunday)
 * @param time Time string in "HH:MM" format
 * @param referenceDate Reference date (defaults to now)
 * @returns ISO 8601 datetime string (e.g., "2026-09-28T08:00:00")
 */
export function nextOccurrence(
  dayOfWeek: number,
  time: string,
  referenceDate: Date = new Date(),
): string {
  if (dayOfWeek < 1 || dayOfWeek > 7) {
    throw new Error(`dayOfWeek must be 1-7, got ${dayOfWeek}`);
  }

  const parts = time.split(':').map(Number);
  const hours = parts[0];
  const minutes = parts[1];
  if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time format: ${time}`);
  }

  // Find the next occurrence of the target day-of-week
  const result = new Date(referenceDate);
  result.setHours(hours, minutes, 0, 0);

  const currentDayOfWeek = result.getDay() === 0 ? 7 : result.getDay(); // Convert 0 (Sunday) to 7

  let daysUntilTarget = dayOfWeek - currentDayOfWeek;
  if (daysUntilTarget < 0 || (daysUntilTarget === 0 && result < referenceDate)) {
    // Target day is in the past this week, move to next week
    daysUntilTarget += 7;
  }

  result.setDate(result.getDate() + daysUntilTarget);

  // Format as ISO 8601 without timezone (local time)
  const year = result.getFullYear();
  const month = String(result.getMonth() + 1).padStart(2, '0');
  const day = String(result.getDate()).padStart(2, '0');
  const hour = String(hours).padStart(2, '0');
  const minute = String(minutes).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

/**
 * Compute next occurrences for multiple day-of-week values (e.g., weekdays).
 *
 * @param daysOfWeek Array of ISO 8601 day-of-week values (1-7)
 * @param time Time string in "HH:MM" format
 * @param referenceDate Reference date (defaults to now)
 * @returns Array of ISO 8601 datetime strings
 */
export function nextOccurrences(
  daysOfWeek: number[],
  time: string,
  referenceDate?: Date,
): string[] {
  return daysOfWeek.map((dow) => nextOccurrence(dow, time, referenceDate));
}
