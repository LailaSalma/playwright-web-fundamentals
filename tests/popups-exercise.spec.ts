import {test, expect} from '@playwright/test';

test.describe('frames', () => {
  test('handling two tabs', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');

    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Click Here'}).click();
    const popup = await popupPromise;

    const popupPromise2 = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Elemental Selenium'}).click();
    const popup2 = await popupPromise2;
    await expect(popup2).toHaveURL('https://elementalselenium.com/');

    await expect(popup).toHaveTitle('New Window');
    await expect(popup.getByRole('heading', { name: 'New Window'})).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Opening a new window'})).toBeVisible();
  });
});