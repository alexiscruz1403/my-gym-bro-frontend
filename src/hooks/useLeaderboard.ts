'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/services/ranks.service';
import type { MuscleGroup } from '@/types/domain.types';

export function useLeaderboard() {
  const [selectedMuscle, setSelectedMuscleState] = useState<MuscleGroup | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['ranks', 'leaderboard', selectedMuscle, page],
    queryFn: () => getLeaderboard({ muscle: selectedMuscle, page, limit: 20 }),
  });

  const setSelectedMuscle = useCallback((muscle: MuscleGroup | undefined) => {
    setSelectedMuscleState(muscle);
    setPage(1);
  }, []);

  return {
    data: data ?? null,
    isLoading,
    error: error ? 'No se pudo cargar el leaderboard' : null,
    selectedMuscle,
    setSelectedMuscle,
    page,
    setPage,
  };
}
