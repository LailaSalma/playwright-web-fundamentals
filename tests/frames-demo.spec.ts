import { test, expect } from '@playwright/test';

test.describe('frames', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/nested_frames');
  });

  test('main-page locator cannot see text inside a frame (expected failure)', async ({ page }) => {
    test.fail();
    await expect(page.getByText('BOTTOM')).toBeVisible();
  });

  test('one level: bottom frame', async ({ page }) => {
    const bottomFrame = page.locator('frame[name="frame-bottom"]').contentFrame();

    await expect(bottomFrame.getByText('BOTTOM')).toBeVisible();
  });

  test('two levels: middle frame inside the top frame', async ({ page }) => {
    const topFrame = page.locator('frame[name="frame-top"]').contentFrame();
    const middleFrame = topFrame.locator('frame[name="frame-middle"]').contentFrame();

    await expect(middleFrame.getByText('MIDDLE')).toBeVisible();
    await expect(middleFrame.getByText('LEFT')).toHaveCount(0);
  });
});