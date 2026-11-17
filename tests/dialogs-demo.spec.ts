import { test, expect } from '@playwright/test';

test.describe('JavaScript dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  });

  test('alert is accepted and its text is checked', async ({ page }) => {
    let dialogType = '';
    let dialogMessage = '';

    // Register BEFORE the click. Runs once, for the next dialog only.
    page.once('dialog', async dialog => {
      dialogType = dialog.type();
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Alert' }).click();

    // Plain values, filled in by the handler: no await on expect.
    expect(dialogType).toBe('alert');
    expect(dialogMessage).toBe('I am a JS Alert');

    // The page's reaction: web-first assertion.
    await expect(page.locator('p[id="result"]')).toHaveText('You successfully clicked an alert');
  });

  test('confirm is dismissed', async ({ page }) => {
    let dialogMessage = '';

    page.once('dialog', async dialog => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

    expect(dialogMessage).toBe('I am a JS Confirm');
    await expect(page.locator('p[id="result"]')).toHaveText('You clicked: Cancel');
  });
});