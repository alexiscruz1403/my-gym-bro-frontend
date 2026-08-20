import { type Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  username: string;
  password: string;
}

/** Genera credenciales únicas por ejecución para no chocar con datos de corridas anteriores. */
export function createTestUser(): TestUser {
  const unique = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  return {
    email: `e2e.${unique}@e2e-test.dev`,
    username: `e2e${unique}`.slice(0, 20),
    // The API enforces uppercase + lowercase + number + symbol server-side,
    // stricter than the client-side zod schema (registerSchema only checks
    // length) — a plain alnum password gets a 400 here even though the form
    // would accept it.
    password: 'E2ePassword1!',
  };
}

export async function registerUser(page: Page, user: TestUser): Promise<void> {
  await page.goto('/register');
  await page.locator('#r-email').fill(user.email);
  await page.locator('#r-user').fill(user.username);
  await page.locator('#r-pass').fill(user.password);
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await page.waitForURL('**/dashboard');
}

export async function loginUser(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login');
  await page.locator('#l-email').fill(user.email);
  await page.locator('#l-pass').fill(user.password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForURL('**/dashboard');
}

export async function logoutUser(page: Page): Promise<void> {
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await page.waitForURL('**/login');
}

export async function expectStillOnRegisterPage(page: Page): Promise<void> {
  const submitButton = page.getByRole('button', { name: 'Crear cuenta' });
  await expect(submitButton).toBeEnabled();
  await expect(page).toHaveURL(/\/register/);
}
