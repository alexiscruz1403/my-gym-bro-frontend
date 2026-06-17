'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMuscleRecovery } from '@/services/recovery.service';
import type { MuscleGroup } from '@/types/domain.types';
import type { MuscleRecoveryItem, RecoveryMap } from '@/types/recovery.types';

export function useRecovery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recovery', 'muscles'],
    queryFn: getMuscleRecovery,
    staleTime: 1000 * 60 * 60,
  });

  const recoveryMap: RecoveryMap = useMemo(() => {
    const map = new Map<MuscleGroup, MuscleRecoveryItem>();
    data?.forEach((item) => map.set(item.muscle, item));
    return map;
  }, [data]);

  return { recoveryMap, isLoading, isError: !!error };
}
