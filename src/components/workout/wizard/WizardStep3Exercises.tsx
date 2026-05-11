'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DayExerciseList } from './DayExerciseList';
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

      <Tabs value={activeDay} onValueChange={setActiveDay}>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <TabsList className="flex w-max gap-1">
            {selectedDays.map((day) => (
              <TabsTrigger key={day} value={day} className="shrink-0 cursor-pointer">
                {dayShortLabels[day]}
                {(exercisesByDay[day]?.length ?? 0) > 0 && (
                  <span className="bg-primary/20 text-primary ml-1 rounded-full px-1.5 text-xs">
                    {exercisesByDay[day]!.length}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {selectedDays.map((day) => (
          <TabsContent key={day} value={day} className="mt-4">
            <DayExerciseList
              exercises={exercisesByDay[day] ?? []}
              dayName={dayNamesByDay[day] ?? ''}
              onDayNameChange={(name) => onSetDayName(day, name)}
              onAdd={(ex) => onAdd(day, ex)}
              onUpdate={(index, config) => onUpdate(day, index, config)}
              onRemove={(index) => onRemove(day, index)}
              onReorder={(from, to) => onReorder(day, from, to)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 cursor-pointer">
          {t('common.back')}
        </Button>
        <Button onClick={onNext} disabled={totalExercises === 0} className="flex-1 cursor-pointer">
          {t('common.review')}
        </Button>
      </div>
    </div>
  );
}
