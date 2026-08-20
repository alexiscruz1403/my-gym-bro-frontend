import { test, expect } from '@playwright/test';
import { createTestUser, registerUser } from './support/user';
import {
  fillWizardNameAndDay,
  addExercisesToWizard,
  confirmWizardReviewAndSave,
  renamePlanThroughWizard,
} from './support/plan-wizard';
import { dragVertical } from './support/dnd';

test('crear un plan reordenando ejercicios con drag & drop, editarlo y activarlo', async ({ page }) => {
  const user = createTestUser();
  await registerUser(page, user);

  await page.goto('/workout/new');
  await fillWizardNameAndDay(page, 'Plan Full Body', 'Lunes');
  await addExercisesToWizard(page, 2);

  // Each exercise row renders two links to the same href (the name and the
  // thumbnail via ExerciseGifThumbnail) — keep only the ones with visible text.
  const exerciseLinks = page.locator('a[href^="/workout/exercises/"]').filter({ hasText: /\S/ });
  await expect(exerciseLinks).toHaveCount(2);
  const originalOrder = await exerciseLinks.allTextContents();

  // Drag the second exercise's handle onto the first one to swap their order.
  const handles = page.getByRole('button', { name: 'Drag to reorder' });
  await dragVertical(page, handles.nth(1), handles.nth(0));

  await expect(async () => {
    expect(await exerciseLinks.allTextContents()).toEqual([originalOrder[1], originalOrder[0]]);
  }).toPass({ timeout: 5_000 });

  await confirmWizardReviewAndSave(page);
  await expect(page.getByRole('heading', { name: 'Plan Full Body' })).toBeVisible();

  // Edit: rename the plan through the same wizard, pre-populated from the saved plan.
  await page.getByRole('link', { name: 'Editar' }).click();
  await expect(page).toHaveURL(/\/workout\/[^/]+\/edit$/);
  await renamePlanThroughWizard(page, 'Plan Full Body Editado');
  await expect(page.getByRole('heading', { name: 'Plan Full Body Editado' })).toBeVisible();

  // Activate.
  await expect(page.getByRole('button', { name: 'Activar', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Activar', exact: true }).click();
  await expect(page.getByText('Activo')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Activar', exact: true })).toHaveCount(0);
});
