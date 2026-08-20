import { type Page, expect } from '@playwright/test';

/** Step 1 (name) + step 2 (day). Leaves the wizard on step 3, ready to add exercises. */
export async function fillWizardNameAndDay(page: Page, name: string, dayLabel: string): Promise<void> {
  const nameInput = page.getByRole('textbox').first();
  await nameInput.fill(name);
  await page.getByRole('button', { name: 'Continuar' }).click();

  await page.getByRole('button', { name: dayLabel, exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
}

/** Step 3: opens the exercise picker and adds the first `count` exercises from the catalog. */
export async function addExercisesToWizard(page: Page, count: number): Promise<void> {
  await page.getByRole('button', { name: 'Agregar ejercicio' }).click();

  // Each click flips that card's button to "Deselect exercise", dropping it out of
  // this locator's matches — so `.first()` naturally lands on the next unpicked card.
  // We wait for the count to actually drop before the next click; otherwise two
  // clicks can land before React re-renders and the second one deselects the first.
  // `exact: true` matters: the whole ExerciseCard is itself role="button" with no
  // explicit aria-label, so its accessible name is computed from its content —
  // which includes this inner button's aria-label — and a substring match on
  // "Select exercise" would match both the card and the button underneath it.
  const selectButtons = page.getByRole('button', { name: 'Select exercise', exact: true });
  // Wait for the catalog to finish loading before snapshotting the count —
  // otherwise this can run while the drawer is still empty/animating in.
  await expect(selectButtons.first()).toBeVisible();
  const initialCount = await selectButtons.count();
  for (let i = 0; i < count; i++) {
    await selectButtons.first().click();
    await expect(selectButtons).toHaveCount(initialCount - (i + 1));
  }

  const confirmLabel = count === 1 ? 'Agregar 1 ejercicio' : `Agregar ${count} ejercicios`;
  await page.getByRole('button', { name: confirmLabel }).click();

  // The drawer (vaul) slides out over ~300ms and stays in the DOM — and on
  // top of the page — for the whole animation. Interacting with the wizard
  // right after this click (e.g. the drag-and-drop reorder) can land on the
  // still-visible drawer content instead of the page underneath it.
  await expect(page.locator('[data-slot="drawer-content"]')).toHaveCount(0);
}

/** Step 3 -> 4 -> save. Waits for the redirect to the resulting plan's detail page. */
export async function confirmWizardReviewAndSave(page: Page): Promise<void> {
  // The app logs a hydration-mismatch warning on every fresh page load, and
  // while React recovers from it a click can occasionally land on a handler
  // that's about to be torn down and silently no-op — seen here often enough
  // (right after the wizard's initial navigation) to warrant a retry.
  await expect(async () => {
    await page.getByRole('button', { name: 'Revisar' }).click();
    await expect(page.getByRole('button', { name: 'Guardar plan' })).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Guardar plan' }).click();
  // Plan ids are Mongo ObjectIds — matching that (rather than any /workout/<segment>)
  // avoids resolving instantly against the wizard's own /workout/new URL.
  await page.waitForURL(/\/workout\/[a-f0-9]{24}$/);
}

/** Full happy-path plan creation, no reordering. Used by specs that just need a plan to exist. */
export async function createPlan(
  page: Page,
  opts: { name: string; dayLabel: string; exerciseCount?: number },
): Promise<void> {
  await page.goto('/workout/new');
  await fillWizardNameAndDay(page, opts.name, opts.dayLabel);
  await addExercisesToWizard(page, opts.exerciseCount ?? 2);
  await confirmWizardReviewAndSave(page);
}

/**
 * Drives the edit wizard (pre-populated from the existing plan) through to save,
 * changing only the plan's name.
 */
export async function renamePlanThroughWizard(page: Page, newName: string): Promise<void> {
  const nameInput = page.getByRole('textbox').first();
  await nameInput.fill(newName);
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await confirmWizardReviewAndSave(page);
}
