import { test, expect } from '@playwright/test';

test.describe('auto-waiting and web-first assertions', () => {
  test('web-first assertion waits for an element that appears later', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

    await page.getByRole('button', { name: 'Start' }).click();

    await expect(page.getByText('Hello World!')).toBeVisible({ timeout: 10_000 });
  });

  test('one-shot check does not wait (expected failure)', async ({ page }) => {
    test.fail();
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

    await page.getByRole('button', { name: 'Start' }).click();

    const isShown = await page.getByText('Hello World!').isVisible();
    expect(isShown).toBe(true);
  });

  test('an action waits until its element exists', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    const checkbox = page.getByRole('checkbox');
    await expect(checkbox).toBeVisible();

    await page.getByRole('button', { name: 'Remove' }).click();
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText("It's back!")).toBeVisible();
    await expect(checkbox).toBeVisible();
  });
});