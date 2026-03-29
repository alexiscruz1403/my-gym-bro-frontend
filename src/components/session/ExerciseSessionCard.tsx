'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings2, Link } from 'lucide-react';
import { SetList } from './SetList';
import { LastPerformanceRow } from './LastPerformanceRow';
import { RestTimer } from './RestTimer';
import { ModifyExerciseSheet } from './ModifyExerciseSheet';
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
  const [modifyOpen, setModifyOpen] = useState(false);
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

  return (
    <div className="space-y-4 px-4 py-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
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
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setModifyOpen(true)}
          className="h-10 w-10 shrink-0 cursor-pointer"
          aria-label="Modify exercise"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Last performance */}
      {exercise.lastPerformance && exercise.lastPerformance.length > 0 && (
        <LastPerformanceRow sets={exercise.lastPerformance} />
      )}

      {/* Sets */}
      <SetList exercise={exercise} onCompleteSet={handleCompleteSet} />

      {/* Rest timer */}
      <RestTimer exerciseId={exercise.exerciseId} />

      {/* Modify sheet */}
      <ModifyExerciseSheet
        open={modifyOpen}
        onOpenChange={setModifyOpen}
        exercise={exercise}
        onSave={onModify}
      />
    </div>
  );
}
