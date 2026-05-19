'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DayExerciseList } from './DayExerciseList';
import { cn } from '@/lib/utils';
import type { DayOfWeek } from '@/types/domain.types';
import type { ExerciseConfigDraft } from '@/types/ui.types';

interface WizardStep3ExercisesProps {
  selectedDays: DayOfWeek[];
  exercisesByDay: Partial<Record<DayOfWeek, ExerciseConfigDraft[]>>;
  dayNamesByDay: Partial<Record<DayOfWeek, string>>;
  onSetDayName: (day: DayOfWeek, name: string) => void;
  onAdd: (day: DayOfWeek, exercise: ExerciseConfigDraft) => void;
  onUpdate: (day: DayOfWeek, index: number, config: Partial<ExerciseConfigDraft>) => void;
  onRemove: (day: DayOfWeek, index: number) => void;
  onReorder: (day: DayOfWeek, fromIndex: number, toIndex: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WizardStep3Exercises({
  selectedDays,
  exercisesByDay,
  dayNamesByDay,
  onSetDayName,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  onNext,
  onBack,
}: WizardStep3ExercisesProps) {
  const { t } = useTranslation();
  const [activeDay, setActiveDay] = useState<string>(selectedDays[0] ?? '');

  const dayShortLabels = t('daysShort', { returnObjects: true }) as Record<DayOfWeek, string>;

  const totalExercises = selectedDays.reduce(
    (acc, day) => acc + (exercisesByDay[day]?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">{t('plans.wizard.step3.title')}</h2>
        <p className="text-muted-foreground text-sm">
          {t('plans.wizard.step3.description')}
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
        {selectedDays.map((day) => {
          const count = exercisesByDay[day]?.length ?? 0;
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={cn(
                'flex h-[34px] shrink-0 cursor-pointer items-center gap-[5px] rounded-full border-[1.5px] px-[14px] text-[12px] font-semibold whitespace-nowrap transition-colors',
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-transparent text-muted-foreground',
              )}
            >
              {dayShortLabels[day]}
              {count > 0 && (
                <span
                  className={cn(
                    'rounded-full px-[5px] py-[1px] text-[10px]',
                    isActive ? 'bg-white/25' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {selectedDays.map((day) => (
          <div key={day} className={activeDay === day ? 'block' : 'hidden'}>
            <DayExerciseList
              exercises={exercisesByDay[day] ?? []}
              dayName={dayNamesByDay[day] ?? ''}
              onDayNameChange={(name) => onSetDayName(day, name)}
              onAdd={(ex) => onAdd(day, ex)}
              onUpdate={(index, config) => onUpdate(day, index, config)}
              onRemove={(index) => onRemove(day, index)}
              onReorder={(from, to) => onReorder(day, from, to)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-[46px] flex-1 cursor-pointer rounded-2xl border-border text-[14px] font-medium"
        >
          {t('common.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={totalExercises === 0}
          className="h-[46px] flex-1 cursor-pointer rounded-2xl text-[15px] font-semibold disabled:opacity-[.45]"
        >
          {t('common.review')}
        </Button>
      </div>
    </div>
  );
}
