'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVolumeByPeriod, getVolumeByMuscle } from '@/services/stats.service';
import { getCurrentPeriodDate } from '@/lib/stats-dates';
import type { StatsPeriod } from '@/types/domain.types';

export type WeightUnit = 'kg' | 'lbs';

export function useStats() {
  const [period, setPeriodState] = useState<StatsPeriod>('week');
  const [date, setDateState] = useState<string>(() => getCurrentPeriodDate('week'));
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

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

  const convertVolume = useCallback((kg: number) => {
    return weightUnit === 'lbs' ? Math.round(kg * 2.20462 * 100) / 100 : kg;
  }, [weightUnit]);

  const hasLbsExercises = useMemo(
    () => volumeData?.hasLbsExercises || muscleData?.hasLbsExercises || false,
    [volumeData, muscleData],
  );

  return {
    period,
    date,
    setPeriod,
    setDate,
    volumeData: volumeData ?? null,
    muscleData: muscleData ?? null,
    loading: volumeLoading || muscleLoading,
    error: volumeError || muscleError ? 'Failed to load stats' : null,
    weightUnit,
    setWeightUnit,
    convertVolume,
    hasLbsExercises,
  };
}
