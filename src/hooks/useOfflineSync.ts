'use client';

import { useEffect } from 'react';
import { syncAll } from '@/lib/sync-manager';
import { getPendingCount } from '@/lib/offline-queue';
import useOfflineStore from '@/store/offline.store';
import { useNetworkStatus } from './useNetworkStatus';

export function useOfflineSync() {
  const isOnline = useNetworkStatus();
  const { setPendingCount, isSyncing, pendingCount, lastSyncAt, syncError } = useOfflineStore();

  // Refresh pending count on mount
  useEffect(() => {
    getPendingCount().then(setPendingCount);
  }, [setPendingCount]);

  // Trigger sync whenever we go back online
  useEffect(() => {
    if (!isOnline) return;
    getPendingCount().then((count) => {
      setPendingCount(count);
      if (count > 0) syncAll();
    });
  }, [isOnline, setPendingCount]);

  return { isOnline, isSyncing, pendingCount, lastSyncAt, syncError };
}
