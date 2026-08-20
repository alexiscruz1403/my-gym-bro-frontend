import { test, expect } from '@playwright/test';
import { createTestUser, registerUser } from './support/user';
import { createPlan } from './support/plan-wizard';
import { completeSessionSets } from './support/session';

const EXERCISE_COUNT = 2;
// DayExerciseList.handleSelectExercise always adds new exercises with `sets: 3`.
const SETS_PER_EXERCISE = 3;

test('ejecuta una sesión completa y la ve reflejada en las estadísticas', async ({ page }) => {
  const user = createTestUser();
  await registerUser(page, user);

  await createPlan(page, { name: 'Plan Sesión E2E', dayLabel: 'Lunes', exerciseCount: EXERCISE_COUNT });
  await page.getByRole('button', { name: 'Activar', exact: true }).click();
  await expect(page.getByText('Activo')).toBeVisible();

  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Iniciar entrenamiento', exact: true }).click();

  const sheet = page.locator('[data-slot="sheet-content"]');
  await sheet.getByText('Lunes', { exact: false }).first().click();
  await sheet.getByRole('button', { name: 'Iniciar entrenamiento' }).click();

  await page.waitForURL('**/session');

  await completeSessionSets(page, EXERCISE_COUNT, SETS_PER_EXERCISE);

  await page.getByRole('button', { name: 'Finalizar', exact: true }).click();
  const finishSheet = page.locator('[data-slot="sheet-content"]');
  await finishSheet.getByRole('button', { name: 'Confirmar' }).click();

  await expect(page.getByRole('heading', { name: '¡Entrenamiento completo!' })).toBeVisible();
  await page.getByRole('button', { name: 'Volver al inicio' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto('/profile');
  await page.getByRole('button', { name: 'Estadísticas' }).click();

  await expect(page.getByRole('heading', { name: 'Volumen por período' })).toBeVisible();
  const sessionsCard = page.locator('div', { hasText: 'Sesiones' }).last();
  await expect(sessionsCard).toContainText('1');
});
