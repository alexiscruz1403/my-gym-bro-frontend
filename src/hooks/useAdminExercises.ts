'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { getExercises, createExercise, updateExercise, deleteExercise } from '@/services/exercises.service';
import type { Exercise } from '@/types/domain.types';

export function useAdminExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = useCallback((targetPage: number) => {
    setIsLoading(true);
    getExercises({ page: targetPage, limit: 20 })
      .then(({ data, total: t }) => {
        setExercises(data);
        setTotal(t);
        setPage(targetPage);
      })
      .catch(() => toast.error('Failed to load exercises.'))
      .finally(() => setIsLoading(false));
  }, []);

  const create = async (dto: Partial<Exercise>) => {
    const created = await createExercise(dto);
    setExercises((prev) => [created, ...prev]);
    setTotal((t) => t + 1);
  };

  const update = async (id: string, dto: Partial<Exercise>) => {
    const updated = await updateExercise(id, dto);
    setExercises((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const remove = async (id: string) => {
    await deleteExercise(id);
    setExercises((prev) => prev.filter((e) => e.id !== id));
    setTotal((t) => t - 1);
  };

  return { exercises, total, page, isLoading, fetchPage, create, update, remove };
}
