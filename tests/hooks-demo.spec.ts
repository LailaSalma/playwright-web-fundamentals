import { test, expect } from '@playwright/test';

test.beforeAll(async () => {
  console.log('beforeAll: once per worker, before the first test');
});

test.afterAll(async () => {
  console.log('afterAll: once per worker, after the last test');
});

test.describe('Playwright docs intro page', () => {
  test.beforeEach(async ({ page }) => {
    console.log('beforeEach: open the intro page');
    await page.goto('https://playwright.dev/docs/intro');
  });

  test.afterEach(async ({ page }) => {
    console.log('afterEach: test ended on', page.url());
  });

  test('has the Installation title', async ({ page }) => {
    console.log('test body: check the title');
    await expect(page).toHaveTitle(/Installation/);
  });

  test('has the intro URL', async ({ page }) => {
    console.log('test body: check the URL');
    await expect(page).toHaveURL('https://playwright.dev/docs/intro');
  });
});