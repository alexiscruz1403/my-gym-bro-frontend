'use client';

import { useProfile } from '@/hooks/useProfile';
import { DataPrefetcher } from '@/components/shared/DataPrefetcher';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export function UserLoader() {
  useProfile();
  useOfflineSync();
  return <DataPrefetcher />;
}
