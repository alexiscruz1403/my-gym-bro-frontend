import type { Locator, Page } from '@playwright/test';

/**
 * dnd-kit's PointerSensor (activationConstraint: 8px) only starts a drag
 * after a real pointer-move sequence past that threshold, and its
 * closestCenter collision detection needs the pointer resting over the
 * target before pointerup. A single mouse.move + up (no intermediate steps)
 * never triggers it, so we walk the pointer there in stages.
 */
export async function dragVertical(page: Page, handle: Locator, target: Locator): Promise<void> {
  const handleBox = await handle.boundingBox();
  const targetBox = await target.boundingBox();
  if (!handleBox || !targetBox) {
    throw new Error('dragVertical: could not read bounding box of handle or target');
  }

  const startX = handleBox.x + handleBox.width / 2;
  const startY = handleBox.y + handleBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + targetBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX, startY - 12, { steps: 5 });
  await page.mouse.move(endX, endY, { steps: 15 });
  await page.mouse.move(endX, endY, { steps: 2 });
  await page.mouse.up();
}
