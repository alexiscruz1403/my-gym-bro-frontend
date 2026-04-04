'use client';

import { useProfile } from '@/hooks/useProfile';

export function UserLoader() {
  useProfile();
  return null;
}
