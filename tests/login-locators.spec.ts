import { test, expect } from '@playwright/test';

test.describe('Login Page Locators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
  });

  test('Valid login credentials', async ({ page }) => {
    await expect(page.getByRole('heading', {name: 'Login Page'})).toBeVisible();

    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page).toHaveURL(/\/secure/);
    await expect(page.getByText('You logged into a secure area')).toBeVisible();
  });

  test('Invalid login credentials', async ({ page }) => {
    await expect(page.getByRole('heading', {name: 'Login Page'})).toBeVisible();

    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('WrongPassword');

    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Your password is invalid')).toBeVisible();
  });

});