import { create } from 'zustand';

interface OfflineState {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncAt: string | null;
  syncError: string | null;
}

interface OfflineActions {
  setOnline: (isOnline: boolean) => void;
  setPendingCount: (count: number) => void;
  setIsSyncing: (syncing: boolean) => void;
  setSyncError: (error: string | null) => void;
  markSynced: () => void;
}

const useOfflineStore = create<OfflineState & OfflineActions>((set) => ({
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingCount: 0,
  isSyncing: false,
  lastSyncAt: null,
  syncError: null,

  setOnline: (isOnline) => set({ isOnline }),
  setPendingCount: (count) => set({ pendingCount: count }),
  setIsSyncing: (syncing) => set({ isSyncing: syncing }),
  setSyncError: (error) => set({ syncError: error }),
  markSynced: () =>
    set({ lastSyncAt: new Date().toISOString(), syncError: null, pendingCount: 0 }),
}));

export default useOfflineStore;
