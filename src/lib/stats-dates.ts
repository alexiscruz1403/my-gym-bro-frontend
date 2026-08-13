import type { StatsPeriod } from '@/types/domain.types';

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

  return toISOWeekString(now);
}

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

  const mondayOfWeek = isoWeekStringToMonday(date);
  mondayOfWeek.setDate(mondayOfWeek.getDate() + direction * 7);
  return toISOWeekString(mondayOfWeek);
}

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

  const [year, month] = label.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('es', { month: 'short' }).replace('.', '');
}

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
