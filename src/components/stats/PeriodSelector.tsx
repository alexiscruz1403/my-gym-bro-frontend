'use client';

import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shiftPeriod } from '@/lib/stats-dates';
import type { StatsPeriod } from '@/types/domain.types';

const PERIOD_VALUES: StatsPeriod[] = ['week', 'month', 'year'];

function formatDateLabel(period: StatsPeriod, date: string, lang: string): string {
  if (period === 'year') return date;

  if (period === 'month') {
    const [year, month] = date.split('-').map(Number);
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString(lang, { month: 'long', year: 'numeric' });
  }

  const [yearStr, weekStr] = date.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  const jan4 = new Date(year, 0, 4);
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString(lang, { day: 'numeric', month: 'short' });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

interface PeriodSelectorProps {
  period: StatsPeriod;
  date: string;
  onPeriodChange: (period: StatsPeriod) => void;
  onDateChange: (date: string) => void;
}

export function PeriodSelector({
  period,
  date,
  onPeriodChange,
  onDateChange,
}: PeriodSelectorProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex rounded-lg bg-muted p-1">
        {PERIOD_VALUES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPeriodChange(p)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors cursor-pointer',
              period === p
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(`stats.period.${p}`)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onDateChange(shiftPeriod(period, date, -1))}
          className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-h-11 min-w-11 flex items-center justify-center"
          aria-label={t('common.back')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-sm font-medium tabular-nums">
          {formatDateLabel(period, date, i18n.language)}
        </span>

        <button
          type="button"
          onClick={() => onDateChange(shiftPeriod(period, date, 1))}
          className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-h-11 min-w-11 flex items-center justify-center"
          aria-label={t('common.continue')}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
