import { test, expect } from '@playwright/test';

test.describe('Locators part 2: chaining and filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');
    await newTodo.fill('Walk the dog');
    await newTodo.press('Enter');
  });

  test('complete one todo with filter + chaining', async ({ page }) => {
    const items = page.getByTestId('todo-item');                  // 2 matches
    const dogItem = items.filter({ hasText: 'Walk the dog' });    // 1 match

    await dogItem.getByRole('checkbox').check();                  // checkbox inside that item only

    await expect(dogItem.getByRole('checkbox')).toBeChecked();
    await expect(items.filter({ hasText: 'Buy milk' }).getByRole('checkbox')).not.toBeChecked();
    await expect(page.getByTestId('todo-count')).toHaveText('1 item left');
  });

  test('filter with has: keep items that contain a given element', async ({ page }) => {
    const milkItem = page
      .getByTestId('todo-item')
      .filter({ has: page.getByText('Buy milk') });

    await expect(milkItem).toHaveCount(1);
    await expect(milkItem).toContainText('Buy milk');
  });
});