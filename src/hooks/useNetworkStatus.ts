'use client';

import { useState, useEffect } from 'react';
import useOfflineStore from '@/store/offline.store';

export function useNetworkStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof window !== 'undefined' ? navigator.onLine : true,
  );
  const setStoreOnline = useOfflineStore((s) => s.setOnline);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setStoreOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
      setStoreOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setStoreOnline]);

  return isOnline;
}
