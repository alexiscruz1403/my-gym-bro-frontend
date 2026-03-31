'use client';

import { useState, useEffect, useCallback } from 'react';
import { getVolumeByPeriod, getVolumeByMuscle } from '@/services/stats.service';
import { getCurrentPeriodDate } from '@/lib/stats-dates';
import type { StatsPeriod, VolumeByPeriodResponse, VolumeByMuscleResponse } from '@/types/domain.types';

export function useStats() {
  const [period, setPeriodState] = useState<StatsPeriod>('week');
  const [date, setDateState] = useState<string>(() => getCurrentPeriodDate('week'));
  const [volumeData, setVolumeData] = useState<VolumeByPeriodResponse | null>(null);
  const [muscleData, setMuscleData] = useState<VolumeByMuscleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (p: StatsPeriod, d: string) => {
    setLoading(true);
    setError(null);
    try {
      const [volume, muscle] = await Promise.all([
        getVolumeByPeriod({ period: p, date: d }),
        getVolumeByMuscle({ period: p, date: d }),
      ]);
      setVolumeData(volume);
      setMuscleData(muscle);
    } catch {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(period, date); }, [fetch, period, date]);

  const setPeriod = useCallback((p: StatsPeriod) => {
    const newDate = getCurrentPeriodDate(p);
    setPeriodState(p);
    setDateState(newDate);
  }, []);

  const setDate = useCallback((d: string) => {
    setDateState(d);
  }, []);

  return { period, date, setPeriod, setDate, volumeData, muscleData, loading, error };
}
