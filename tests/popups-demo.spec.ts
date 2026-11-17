import { test, expect } from '@playwright/test';

test.describe('new tabs and popups', () => {
  test('link opens a new tab, caught with popup', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');

    // Start listening BEFORE the click. No await: we only take the receipt.
    const popupPromise = page.waitForEvent('popup');

    await page.getByRole('link', { name: 'Click Here' }).click();

    // Now collect the new tab. Waits only if the event has not arrived yet.
    const popup = await popupPromise;

    // The new tab is a normal Page: same locators, same web-first assertions.
    await expect(popup).toHaveTitle('New Window');
    await expect(popup.getByRole('heading', { name: 'New Window' })).toBeVisible();

    // The original tab is unchanged and still usable through `page`.
    await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();
  });

  test('link opens a new tab, caught with context, then closed', async ({ page, context }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');

    const newPagePromise = context.waitForEvent('page');
    await page.getByRole('link', { name: 'Click Here' }).click();
    const newPage = await newPagePromise;

    await expect(newPage).toHaveURL('https://the-internet.herokuapp.com/windows/new');

    // Two tabs are open in this context now.
    expect(context.pages()).toHaveLength(2);

    await newPage.close();

    // Back to one tab.
    expect(context.pages()).toHaveLength(1);
  });
});