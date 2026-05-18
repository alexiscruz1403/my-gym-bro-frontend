'use client';

import { WifiOff } from 'lucide-react';
import useOfflineStore from '@/store/offline.store';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  // useNetworkStatus keeps the store in sync; we read the value from the store
  useNetworkStatus();
  const isOnline = useOfflineStore((s) => s.isOnline);

  if (isOnline) return null;

  return (
    <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center gap-2 text-destructive text-sm">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>Sin conexión — los cambios se guardarán localmente y se sincronizarán al reconectarte.</span>
    </div>
  );
}
