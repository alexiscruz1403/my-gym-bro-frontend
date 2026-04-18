'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExercises } from '@/hooks/useExercises';
import { ExerciseFilters, type ExerciseFiltersValue } from './ExerciseFilters';
import { ExerciseCard } from './ExerciseCard';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import type { Exercise, MuscleGroup, LoadType } from '@/types/domain.types';

interface ExerciseCatalogBrowseProps {
  mode: 'browse';
}

interface ExerciseCatalogPickerProps {
  mode: 'picker';
  singleSelect?: boolean;
  onConfirm: (exercises: Exercise[]) => void;
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
  const [selected, setSelected] = useState<Exercise[]>([]);

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

  const singleSelect = props.mode === 'picker' && props.singleSelect === true;

  const handleToggle = (exercise: Exercise) => {
    if (singleSelect) {
      setSelected([exercise]);
      return;
    }
    setSelected((prev) =>
      prev.some((e) => e.id === exercise.id)
        ? prev.filter((e) => e.id !== exercise.id)
        : [...prev, exercise],
    );
  };

  const handleConfirm = () => {
    if (props.mode === 'picker' && selected.length > 0) {
      props.onConfirm(selected);
      setSelected([]);
    }
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
                    selected={selected.some((e) => e.id === exercise.id)}
                    onToggle={handleToggle}
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

      {props.mode === 'picker' && (
        <div className="sticky bottom-0 bg-background pt-2 pb-1">
          <Button
            className="w-full cursor-pointer"
            disabled={selected.length === 0}
            onClick={handleConfirm}
            type="button"
            tabIndex={0}
          >
            {singleSelect
              ? selected.length > 0
                ? `Select ${selected[0].name}`
                : 'Select an exercise'
              : selected.length > 0
                ? `Add ${selected.length} exercise${selected.length > 1 ? 's' : ''}`
                : 'Select exercises'}
          </Button>
        </div>
      )}
    </div>
  );
}
