import { test, expect } from '@playwright/test';

test.describe('Locators part 1: TodoMVC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  test('role, placeholder and test id locators', async ({ page }) => {
    // Role + accessible name: the <h1>todos</h1>
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();

    // Placeholder: the input has no label, only hint text
    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');

    // Test id: the text of the todo that was just added
    await expect(page.getByTestId('todo-title')).toHaveText('Buy milk');
  });

  test('locators are lazy', async ({ page }) => {
    // Created before any todo exists. No browser call happens here.
    const titles = page.getByTestId('todo-title');
    await expect(titles).toHaveCount(0);

    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');
    await newTodo.fill('Walk the dog');
    await newTodo.press('Enter');

    // The same locator object, searched again: it now finds 2 elements
    await expect(titles).toHaveCount(2);
    await expect(titles).toHaveText(['Buy milk', 'Walk the dog']);
  });

  test('strictness: an action needs exactly one element', async ({ page }) => {
    test.fail(); // expected to fail: click on a locator that matches 2 elements

    const newTodo = page.getByPlaceholder('What needs to be done?');
    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');
    await newTodo.fill('Walk the dog');
    await newTodo.press('Enter');

    await page.getByTestId('todo-title').click();
  });
});