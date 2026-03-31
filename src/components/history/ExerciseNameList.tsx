import type { SessionHistoryExercise } from '@/types/domain.types';

interface ExerciseNameListProps {
  exercises: SessionHistoryExercise[];
}

export function ExerciseNameList({ exercises }: ExerciseNameListProps) {
  return (
    <ul className="flex flex-col gap-0.5">
      {exercises.map((exercise) => (
        <li
          key={exercise.exerciseName}
          className="flex items-center justify-between text-sm text-muted-foreground"
        >
          <span className="truncate">{exercise.exerciseName}</span>
          <span className="ml-2 shrink-0 tabular-nums">
            {exercise.completedSets}/{exercise.plannedSets}
          </span>
        </li>
      ))}
    </ul>
  );
}
