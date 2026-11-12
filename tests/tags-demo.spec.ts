import { test, expect } from '@playwright/test';

test.describe('Docs intro page', { tag: '@docs' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/docs/intro');
  });

  test('has the Installation title', { tag: '@smoke' }, async ({ page }) => {
    await expect(page).toHaveTitle(/Installation/);
  });

  test('has the intro URL', { tag: ['@regression', '@url'] }, async ({ page }) => {
    await expect(page).toHaveURL('https://playwright.dev/docs/intro');
  });

  test('title check with a tripled timeout', { tag: '@regression' }, async ({ page }) => {
    test.slow();
    await expect(page).toHaveTitle(/Installation/);
  });

  test.fixme('search finds the Installation page', async () => {
    // not written yet: needs locators (later in Phase 1)
  });
});