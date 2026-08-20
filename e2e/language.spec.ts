import { test, expect } from '@playwright/test';
import { createTestUser, registerUser } from './support/user';

test('cambiar el idioma en Ajustes actualiza la interfaz sin recargar la página', async ({ page }) => {
  const user = createTestUser();
  await registerUser(page, user);

  // handleLanguageChange no-ops until the user profile is loaded (auth.store
  // only persists `isAuthenticated`, not `user` — a fresh navigation refetches
  // it via UserLoader), so wait for that GET before clicking the toggle.
  const userLoaded = page.waitForResponse(
    (res) => res.url().includes('/api/v1/users/me') && res.request().method() === 'GET',
  );
  await page.goto('/settings');
  await userLoaded;
  await expect(page.getByText('Notificaciones', { exact: true })).toBeVisible();
  await expect(page.getByText('Idioma', { exact: true })).toBeVisible();

  // The app logs a hydration-mismatch warning on every fresh load right after
  // register, and while React recovers from it a click can occasionally land
  // on a handler that's about to be torn down and silently no-op. Retrying
  // the click until the language actually switches works around that flake.
  await expect(async () => {
    await page.getByRole('button', { name: 'English', exact: true }).click();
    await expect(page.getByText('Notifications', { exact: true })).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
  await expect(page.getByText('Language', { exact: true })).toBeVisible();
  await expect(page.getByText('Notificaciones', { exact: true })).toHaveCount(0);

  // Round-trip back to confirm the switch works both ways.
  await expect(async () => {
    await page.getByRole('button', { name: 'Español', exact: true }).click();
    await expect(page.getByText('Notificaciones', { exact: true })).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
  await expect(page.getByText('Notifications', { exact: true })).toHaveCount(0);
});
