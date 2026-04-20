'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Dumbbell } from 'lucide-react';
import type { DayOfWeek } from '@/types/domain.types';
import type { ExerciseConfigDraft } from '@/types/ui.types';

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

interface WizardStep4ReviewProps {
  name: string;
  selectedDays: DayOfWeek[];
  exercisesByDay: Partial<Record<DayOfWeek, ExerciseConfigDraft[]>>;
  isSaving: boolean;
  onSave: () => void;
  onBack: () => void;
}

export function WizardStep4Review({
  name,
  selectedDays,
  exercisesByDay,
  isSaving,
  onSave,
  onBack,
}: WizardStep4ReviewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">Review your plan</h2>
        <p className="text-muted-foreground text-sm">
          Check everything looks good before saving.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 space-y-4">
        <p className="font-display text-lg font-bold">{name}</p>
        <Separator />
        <div className="space-y-3">
          {selectedDays.map((day) => {
            const exercises = exercisesByDay[day] ?? [];
            return (
              <div key={day}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <CalendarDays className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-sm font-medium">{DAY_LABELS[day]}</span>
                </div>
                {exercises.length === 0 ? (
                  <p className="text-muted-foreground pl-5 text-xs">No exercises</p>
                ) : (
                  <ul className="space-y-0.5 pl-5">
                    {exercises.map((ex, i) => {
                      const metric =
                        ex.bilateral === false
                          ? 'L/R'
                          : ex.reps !== undefined
                            ? `${ex.reps}reps`
                            : `${ex.duration}s`;
                      return (
                        <li key={i} className="flex items-center gap-1.5 text-xs">
                          <Dumbbell className="text-muted-foreground h-3 w-3 shrink-0" />
                          <span className="text-muted-foreground">
                            {ex.exerciseName} — {ex.sets}×{metric}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} disabled={isSaving} className="flex-1 cursor-pointer">
          Back
        </Button>
        <Button onClick={onSave} disabled={isSaving} className="flex-1 cursor-pointer">
          {isSaving ? 'Saving...' : 'Save plan'}
        </Button>
      </div>
    </div>
  );
}
