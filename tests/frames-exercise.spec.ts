import {test, expect} from '@playwright/test';

test.describe('frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/nested_frames');
  });

  test('check content of left frame', async ({ page }) => {
    const topFrame = page.locator('frame[name="frame-top"]').contentFrame();
    const leftFrame = topFrame.locator('frame[name="frame-left"]').contentFrame();

    await expect(leftFrame.getByText('LEFT')).toBeVisible();
    await expect(leftFrame.getByText('RIGHT')).not.toBeVisible();
  });

    test('check content of right frame', async ({ page }) => {
    const topFrame = page.locator('frame[name="frame-top"]').contentFrame();
    const rightFrame = topFrame.locator('frame[name="frame-right"]').contentFrame();

    await expect(rightFrame.getByText('RIGHT')).toBeVisible();
    await expect(rightFrame.getByText('LEFT')).not.toBeVisible();
  });
});