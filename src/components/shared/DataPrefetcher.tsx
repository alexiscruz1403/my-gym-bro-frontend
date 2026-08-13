'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/db';
import { getPlans, getActivePlan } from '@/services/workout-plans.service';
import { getExercises } from '@/services/exercises.service';
import { getSessionHistory } from '@/services/stats.service';
import { getVolumeByPeriod, getVolumeByMuscle } from '@/services/stats.service';
import { getMuscleRanks } from '@/services/ranks.service';
import { usersService } from '@/services/users.service';

async function fetchAllPages<T>(
  fetcher: (page: number) => Promise<{ data: T[]; totalPages: number }>,
  storeItems: (items: T[]) => Promise<unknown>,
): Promise<void> {
  let page = 1;
  while (true) {
    const response = await fetcher(page);
    await storeItems(response.data);
    if (page >= response.totalPages || response.data.length === 0) break;
    page++;
  }
}

async function prefetchAll(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  await Promise.allSettled([
    getPlans(),
    getActivePlan(),

    fetchAllPages(
      (page) =>
        getExercises({ page, limit: 50 }).then((r) => ({
          data: r.data,
          totalPages: Math.ceil(r.total / 50),
        })),
      (items) => db.exercises.bulkPut(items),
    ),

    fetchAllPages(
      (page) =>
        getSessionHistory({ page, limit: 20 }).then((r) => ({
          data: r.data,
          totalPages: r.meta.totalPages,
        })),
      (items) => db.sessionHistory.bulkPut(items),
    ),

    getVolumeByPeriod({ period: 'week', date: today }),
    getVolumeByMuscle({ period: 'week', date: today }),

    getMuscleRanks(),

    usersService.getMe(),
  ]);
}

export function DataPrefetcher() {
  const hasPrefetched = useRef(false);

  useEffect(() => {
    if (hasPrefetched.current || !navigator.onLine) return;
    hasPrefetched.current = true;
    prefetchAll().catch(() => {
    });
  }, []);

  return null;
}
