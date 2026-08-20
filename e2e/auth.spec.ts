import { test, expect } from '@playwright/test';
import { createTestUser, registerUser, loginUser, logoutUser, expectStillOnRegisterPage } from './support/user';

test.describe('Autenticación', () => {
  test('un usuario nuevo se registra, cierra sesión y vuelve a iniciar sesión', async ({ page }) => {
    const user = createTestUser();

    await registerUser(page, user);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(user.username)).toBeVisible();

    await logoutUser(page);
    await expect(page).toHaveURL(/\/login/);

    await loginUser(page, user);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(user.username)).toBeVisible();
  });

  test('registrar con un email ya usado no navega y deja el formulario disponible', async ({ page }) => {
    const user = createTestUser();
    await registerUser(page, user);
    await logoutUser(page);

    const secondUsername = createTestUser().username;
    await page.goto('/register');
    await page.locator('#r-email').fill(user.email);
    await page.locator('#r-user').fill(secondUsername);
    await page.locator('#r-pass').fill(user.password);
    await page.getByRole('button', { name: 'Crear cuenta' }).click();

    await expectStillOnRegisterPage(page);
  });

  test('una ruta protegida redirige a /login si no hay sesión', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
