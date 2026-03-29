'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExerciseConfigForm } from './ExerciseConfigForm';
import { ExercisePickerDrawer } from './ExercisePickerDrawer';
import { Trash2, Plus, Pencil } from 'lucide-react';
import type { DayOfWeek, Exercise } from '@/types/domain.types';
import type { ExerciseConfigDraft } from '@/types/ui.types';

interface DayExerciseListProps {
  day: DayOfWeek;
  exercises: ExerciseConfigDraft[];
  onAdd: (exercise: ExerciseConfigDraft) => void;
  onUpdate: (index: number, config: Partial<ExerciseConfigDraft>) => void;
  onRemove: (index: number) => void;
}

export function DayExerciseList({
  day,
  exercises,
  onAdd,
  onUpdate,
  onRemove,
}: DayExerciseListProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSelectExercise = (exercise: Exercise) => {
    onAdd({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: 3,
      reps: 10,
      rest: 60,
    });
  };

  const handleSaveConfig = (
    index: number,
    config: Omit<ExerciseConfigDraft, 'exerciseId' | 'exerciseName'>,
  ) => {
    onUpdate(index, config);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3">
      {exercises.length === 0 && (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No exercises added for this day.
        </p>
      )}

      {exercises.map((ex, index) => (
        <div key={`${ex.exerciseId}-${index}`}>
          {editingIndex === index ? (
            <ExerciseConfigForm
              exerciseName={ex.exerciseName}
              defaultValues={ex}
              onSave={(config) => handleSaveConfig(index, config)}
              onCancel={() => setEditingIndex(null)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{ex.exerciseName}</p>
                <p className="text-muted-foreground text-xs">
                  {ex.sets} × {ex.reps !== undefined ? `${ex.reps} reps` : `${ex.duration}s`}
                  {ex.weight ? ` · ${ex.weight}kg` : ''}
                  {` · ${ex.rest}s rest`}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setEditingIndex(index)}
                aria-label="Edit exercise"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                aria-label="Remove exercise"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          {index < exercises.length - 1 && <Separator className="mt-3" />}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setPickerOpen(true)}
        className="w-full gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Add exercise
      </Button>

      <ExercisePickerDrawer
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectExercise}
      />
    </div>
  );
}
