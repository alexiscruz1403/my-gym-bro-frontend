import { test, expect } from '@playwright/test';
import { createTestUser, registerUser } from './support/user';
import { createPlan } from './support/plan-wizard';
import { getMutationQueueCount } from './support/offline-db';

test('registrar una serie sin conexión la encola localmente y la sincroniza al reconectar', async ({
  page,
  context,
}) => {
  const user = createTestUser();
  await registerUser(page, user);

  await createPlan(page, { name: 'Plan Offline E2E', dayLabel: 'Lunes', exerciseCount: 1 });
  await page.getByRole('button', { name: 'Activar', exact: true }).click();
  await expect(page.getByText('Activo')).toBeVisible();

  // Start the session while online so the app caches it in IndexedDB
  // (src/services/sessions.service.ts persists every session, online or not).
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Iniciar entrenamiento', exact: true }).click();
  const sheet = page.locator('[data-slot="sheet-content"]');
  await sheet.getByText('Lunes', { exact: false }).first().click();
  await sheet.getByRole('button', { name: 'Iniciar entrenamiento' }).click();
  await page.waitForURL('**/session');

  await expect(page.getByRole('button', { name: 'Mark set as complete' }).first()).toBeVisible();
  expect(await getMutationQueueCount(page)).toBe(0);

  // Go offline without reloading — the SPA is already loaded, only the
  // network is cut (dev mode has no service worker to serve a fresh navigation).
  await context.setOffline(true);
  await expect(page.getByText(/Sin conexión/)).toBeVisible();

  await page.getByRole('button', { name: 'Mark set as complete' }).first().click();

  // Optimistic UI still marks the set as done, and the mutation lands in the
  // local queue instead of hitting the network (src/lib/offline-queue.ts).
  await expect(page.getByRole('button', { name: 'Undo set completion' }).first()).toBeVisible();
  await expect.poll(() => getMutationQueueCount(page)).toBe(1);
  // SyncStatusIndicator's pending badge only refreshes on mount and on
  // reconnect (useOfflineSync), not on every enqueue — so while still offline
  // it just shows the offline icon, without the count ticking up live yet.
  await expect(page.getByRole('banner').getByTitle('Offline')).toBeVisible();

  // Reconnect: the 'online' listener (useNetworkStatus) should trigger an
  // automatic sync (useOfflineSync -> syncAll) without any user action.
  await context.setOffline(false);
  await expect(page.getByText(/Sin conexión/)).toHaveCount(0);
  await expect.poll(() => getMutationQueueCount(page), { timeout: 15_000 }).toBe(0);
  // Once nothing is pending, SyncStatusIndicator renders nothing at all.
  await expect(page.getByRole('banner').locator('[title]')).toHaveCount(0);

  // The logged set survives the sync.
  await expect(page.getByRole('button', { name: 'Undo set completion' }).first()).toBeVisible();
});
