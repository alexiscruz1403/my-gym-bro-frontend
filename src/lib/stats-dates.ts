import type { StatsPeriod } from '@/types/domain.types';

/**
 * Returns the current ISO date reference string for the given period:
 *   week  → 'YYYY-Www'  (ISO week)
 *   month → 'YYYY-MM'
 *   year  → 'YYYY'
 */
export function getCurrentPeriodDate(period: StatsPeriod): string {
  const now = new Date();
  now.setHours(12, 0, 0, 0);

  if (period === 'year') {
    return now.getFullYear().toString();
  }

  if (period === 'month') {
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
  }

  // week: ISO 8601 week number
  return toISOWeekString(now);
}

/**
 * Returns the previous (-1) or next (+1) period date string relative to `date`.
 */
export function shiftPeriod(period: StatsPeriod, date: string, direction: -1 | 1): string {
  if (period === 'year') {
    const year = parseInt(date, 10);
    return String(year + direction);
  }

  if (period === 'month') {
    const [year, month] = date.split('-').map(Number);
    const d = new Date(year, month - 1 + direction, 1);
    const newMonth = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${newMonth}`;
  }

  // week: parse 'YYYY-Www', shift by 7 days
  const mondayOfWeek = isoWeekStringToMonday(date);
  mondayOfWeek.setDate(mondayOfWeek.getDate() + direction * 7);
  return toISOWeekString(mondayOfWeek);
}

/**
 * Converts a backend breakdown label to a human-readable display string:
 *   week  → 'YYYY-MM-DD' → short day name ('Lun', 'Mar', ...)
 *   month → 'YYYY-Www'   → 'Sem 1', 'Sem 2', ...
 *   year  → 'YYYY-MM'    → short month name ('Ene', 'Feb', ...)
 */
export function formatBreakdownLabel(period: StatsPeriod, label: string): string {
  if (period === 'week') {
    const date = new Date(label + 'T00:00:00');
    return date.toLocaleDateString('es', { weekday: 'short' }).replace('.', '');
  }

  if (period === 'month') {
    const monday = isoWeekStringToMonday(label);
    const weekOfMonth = getWeekOfMonth(monday);
    return `Sem ${weekOfMonth}`;
  }

  // year: 'YYYY-MM'
  const [year, month] = label.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('es', { month: 'short' }).replace('.', '');
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toISOWeekString(date: Date): string {
  const thursday = new Date(date);
  thursday.setDate(date.getDate() - ((date.getDay() + 6) % 7) + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  const weekNumber = Math.floor(
    ((thursday.getTime() - firstThursday.getTime()) / 86400000 + ((firstThursday.getDay() + 6) % 7)) / 7,
  ) + 1;
  return `${thursday.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

function isoWeekStringToMonday(isoWeek: string): Date {
  const [yearStr, weekStr] = isoWeek.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  // Jan 4 is always in week 1
  const jan4 = new Date(year, 0, 4);
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const monday = new Date(mondayOfWeek1);
  monday.setDate(mondayOfWeek1.getDate() + (week - 1) * 7);
  return monday;
}

function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const mondayOfFirstWeek = new Date(firstDayOfMonth);
  mondayOfFirstWeek.setDate(firstDayOfMonth.getDate() - ((firstDayOfMonth.getDay() + 6) % 7));
  const diff = date.getTime() - mondayOfFirstWeek.getTime();
  return Math.floor(diff / (7 * 86400000)) + 1;
}
