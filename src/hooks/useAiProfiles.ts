'use client';

import { useQuery } from '@tanstack/react-query';
import { getAiProfiles } from '@/services/ai.service';

export function useAiProfiles() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ai-profiles'],
    queryFn: getAiProfiles,
  });

  return {
    profiles: data ?? [],
    loading: isLoading,
    error: error ? 'Failed to load AI profiles' : null,
  };
}
