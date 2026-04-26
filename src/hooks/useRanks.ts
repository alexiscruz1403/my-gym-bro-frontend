'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMuscleRanks } from '@/services/ranks.service';
import type { MuscleGroup, MuscleRankItem } from '@/types/domain.types';

export function useRanks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ranks', 'muscles'],
    queryFn: () => getMuscleRanks(),
  });

  const rankMap = useMemo(() => {
    const map = new Map<MuscleGroup, MuscleRankItem>();
    if (data) {
      for (const item of data) {
        map.set(item.muscle, item);
      }
    }
    return map;
  }, [data]);

  return {
    data: data ?? [],
    rankMap,
    isLoading,
    error: error ? 'No se pudieron cargar los rangos' : null,
  };
}
