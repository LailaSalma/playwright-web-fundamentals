import {test, expect} from '@playwright/test';

test.describe('auto-waiting and web-first assertions', () => {
  test('Enable button makes the text field editable', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_controls');
    const field = page.getByRole('textbox');

    await expect(field).toBeDisabled();

    await page.getByRole('button', { name: 'Enable' }).click();

    await expect(field).toBeEnabled();
    await expect(page.getByText("It's enabled!")).toBeVisible();

    await field.fill('It\'s Laila-Salma');
    await expect(field).toHaveValue('It\'s Laila-Salma');
  });

});