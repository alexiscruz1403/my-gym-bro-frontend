'use client';

import { Cloud, CloudOff, Loader2, CheckCircle2 } from 'lucide-react';
import useOfflineStore from '@/store/offline.store';

export function SyncStatusIndicator() {
  const { isOnline, isSyncing, pendingCount, syncError } = useOfflineStore();

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Offline">
        <CloudOff className="h-4 w-4" />
        {pendingCount > 0 && (
          <span className="bg-muted text-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
            {pendingCount}
          </span>
        )}
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        title="Syncing..."
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {pendingCount > 0 && (
          <span className="bg-muted text-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
            {pendingCount}
          </span>
        )}
      </div>
    );
  }

  if (syncError) {
    return (
      <div
        className="flex items-center gap-1.5 text-xs text-destructive"
        title={syncError}
      >
        <CloudOff className="h-4 w-4" />
        {pendingCount > 0 && (
          <span className="bg-destructive/10 text-destructive rounded-full px-1.5 py-0.5 text-[10px] font-medium">
            {pendingCount}
          </span>
        )}
      </div>
    );
  }

  if (pendingCount > 0) {
    return (
      <div
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
        title={`${pendingCount} pending changes`}
      >
        <Cloud className="h-4 w-4" />
        <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium">
          {pendingCount}
        </span>
      </div>
    );
  }

  // All synced — show nothing (no icon when online and synced)
  return null;
}
