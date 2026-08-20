import type { Page } from '@playwright/test';

const DB_NAME = 'my-gym-bro-offline';

/**
 * Reads the pending-mutations count straight out of the app's Dexie/IndexedDB
 * database (src/lib/db.ts). This is the source of truth the offline queue
 * (src/lib/offline-queue.ts) writes to, independent of whatever the UI badge
 * happens to render.
 */
export async function getMutationQueueCount(page: Page): Promise<number> {
  return page.evaluate((dbName) => {
    return new Promise<number>((resolve, reject) => {
      const openRequest = indexedDB.open(dbName);
      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onsuccess = () => {
        const db = openRequest.result;
        if (!db.objectStoreNames.contains('mutationQueue')) {
          db.close();
          resolve(0);
          return;
        }
        const tx = db.transaction('mutationQueue', 'readonly');
        const countRequest = tx.objectStore('mutationQueue').count();
        countRequest.onsuccess = () => {
          db.close();
          resolve(countRequest.result);
        };
        countRequest.onerror = () => {
          db.close();
          reject(countRequest.error);
        };
      };
    });
  }, DB_NAME);
}
