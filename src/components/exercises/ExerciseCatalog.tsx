'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseFilters, type ExerciseFiltersValue } from './ExerciseFilters';
import { ExerciseCard } from './ExerciseCard';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Exercise, MuscleGroup, LoadType } from '@/types/domain.types';

interface ExerciseCatalogBrowseProps {
  mode: 'browse';
}

interface ExerciseCatalogPickerProps {
  mode: 'picker';
  onSelect: (exercise: Exercise) => void;
}

type ExerciseCatalogProps = ExerciseCatalogBrowseProps | ExerciseCatalogPickerProps;

const LIMIT = 15;

export function ExerciseCatalog(props: ExerciseCatalogProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<ExerciseFiltersValue>({
    search: '',
    muscle: undefined,
    loadType: undefined,
  });
  const [page, setPage] = useState(1);

  const { data, loading, error } = useExercises({
    search: filters.search || undefined,
    muscle: filters.muscle as MuscleGroup | undefined,
    loadType: filters.loadType as LoadType | undefined,
    page,
    limit: LIMIT,
  });

  const handleFilterChange = (next: ExerciseFiltersValue) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <ExerciseFilters value={filters} onChange={handleFilterChange} />

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <p className="text-destructive py-4 text-center text-sm">{error}</p>
      )}

      {!loading && !error && data && (
        <>
          {data.data.length === 0 ? (
            <EmptyState
              title="No exercises found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="flex flex-col gap-2">
              {data.data.map((exercise) =>
                props.mode === 'browse' ? (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    mode="browse"
                    onClick={() => router.push(`/workout/exercises/${exercise.id}`)}
                  />
                ) : (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    mode="picker"
                    onSelect={props.onSelect}
                  />
                ),
              )}
            </div>
          )}

          <Pagination
            page={page}
            total={data.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
