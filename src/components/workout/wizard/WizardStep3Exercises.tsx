'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DayExerciseList } from './DayExerciseList';
import type { DayOfWeek } from '@/types/domain.types';
import type { ExerciseConfigDraft } from '@/types/ui.types';

const DAY_SHORT: Record<DayOfWeek, string> = {
  monday:    'Mon',
  tuesday:   'Tue',
  wednesday: 'Wed',
  thursday:  'Thu',
  friday:    'Fri',
  saturday:  'Sat',
  sunday:    'Sun',
};

interface WizardStep3ExercisesProps {
  selectedDays: DayOfWeek[];
  exercisesByDay: Partial<Record<DayOfWeek, ExerciseConfigDraft[]>>;
  onAdd: (day: DayOfWeek, exercise: ExerciseConfigDraft) => void;
  onUpdate: (day: DayOfWeek, index: number, config: Partial<ExerciseConfigDraft>) => void;
  onRemove: (day: DayOfWeek, index: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function WizardStep3Exercises({
  selectedDays,
  exercisesByDay,
  onAdd,
  onUpdate,
  onRemove,
  onNext,
  onBack,
}: WizardStep3ExercisesProps) {
  const [activeDay, setActiveDay] = useState<string>(selectedDays[0] ?? '');

  const totalExercises = selectedDays.reduce(
    (acc, day) => acc + (exercisesByDay[day]?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">Add exercises</h2>
        <p className="text-muted-foreground text-sm">
          Assign exercises to each training day.
        </p>
      </div>

      <Tabs value={activeDay} onValueChange={setActiveDay}>
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <TabsList className="flex w-max gap-1">
            {selectedDays.map((day) => (
              <TabsTrigger key={day} value={day} className="shrink-0 cursor-pointer">
                {DAY_SHORT[day]}
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
              onAdd={(ex) => onAdd(day, ex)}
              onUpdate={(index, config) => onUpdate(day, index, config)}
              onRemove={(index) => onRemove(day, index)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 cursor-pointer">
          Back
        </Button>
        <Button onClick={onNext} disabled={totalExercises === 0} className="flex-1 cursor-pointer">
          Review
        </Button>
      </div>
    </div>
  );
}
