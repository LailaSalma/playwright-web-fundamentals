import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'https://www.saucedemo.com',
  testIdAttribute: 'data-test',
});

test.describe('SauceDemo Login Test Suite', () => {
    test.beforeEach('Navigate to Sauce Demo login page', async ({page}) => {
        await page.goto('/');
    });

    test('Login using "standard-user" credentials', {tag: '@smoke'}, async ({page}) => {
        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('Password').fill('secret_sauce');
        await page.getByRole('button', {name: 'Login'}).click();

        await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('Login using wrong password', {tag: '@regression'}, async ({page}) => {
        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('Password').fill('wrong_password');
        await page.getByRole('button', {name: 'Login'}).click();
 
        await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toBeVisible();
    });

    test('Login with empty username', {tag: '@regression'}, async ({page}) => {
        await page.getByLabel('Password').fill('secret_sauce');
        await page.getByRole('button', {name: 'Login'}).click();
        
        await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
    });

    test('Opening /inventory.html without logging in', {tag: '@regression'}, async ({page}) => {
        await page.goto('/inventory.html');
        
        await expect(page.getByText("Epic sadface: You can only access '/inventory.html' when you are logged in.")).toBeVisible();
    });
});