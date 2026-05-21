'use client';

import { useTranslation } from 'react-i18next';
import { SessionDetailExerciseCard } from '@/components/history/SessionDetailExerciseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { SessionExercise } from '@/types/domain.types';

interface SessionDetailExerciseListProps {
  exercises: SessionExercise[];
}

export function SessionDetailExerciseList({ exercises }: SessionDetailExerciseListProps) {
  const { t } = useTranslation();

  if (exercises.length === 0) {
    return (
      <EmptyState
        title={t('history.noExercisesTitle')}
        description={t('history.noExercisesDescription')}
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
