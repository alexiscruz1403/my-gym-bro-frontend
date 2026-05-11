'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Dumbbell, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WorkoutPlan, DayOfWeek } from '@/types/domain.types';

interface StartSessionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: WorkoutPlan;
  todayDow: DayOfWeek;
  onStart: (dayOfWeek: DayOfWeek) => Promise<void>;
}

export function StartSessionSheet({
  open,
  onOpenChange,
  plan,
  todayDow,
  onStart,
}: StartSessionSheetProps) {
  const { t } = useTranslation();
  const dayLabels = t('days', { returnObjects: true }) as Record<DayOfWeek, string>;

  const [selected, setSelected] = useState<DayOfWeek | null>(
    plan.days.find((d) => d.dayOfWeek === todayDow)?.dayOfWeek ?? null,
  );
  const [starting, setStarting] = useState(false);

  const handleStart = async () => {
    if (!selected) return;
    setStarting(true);
    try {
      await onStart(selected);
    } finally {
      setStarting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t('session.startSession.title')}</SheetTitle>
          <SheetDescription>
            {t('session.startSession.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2 px-4 pb-2">
          {plan.days.map((day) => {
            const isToday = day.dayOfWeek === todayDow;
            const isSelected = selected === day.dayOfWeek;

            return (
              <button
                key={day.dayOfWeek}
                type="button"
                onClick={() => setSelected(day.dayOfWeek)}
                className={cn(
                  'flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50',
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground',
                    )}
                  >
                    {isSelected && (
                      <div className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{dayLabels[day.dayOfWeek]}</span>
                      <span className='text-muted-foreground font-normal'>{day.dayName ? ` · ${day.dayName}` : ''}</span>
                      {isToday && (
                        <Badge className="bg-primary text-primary-foreground h-4 px-1.5 text-[10px]">
                          {t('session.today')}
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Dumbbell className="h-3 w-3" />
                        {t('plans.exerciseCount', { count: day.exercises.length })}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {t('plans.setCount', { count: day.exercises.reduce((s, e) => s + e.sets, 0) })}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 pb-4 pt-2">
          <Button
            className="w-full cursor-pointer gap-2"
            disabled={!selected || starting}
            onClick={handleStart}
          >
            <Play className="h-4 w-4" />
            {starting ? t('session.startSession.starting') : t('session.startWorkout')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
