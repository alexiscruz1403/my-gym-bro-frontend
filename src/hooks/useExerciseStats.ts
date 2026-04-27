'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExerciseVolume } from '@/services/stats.service';
import { getCurrentPeriodDate } from '@/lib/stats-dates';
import type { StatsPeriod } from '@/types/domain.types';

export type WeightUnit = 'kg' | 'lbs';

export function useExerciseStats(exerciseId: string) {
  const [period, setPeriodState] = useState<StatsPeriod>('week');
  const [date, setDateState] = useState<string>(() => getCurrentPeriodDate('week'));
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');

  const { data: volumeData, isLoading: loading, error } = useQuery({
    queryKey: ['stats', 'exercise', exerciseId, period, date],
    queryFn: () => getExerciseVolume(exerciseId, { period, date }),
    enabled: !!exerciseId,
  });

  const setPeriod = useCallback((p: StatsPeriod) => {
    setPeriodState(p);
    setDateState(getCurrentPeriodDate(p));
  }, []);

  const setDate = useCallback((d: string) => {
    setDateState(d);
  }, []);

  const convertVolume = useCallback((kg: number) => {
    return weightUnit === 'lbs' ? Math.round(kg * 2.20462 * 100) / 100 : kg;
  }, [weightUnit]);

  return {
    period,
    date,
    setPeriod,
    setDate,
    volumeData: volumeData ?? null,
    loading,
    error: error ? 'Error al cargar las estadísticas' : null,
    weightUnit,
    setWeightUnit,
    convertVolume,
  };
}
