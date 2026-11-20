import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.describe('Shadow DOM exercise', () => {
    test.beforeEach(async ({page}) => {
        const html = await readFile('tests/fixtures/shadow-exercise.html', 'utf-8');
        await page.setContent(html);
    });

    test('Subscribe flow', async ({page}) => {
        await page.getByRole('checkbox', { name: 'Subscribe to the newsletter' }).check();
        await expect(page.getByRole('checkbox', { name: 'Subscribe to the newsletter' })).toBeChecked();
        await expect(page.getByText('You are subscribed')).toBeVisible();
    });

    test('Verify a closed root cannot be reached', async ({page}) => {
        await expect(page.getByRole('heading', { name: 'Newsletter' })).toBeVisible();
        await expect(page.getByRole('checkbox', { name: 'Subscribe to the newsletter' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Get 20% off' })).toHaveCount(0);
    });
});