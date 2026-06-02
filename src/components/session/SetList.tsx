'use client';

import { SetRow, type SetCompletePayload } from './SetRow';
import { DurationSetRow } from './DurationSetRow';
import type { SessionExercise } from '@/types/domain.types';

interface SetListProps {
  exercise: SessionExercise;
  onCompleteSet: (setIndex: number, payload: SetCompletePayload & { duration?: number }) => void;
  onUncompleteSet: (setIndex: number, payload: SetCompletePayload) => void;
  onChangePlannedDuration?: (seconds: number) => void;
}

export function SetList({ exercise, onCompleteSet, onUncompleteSet, onChangePlannedDuration }: SetListProps) {
  const isDuration = exercise.trackingType === 'duration';
  const weightUnit = exercise.weightUnit ?? 'kg';
  const bilateral = exercise.bilateral !== false;

  return (
    <div className="space-y-2">
      {Array.from({ length: exercise.plannedSets }, (_, i) => {
        const logged = exercise.sets.find((s) => s.setIndex === i);

        if (isDuration) {
          return (
            <DurationSetRow
              key={`${exercise.exerciseId}-${i}`}
              setIndex={i}
              bilateral={bilateral}
              plannedDuration={exercise.plannedDuration ?? 30}
              plannedLeft={exercise.plannedLeft}
              plannedRight={exercise.plannedRight}
              loggedSet={logged}
              onComplete={onCompleteSet}
              onChangeDuration={onChangePlannedDuration}
            />
          );
        }

        return (
          <SetRow
            key={`${exercise.exerciseId}-${i}`}
            exerciseId={exercise.exerciseId}
            setIndex={i}
            bilateral={bilateral}
            plannedReps={exercise.plannedReps}
            plannedWeight={exercise.plannedWeight}
            plannedLeft={exercise.plannedLeft}
            plannedRight={exercise.plannedRight}
            weightUnit={weightUnit}
            loggedSet={logged}
            onComplete={onCompleteSet}
            onUncomplete={onUncompleteSet}
          />
        );
      })}
    </div>
  );
}
