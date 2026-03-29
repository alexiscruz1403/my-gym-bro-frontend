'use client';

import { useState, useEffect, useRef } from 'react';
import { getExercises } from '@/services/exercises.service';
import type { ExerciseListParams, ExerciseListResponse } from '@/types/api.types';

const DEBOUNCE_MS = 300;

export function useExercises(params: ExerciseListParams = {}) {
  const [data, setData] = useState<ExerciseListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { search, muscle, loadType, page = 1, limit = 20 } = params;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getExercises({ search, muscle, loadType, page, limit });
        setData(result);
      } catch {
        setError('Failed to load exercises');
      } finally {
        setLoading(false);
      }
    }, search !== undefined ? DEBOUNCE_MS : 0);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, muscle, loadType, page, limit]);

  return { data, loading, error };
}
