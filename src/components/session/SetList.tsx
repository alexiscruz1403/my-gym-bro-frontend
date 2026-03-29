'use client';

import { SetRow } from './SetRow';
import type { SessionExercise } from '@/types/domain.types';

interface SetListProps {
  exercise: SessionExercise;
  onCompleteSet: (setIndex: number, weight: number | undefined, reps: number | undefined) => void;
}

export function SetList({ exercise, onCompleteSet }: SetListProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: exercise.plannedSets }, (_, i) => {
        const logged = exercise.sets.find((s) => s.setIndex === i);
        return (
          <SetRow
            key={i}
            setIndex={i}
            plannedReps={exercise.plannedReps}
            plannedWeight={exercise.plannedWeight}
            loggedSet={logged}
            onComplete={onCompleteSet}
          />
        );
      })}
    </div>
  );
}
