import {test, expect} from '@playwright/test';

test.describe('JavaScript dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  });

   test('prompt is accepted with a text', async ({ page }) => {
    let dialogMessage = '';
    let dialogType = '';

    page.once('dialog', async dialog => {
        dialogType = dialog.type();
        dialogMessage = dialog.message();
        await dialog.accept('I am LS');
    })

    await page.getByRole('button', { name: 'Click for JS Prompt'}).click();

    expect(dialogType).toBe('prompt');
    expect(dialogMessage).toBe('I am a JS prompt');
    await expect(page.locator('p[id="result"]')).toHaveText('You entered: I am LS');
  });

  test('prompt is cancelled', async ({ page }) => {
    let dialogMessage = '';

    page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
    })

    await page.getByRole('button', { name: 'Click for JS Prompt'}).click();

    expect(dialogMessage).toBe('I am a JS prompt');
    await expect(page.locator('p[id="result"]')).toHaveText('You entered: null');
  });
});