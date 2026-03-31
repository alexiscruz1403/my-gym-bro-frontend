import { SessionDetailExerciseCard } from '@/components/history/SessionDetailExerciseCard';
import type { SessionExercise } from '@/types/domain.types';

interface SessionDetailExerciseListProps {
  exercises: SessionExercise[];
}

export function SessionDetailExerciseList({ exercises }: SessionDetailExerciseListProps) {
  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <SessionDetailExerciseCard key={exercise.exerciseId} exercise={exercise} />
      ))}
    </div>
  );
}
