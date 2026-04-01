'use client';

import { useState, useEffect } from 'react';
import { usersService } from '@/services/users.service';
import type { PublicUserProfile } from '@/types/domain.types';

export function usePublicProfile(userId: string) {
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    usersService
      .getPublicProfile(userId)
      .then((data) => setProfile(data))
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { profile, isLoading, error };
}
