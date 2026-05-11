'use client';

import { useQuery } from '@tanstack/react-query';
import { getStreak } from '@/services/streaks.service';

export function useStreak() {
  const { data, isLoading } = useQuery({
    queryKey: ['streaks', 'me'],
    queryFn: getStreak,
    staleTime: 1000 * 60 * 5,
  });

  return {
    currentStreak: data?.currentStreak ?? 0,
    longestStreak: data?.longestStreak ?? 0,
    lastActivityDate: data?.lastActivityDate ?? null,
    loading: isLoading,
  };
}
