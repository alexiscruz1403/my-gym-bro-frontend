import { v4 as uuid } from 'uuid';
import { db, type QueuedMutation, type MutationType } from './db';

type EnqueueInput = Omit<QueuedMutation, 'id' | 'timestamp' | 'retries' | 'status'>;

export async function enqueue(mutation: EnqueueInput): Promise<void> {
  await db.mutationQueue.add({
    ...mutation,
    id: uuid(),
    timestamp: Date.now(),
    retries: 0,
    status: 'pending',
  });
}

export async function dequeue(id: string): Promise<void> {
  await db.mutationQueue.delete(id);
}

export async function getPendingMutations(): Promise<QueuedMutation[]> {
  return db.mutationQueue
    .where('status')
    .anyOf(['pending', 'failed'])
    .sortBy('timestamp');
}

export async function markFailed(id: string): Promise<void> {
  const mutation = await db.mutationQueue.get(id);
  if (!mutation) return;
  await db.mutationQueue.update(id, {
    status: 'failed',
    retries: mutation.retries + 1,
  });
}

export async function getPendingCount(): Promise<number> {
  return db.mutationQueue.where('status').anyOf(['pending', 'failed']).count();
}

// Remove all queue entries belonging to a given offline session:
// - the START_SESSION entry (tempId === sessionTempId)
// - LOG_SET / MODIFY_EXERCISE / REPLACE_EXERCISE entries (url contains sessionTempId)
export async function dequeueBySessionTempId(sessionTempId: string): Promise<void> {
  const all = await db.mutationQueue.toArray();
  const toDelete = all
    .filter((m) => m.tempId === sessionTempId || m.url.includes(sessionTempId))
    .map((m) => m.id);
  if (toDelete.length > 0) {
    await db.mutationQueue.bulkDelete(toDelete);
  }
}

export type { MutationType, QueuedMutation };
