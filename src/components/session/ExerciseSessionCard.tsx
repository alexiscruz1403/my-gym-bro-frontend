'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Plus, Minus } from 'lucide-react';
import { SetList } from './SetList';
import { LastPerformanceRow } from './LastPerformanceRow';
import { RestTimer } from './RestTimer';
import { useRestTimer } from '@/hooks/useRestTimer';
import { toast } from 'sonner';
import type { SessionExercise } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest } from '@/types/api.types';

interface ExerciseSessionCardProps {
  exercise: SessionExercise;
  onLogSet: (dto: LogSetRequest) => Promise<void>;
  onModify: (exerciseId: string, dto: ModifyExerciseRequest) => Promise<void>;
}

export function ExerciseSessionCard({ exercise, onLogSet, onModify }: ExerciseSessionCardProps) {
  const { start: startTimer } = useRestTimer();

  const handleCompleteSet = async (
    setIndex: number,
    weight: number | undefined,
    reps: number | undefined,
  ) => {
    try {
      await onLogSet({
        exerciseId: exercise.exerciseId,
        setIndex,
        weight,
        reps,
        completed: true,
      });
      startTimer(exercise.plannedRest, exercise.exerciseId);
    } catch {
      toast.error('Failed to save set. Please try again.');
    }
  };

  const completedCount = exercise.sets.filter((s) => s.completed).length;
  const allDone = completedCount === exercise.plannedSets;

  const handleAddSet = async () => {
    try {
      await onModify(exercise.exerciseId, { plannedSets: exercise.plannedSets + 1 });
    } catch {
      toast.error('Could not add set. Please try again.');
    }
  };

  const handleRemoveSet = async () => {
    if (exercise.plannedSets <= 1) return;
    // Don't remove a set that has already been logged
    const lastSetIndex = exercise.plannedSets - 1;
    const lastSetLogged = exercise.sets.some((s) => s.setIndex === lastSetIndex);
    if (lastSetLogged) {
      toast.info('Cannot remove a set that has already been completed.');
      return;
    }
    try {
      await onModify(exercise.exerciseId, { plannedSets: exercise.plannedSets - 1 });
    } catch {
      toast.error('Could not remove set. Please try again.');
    }
  };

  return (
    <div className="space-y-4 px-4 py-4">
      {/* Header */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="font-display text-xl font-bold leading-tight">
            {exercise.exerciseName}
          </h2>
          {exercise.supersetGroupId && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Link className="h-3 w-3" />
              {exercise.supersetGroupId}
            </Badge>
          )}
          {allDone && (
            <Badge className="bg-green-500 text-white hover:bg-green-600 text-xs">Done</Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {exercise.plannedSets} sets
          {exercise.plannedReps ? ` × ${exercise.plannedReps} reps` : ''}
          {exercise.plannedWeight ? ` · ${exercise.plannedWeight} kg` : ''}
          {exercise.modifiedDuringSession && (
            <span className="text-primary ml-1 text-xs">(modified)</span>
          )}
        </p>
      </div>

      {/* Last performance */}
      {exercise.lastPerformance && exercise.lastPerformance.length > 0 && (
        <LastPerformanceRow sets={exercise.lastPerformance} />
      )}

      {/* Sets */}
      <SetList exercise={exercise} onCompleteSet={handleCompleteSet} />

      {/* Add / remove sets */}
      <div className="flex items-center justify-between rounded-lg border px-4 py-2">
        <span className="text-muted-foreground text-sm">Sets</span>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemoveSet}
            disabled={exercise.plannedSets <= 1}
            className="h-9 w-9 cursor-pointer"
            aria-label="Remove set"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-4 text-center text-sm font-medium tabular-nums">
            {exercise.plannedSets}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleAddSet}
            className="h-9 w-9 cursor-pointer"
            aria-label="Add set"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Rest timer */}
      <RestTimer exerciseId={exercise.exerciseId} />
    </div>
  );
}
