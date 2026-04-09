'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVolumeByPeriod, getVolumeByMuscle } from '@/services/stats.service';
import { getCurrentPeriodDate } from '@/lib/stats-dates';
import type { StatsPeriod } from '@/types/domain.types';

export function useStats() {
  const [period, setPeriodState] = useState<StatsPeriod>('week');
  const [date, setDateState] = useState<string>(() => getCurrentPeriodDate('week'));

  const { data: volumeData, isLoading: volumeLoading, error: volumeError } = useQuery({
    queryKey: ['stats', 'volume', period, date],
    queryFn: () => getVolumeByPeriod({ period, date }),
  });

  const { data: muscleData, isLoading: muscleLoading, error: muscleError } = useQuery({
    queryKey: ['stats', 'muscle', period, date],
    queryFn: () => getVolumeByMuscle({ period, date }),
  });

  const setPeriod = useCallback((p: StatsPeriod) => {
    const newDate = getCurrentPeriodDate(p);
    setPeriodState(p);
    setDateState(newDate);
  }, []);

  const setDate = useCallback((d: string) => {
    setDateState(d);
  }, []);

  return {
    period,
    date,
    setPeriod,
    setDate,
    volumeData: volumeData ?? null,
    muscleData: muscleData ?? null,
    loading: volumeLoading || muscleLoading,
    error: volumeError || muscleError ? 'Failed to load stats' : null,
  };
}
