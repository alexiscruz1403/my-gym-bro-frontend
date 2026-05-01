'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getExercises, createExercise, updateExercise, deleteExercise } from '@/services/exercises.service';
import type { Exercise, MuscleGroup } from '@/types/domain.types';

export function useAdminExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState<MuscleGroup | ''>('');

  const fetchPage = useCallback(
    (targetPage: number, overrides?: { nameSearch?: string; primaryMuscle?: MuscleGroup | '' }) => {
      const name = overrides?.nameSearch ?? nameSearch;
      const muscle = overrides?.primaryMuscle ?? primaryMuscle;
      setIsLoading(true);
      getExercises({
        page: targetPage,
        limit: 20,
        search: name || undefined,
        muscle: (muscle as MuscleGroup) || undefined,
      })
        .then(({ data, total: t }) => {
          setExercises(data);
          setTotal(t);
          setPage(targetPage);
        })
        .catch(() => toast.error('Failed to load exercises.'))
        .finally(() => setIsLoading(false));
    },
    [nameSearch, primaryMuscle],
  );

  const handleNameSearch = (q: string) => {
    setNameSearch(q);
    fetchPage(1, { nameSearch: q });
  };

  const handleMuscleFilter = (m: MuscleGroup | '') => {
    setPrimaryMuscle(m);
    fetchPage(1, { primaryMuscle: m });
  };

  const create = async (formData: FormData) => {
    const created = await createExercise(formData);
    setExercises((prev) => [created, ...prev]);
    setTotal((t) => t + 1);
  };

  const update = async (id: string, formData: FormData) => {
    const updated = await updateExercise(id, formData);
    setExercises((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const remove = async (id: string) => {
    await deleteExercise(id);
    setExercises((prev) => prev.filter((e) => e.id !== id));
    setTotal((t) => t - 1);
  };

  return {
    exercises,
    total,
    page,
    isLoading,
    nameSearch,
    primaryMuscle,
    fetchPage,
    handleNameSearch,
    handleMuscleFilter,
    create,
    update,
    remove,
  };
}
