import { describe, it, expect } from 'vitest';
import { nextOccurrence, nextOccurrences } from '@/lib/mass-recurrence';

describe('nextOccurrence', () => {
  it('computes next Sunday from a Monday', () => {
    // Monday 2026-09-21
    const ref = new Date('2026-09-21T10:00:00');
    const result = nextOccurrence(7, '08:00', ref);
    // Next Sunday is 2026-09-27
    expect(result).toBe('2026-09-27T08:00:00');
  });

  it('computes next Monday from a Sunday', () => {
    // Sunday 2026-09-27
    const ref = new Date('2026-09-27T10:00:00');
    const result = nextOccurrence(1, '08:00', ref);
    // Next Monday is 2026-09-28
    expect(result).toBe('2026-09-28T08:00:00');
  });

  it('computes same day if time is in the future', () => {
    // Monday 2026-09-21 at 07:00
    const ref = new Date('2026-09-21T07:00:00');
    const result = nextOccurrence(1, '08:00', ref);
    // Same day, 08:00 is in the future
    expect(result).toBe('2026-09-21T08:00:00');
  });

  it('computes next week if time has passed today', () => {
    // Monday 2026-09-21 at 09:00
    const ref = new Date('2026-09-21T09:00:00');
    const result = nextOccurrence(1, '08:00', ref);
    // 08:00 has passed, so next Monday is 2026-09-28
    expect(result).toBe('2026-09-28T08:00:00');
  });

  it('handles Saturday (dayOfWeek = 6)', () => {
    // Wednesday 2026-09-23
    const ref = new Date('2026-09-23T10:00:00');
    const result = nextOccurrence(6, '17:30', ref);
    // Next Saturday is 2026-09-26
    expect(result).toBe('2026-09-26T17:30:00');
  });

  it('throws on invalid dayOfWeek', () => {
    expect(() => nextOccurrence(0, '08:00')).toThrow('dayOfWeek must be 1-7');
    expect(() => nextOccurrence(8, '08:00')).toThrow('dayOfWeek must be 1-7');
  });

  it('throws on invalid time format', () => {
    expect(() => nextOccurrence(1, '25:00')).toThrow('Invalid time format');
    expect(() => nextOccurrence(1, '08:60')).toThrow('Invalid time format');
    expect(() => nextOccurrence(1, 'abc')).toThrow('Invalid time format');
  });
});

describe('nextOccurrences', () => {
  it('computes multiple occurrences for weekdays', () => {
    // Monday 2026-09-21
    const ref = new Date('2026-09-21T10:00:00');
    const daysOfWeek = [1, 2, 3, 4, 5, 6]; // Mon-Sat
    const results = nextOccurrences(daysOfWeek, '08:00', ref);

    expect(results).toHaveLength(6);
    // Monday 08:00 has passed (ref is 10:00), so next Monday is 2026-09-28
    expect(results[0]).toBe('2026-09-28T08:00:00');
    // Tuesday-Saturday are in the future this week
    expect(results[1]).toBe('2026-09-22T08:00:00');
    expect(results[2]).toBe('2026-09-23T08:00:00');
    expect(results[3]).toBe('2026-09-24T08:00:00');
    expect(results[4]).toBe('2026-09-25T08:00:00');
    expect(results[5]).toBe('2026-09-26T08:00:00');
  });

  it('handles empty array', () => {
    const results = nextOccurrences([], '08:00');
    expect(results).toHaveLength(0);
  });
});
