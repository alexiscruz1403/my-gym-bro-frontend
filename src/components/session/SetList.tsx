'use client';

import { SetRow } from './SetRow';
import { DurationSetRow } from './DurationSetRow';
import type { SessionExercise } from '@/types/domain.types';

interface SetListProps {
  exercise: SessionExercise;
  onCompleteSet: (setIndex: number, weight: number | undefined, reps: number | undefined, duration?: number) => void;
  onUncompleteSet: (setIndex: number, weight: number | undefined, reps: number | undefined) => void;
}

export function SetList({ exercise, onCompleteSet, onUncompleteSet }: SetListProps) {
  const isDuration = exercise.trackingType === 'duration';

  return (
    <div className="space-y-2">
      {Array.from({ length: exercise.plannedSets }, (_, i) => {
        const logged = exercise.sets.find((s) => s.setIndex === i);

        if (isDuration) {
          return (
            <DurationSetRow
              key={`${exercise.exerciseId}-${i}`}
              setIndex={i}
              plannedDuration={exercise.plannedDuration ?? 30}
              loggedSet={logged}
              onComplete={(setIndex, weight, reps, duration) =>
                onCompleteSet(setIndex, weight, reps, duration)
              }
            />
          );
        }

        return (
          <SetRow
            key={`${exercise.exerciseId}-${i}`}
            setIndex={i}
            plannedReps={exercise.plannedReps}
            plannedWeight={exercise.plannedWeight}
            loggedSet={logged}
            onComplete={onCompleteSet}
            onUncomplete={onUncompleteSet}
          />
        );
      })}
    </div>
  );
}
