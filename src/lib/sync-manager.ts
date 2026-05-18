import { queryClient } from './query-client';
import { apiClient } from './axios';
import { db } from './db';
import { getPendingMutations, dequeue, markFailed, getPendingCount } from './offline-queue';
import { setMapping, resolveIds, resolvePayload } from './id-reconciler';
import useOfflineStore from '@/store/offline.store';
import type { WorkoutPlan, WorkoutSession, UserResponse, FinishSessionResponse } from '@/types/domain.types';

// Normalize server response to a resource with a primary key
function extractId(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) return null;
  const obj = data as Record<string, unknown>;
  return (obj.id as string) ?? (obj._id as string) ?? null;
}

// Update IndexedDB after a successful sync, replacing temp data with server data
async function applyServerResponse(type: string, tempId: string | undefined, responseData: unknown): Promise<void> {
  if (!tempId) return;

  switch (type) {
    case 'CREATE_PLAN': {
      const plan = responseData as WorkoutPlan;
      await db.plans.delete(tempId);
      await db.plans.put(plan);
      break;
    }
    case 'START_SESSION': {
      const session = responseData as WorkoutSession;
      await db.activeSession.delete(tempId);
      await db.activeSession.put(session);
      break;
    }
    case 'UPDATE_PLAN': {
      await db.plans.put(responseData as WorkoutPlan);
      break;
    }
    case 'UPDATE_PROFILE':
    case 'UPDATE_PHYSICAL_DATA': {
      await db.userProfile.put(responseData as UserResponse);
      break;
    }
    case 'FINISH_SESSION':
    case 'SYNC_SESSION': {
      const result = responseData as FinishSessionResponse;
      await db.activeSession.clear();
      if (result?.session) {
        await db.sessionDetails.put(result.session);
      }
      break;
    }
    default:
      break;
  }
}

let isSyncRunning = false;

export async function syncAll(): Promise<void> {
  // Prevent concurrent sync runs
  if (isSyncRunning) return;
  isSyncRunning = true;

  const { setIsSyncing, setSyncError, markSynced, setPendingCount } = useOfflineStore.getState();

  const pending = await getPendingMutations();
  if (pending.length === 0) {
    markSynced();
    isSyncRunning = false;
    return;
  }

  setIsSyncing(true);
  setSyncError(null);

  try {
    for (const mutation of pending) {
      // Resolve any offline_ IDs embedded in the URL and payload
      const resolvedUrl = await resolveIds(mutation.url);
      const resolvedPayload = mutation.payload
        ? await resolvePayload(mutation.payload)
        : undefined;

      let response;
      try {
        response = await apiClient.request({
          method: mutation.method,
          url: resolvedUrl,
          data: resolvedPayload,
          headers: { 'X-Idempotency-Key': mutation.id },
        });
      } catch {
        await markFailed(mutation.id);
        const count = await getPendingCount();
        setPendingCount(count);
        setSyncError('Sync failed — will retry when connection improves.');
        return;
      }

      // If this mutation created a resource, store the temp → real ID mapping
      if (mutation.tempId) {
        const realId = extractId(response.data);
        if (realId) {
          await setMapping(mutation.tempId, realId);
          await applyServerResponse(mutation.type, mutation.tempId, response.data);
        }
      } else if (mutation.type === 'FINISH_SESSION' || mutation.type === 'SYNC_SESSION') {
        await applyServerResponse(mutation.type, mutation.tempId, response.data);
      } else if (mutation.type === 'UPDATE_PLAN') {
        await applyServerResponse(mutation.type, mutation.tempId, response.data);
      } else if (mutation.type === 'UPDATE_PROFILE' || mutation.type === 'UPDATE_PHYSICAL_DATA') {
        await applyServerResponse(mutation.type, mutation.tempId, response.data);
      }

      await dequeue(mutation.id);

      const remaining = await getPendingCount();
      setPendingCount(remaining);
    }

    // Invalidate all React Query caches so UI shows fresh server data
    await queryClient.invalidateQueries();
    markSynced();
  } catch {
    setSyncError('Sync failed unexpectedly.');
  } finally {
    setIsSyncing(false);
    isSyncRunning = false;
  }
}
