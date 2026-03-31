import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shiftPeriod } from '@/lib/stats-dates';
import type { StatsPeriod } from '@/types/domain.types';

const PERIODS: { value: StatsPeriod; label: string }[] = [
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
];

function formatDateLabel(period: StatsPeriod, date: string): string {
  if (period === 'year') return date;

  if (period === 'month') {
    const [year, month] = date.split('-').map(Number);
    const d = new Date(year, month - 1, 1);
    return d.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  }

  // week: 'YYYY-Www' — show the range Mon–Sun
  const [yearStr, weekStr] = date.split('-W');
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  const jan4 = new Date(year, 0, 4);
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
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
  return (
    <div className="space-y-3">
      <div className="flex rounded-lg bg-muted p-1">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onPeriodChange(p.value)}
            className={cn(
              'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors',
              period === p.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onDateChange(shiftPeriod(period, date, -1))}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Período anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="text-sm font-medium tabular-nums">
          {formatDateLabel(period, date)}
        </span>

        <button
          type="button"
          onClick={() => onDateChange(shiftPeriod(period, date, 1))}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Período siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
