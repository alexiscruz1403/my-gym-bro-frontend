import type { Page } from '@playwright/test';

/**
 * Completes every planned set for every exercise in the active session.
 * Completing an exercise's last set auto-advances the navigator to the next
 * one, so we re-select the target exercise thumbnail before every single
 * click instead of assuming we stay put.
 */
export async function completeSessionSets(
  page: Page,
  exerciseCount: number,
  setsPerExercise: number,
): Promise<void> {
  const goToExercise = page.getByRole('button', { name: /^Go to /i });
  const skipRest = page.getByRole('button', { name: 'Saltear descanso' });

  for (let exIndex = 0; exIndex < exerciseCount; exIndex++) {
    for (let setIndex = 0; setIndex < setsPerExercise; setIndex++) {
      await goToExercise.nth(exIndex).click();
      await page.getByRole('button', { name: 'Mark set as complete' }).first().click();
      // Completing a set opens a floating rest-timer overlay (GlobalRestTimerOverlay)
      // that sits over the exercise thumbnail row and blocks the next click until
      // it's dismissed or times out — skip it right away instead of waiting it out.
      if (await skipRest.isVisible().catch(() => false)) {
        await skipRest.click();
      }
    }
  }
}
