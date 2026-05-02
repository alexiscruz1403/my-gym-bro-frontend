'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Plus, Minus, ArrowLeftRight } from 'lucide-react';
import { SetList } from './SetList';
import { LastPerformanceRow } from './LastPerformanceRow';
import { ReplaceExerciseSheet } from './ReplaceExerciseSheet';
import { useRestTimer } from '@/hooks/useRestTimer';
import { toast } from 'sonner';
import type { SessionExercise, Exercise } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest, ReplaceExerciseRequest } from '@/types/api.types';
import type { SetCompletePayload } from './SetRow';
import { formatSide, isUnilateral } from '@/lib/set-format';

interface ExerciseSessionCardProps {
  exercise: SessionExercise;
  onLogSet: (dto: LogSetRequest) => Promise<void>;
  onModify: (exerciseId: string, dto: ModifyExerciseRequest) => Promise<void>;
  onReplace: (exerciseId: string, dto: ReplaceExerciseRequest) => Promise<void>;
  onExerciseCompleted?: () => void;
}

export function ExerciseSessionCard({ exercise, onLogSet, onModify, onReplace, onExerciseCompleted }: ExerciseSessionCardProps) {
  const { start: startTimer } = useRestTimer();
  const [replaceOpen, setReplaceOpen] = useState(false);

  const unilateral = isUnilateral(exercise);

  const handleReplaceSelect = async (newExercise: Exercise) => {
    try {
      const payload: ReplaceExerciseRequest = {
        newExerciseId: newExercise.id,
        plannedSets: exercise.plannedSets,
        plannedRest: exercise.plannedRest,
      };
      if (newExercise.bilateral === false) {
        payload.plannedLeft = { reps: exercise.plannedReps ?? 10 };
        payload.plannedRight = { reps: exercise.plannedReps ?? 10 };
      } else {
        payload.plannedReps = exercise.plannedReps;
        payload.plannedDuration = exercise.plannedDuration;
        payload.plannedWeight = exercise.plannedWeight;
      }
      await onReplace(exercise.exerciseId, payload);
    } catch {
      toast.error('Failed to replace exercise. Please try again.');
    }
  };

  const handleCompleteSet = (
    setIndex: number,
    payload: SetCompletePayload & { duration?: number },
  ) => {
    // Start timer and advance exercise immediately for a fluid UX,
    // then fire the API call in the background.
    startTimer(exercise.plannedRest, exercise.exerciseId);

    const newCompletedCount = exercise.sets.filter((s) => s.completed).length + 1;
    if (newCompletedCount >= exercise.plannedSets) {
      onExerciseCompleted?.();
    }

    onLogSet({
      exerciseId: exercise.exerciseId,
      setIndex,
      weight: payload.weight,
      reps: payload.reps,
      duration: payload.duration,
      left: payload.left,
      right: payload.right,
      completed: true,
    }).catch(() => {
      toast.error('Failed to save set. Please try again.');
    });
  };

  const handleUncompleteSet = async (
    setIndex: number,
    payload: SetCompletePayload,
  ) => {
    try {
      await onLogSet({
        exerciseId: exercise.exerciseId,
        setIndex,
        weight: payload.weight,
        reps: payload.reps,
        left: payload.left,
        right: payload.right,
        completed: false,
      });
    } catch {
      toast.error('Failed to undo set. Please try again.');
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
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setReplaceOpen(true)}
            className="h-11 w-11 shrink-0 cursor-pointer"
            aria-label="Replace exercise"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weight unit toggle */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">Unit:</span>
        {(['kg', 'lbs'] as const).map((unit) => (
          <button
            key={unit}
            type="button"
            onClick={() => onModify(exercise.exerciseId, { weightUnit: unit })}
            className={`cursor-pointer rounded border px-2 py-0.5 text-xs transition-colors ${
              (exercise.weightUnit ?? 'kg') === unit
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {unit}
          </button>
        ))}
      </div>

      {/* Last performance */}
      {exercise.lastPerformance && exercise.lastPerformance.length > 0 && (
        <LastPerformanceRow sets={exercise.lastPerformance} plannedSets={exercise.plannedSets} />
      )}

      {/* Sets */}
      <SetList exercise={exercise} onCompleteSet={handleCompleteSet} onUncompleteSet={handleUncompleteSet} />

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
            className="h-11 w-11 cursor-pointer"
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
            className="h-11 w-11 cursor-pointer"
            aria-label="Add set"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ReplaceExerciseSheet
        open={replaceOpen}
        onOpenChange={setReplaceOpen}
        onSelect={handleReplaceSelect}
      />
    </div>
  );
}
