'use client';

import { useState, useEffect } from 'react';
import { getExercise } from '@/services/exercises.service';
import type { Exercise } from '@/types/domain.types';

export function useExercise(id: string) {
  const [data, setData] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getExercise(id)
      .then(setData)
      .catch(() => setError('Failed to load exercise'))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
