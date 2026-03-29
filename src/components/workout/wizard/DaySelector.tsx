import { cn } from '@/lib/utils';
import type { DayOfWeek } from '@/types/domain.types';

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'monday',    label: 'Monday',    short: 'Mon' },
  { value: 'tuesday',   label: 'Tuesday',   short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday',  label: 'Thursday',  short: 'Thu' },
  { value: 'friday',    label: 'Friday',    short: 'Fri' },
  { value: 'saturday',  label: 'Saturday',  short: 'Sat' },
  { value: 'sunday',    label: 'Sunday',    short: 'Sun' },
];

interface DaySelectorProps {
  selected: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

export function DaySelector({ selected, onChange }: DaySelectorProps) {
  const toggle = (day: DayOfWeek) => {
    const next = selected.includes(day)
      ? selected.filter((d) => d !== day)
      : [...selected, day];
    onChange(next);
  };

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAYS.map((day) => {
        const isSelected = selected.includes(day.value);
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => toggle(day.value)}
            aria-pressed={isSelected}
            aria-label={day.label}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg py-3 text-xs font-medium transition-colors',
              'min-h-[56px] select-none',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
          >
            {day.short}
          </button>
        );
      })}
    </div>
  );
}
