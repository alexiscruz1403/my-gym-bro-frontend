import { SessionDetailExerciseCard } from '@/components/history/SessionDetailExerciseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { SessionExercise } from '@/types/domain.types';

interface SessionDetailExerciseListProps {
  exercises: SessionExercise[];
}

export function SessionDetailExerciseList({ exercises }: SessionDetailExerciseListProps) {
  if (exercises.length === 0) {
    return (
      <EmptyState
        title="Sin ejercicios registrados"
        description="Esta sesión no tiene ejercicios guardados."
      />
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <SessionDetailExerciseCard key={exercise.exerciseId} exercise={exercise} />
      ))}
    </div>
  );
}
