'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { DayOfWeek } from '@/types/domain.types';

const DAY_ORDER: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

interface DaySelectorProps {
  selected: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

export function DaySelector({ selected, onChange }: DaySelectorProps) {
  const { t } = useTranslation();
  const dayLabels = t('days', { returnObjects: true }) as Record<DayOfWeek, string>;
  const dayShortLabels = t('daysShort', { returnObjects: true }) as Record<DayOfWeek, string>;

  const toggle = (day: DayOfWeek) => {
    const next = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day];
    onChange(next);
  };

  return (
    <div className="grid w-full grid-cols-7 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {DAY_ORDER.map((day) => {
        const isSelected = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            aria-pressed={isSelected}
            aria-label={dayLabels[day]}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg py-3 text-xs font-medium transition-colors',
              'min-h-14 cursor-pointer select-none',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {dayShortLabels[day]}
          </button>
        );
      })}
    </div>
  );
}
