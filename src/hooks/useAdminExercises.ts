'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { getAdminExercises, createExercise, updateExercise, deleteExercise } from '@/services/exercises.service';
import type { AdminExercise, MuscleGroup } from '@/types/domain.types';

export function useAdminExercises() {
  const [exercises, setExercises] = useState<AdminExercise[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [nameSearch, setNameSearch] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState<MuscleGroup | ''>('');

  const nameSearchRef = useRef('');
  const primaryMuscleRef = useRef<MuscleGroup | ''>('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchPage = useCallback(
    (targetPage: number, overrides?: { nameSearch?: string; primaryMuscle?: MuscleGroup | '' }) => {
      const name = overrides?.nameSearch ?? nameSearchRef.current;
      const muscle = overrides?.primaryMuscle ?? primaryMuscleRef.current;
      setIsLoading(true);
      getAdminExercises({
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
    [],
  );

  const handleNameSearch = (q: string) => {
    setNameSearch(q);
    nameSearchRef.current = q;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchPage(1, { nameSearch: q });
    }, 400);
  };

  const handleMuscleFilter = (m: MuscleGroup | '') => {
    setPrimaryMuscle(m);
    primaryMuscleRef.current = m;
    fetchPage(1, { primaryMuscle: m });
  };

  const create = async (formData: FormData) => {
    await createExercise(formData);
    fetchPage(page);
  };

  const update = async (id: string, formData: FormData) => {
    await updateExercise(id, formData);
    fetchPage(page);
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
