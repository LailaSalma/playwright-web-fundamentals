import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.describe('shadow DOM', () => {
  test.beforeEach(async ({ page }) => {
    const html = await readFile('tests/fixtures/shadow-demo.html', 'utf-8');
    await page.setContent(html);
  });

  test('role and label locators reach into an open shadow root', async ({ page }) => {
    const status = page.locator('#status');
    await expect(status).toHaveText('Not saved');

    await page.getByLabel('Nickname').fill('Laila');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(status).toHaveText('Saved: Laila');
  });

  test('CSS pierces an open shadow root, XPath does not', async ({ page }) => {
    await expect(page.locator('css=#status')).toHaveCount(1);
    await expect(page.locator('xpath=//p')).toHaveCount(0);
  });

  test('a closed shadow root is not reachable', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Secret' })).toHaveCount(0);
  });
});