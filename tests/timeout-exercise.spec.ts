import  {test, expect} from '@playwright/test';

test.describe('Timeout exercise', { tag: '@timeout' }, () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('a. click non-existent link', async ({ page }) => {
    test.fail();
    await page.getByRole('link', { name: 'Non-existent link' }).click();
  });

  test('b. has title, with timeout', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/, { timeout: 1000 });
  });

  test('c. change test timeout', async ({ page }) => {
    test.setTimeout(27000);
    console.log('Test timeout is set to:', test.info().timeout);
  });

});