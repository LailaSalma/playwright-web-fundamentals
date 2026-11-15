import {test, expect} from '@playwright/test';

test.describe('Chaining and Filtering Exercise', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/');

    const newTodo = page.getByRole('textbox', { name: 'What needs to be done?' });

    await newTodo.fill('Study Automation Testing');
    await newTodo.press('Enter');

    await newTodo.fill('Get Driving License');
    await newTodo.press('Enter');

    await newTodo.fill('Buy Groceries');
    await newTodo.press('Enter');
  });

  test('Check the middle todo & assert', async ({ page }) => {
    const items = page.getByTestId('todo-item'); // 3 matches

    const middleItem = items.filter({ hasText: 'Get Driving License' });

    await middleItem.getByRole('checkbox').check();

    await expect(middleItem.getByRole('checkbox')).toBeChecked();
    await expect(items.filter({ hasText: 'Study Automation Testing' }).getByRole('checkbox')).not.toBeChecked();
    await expect(items.filter({ hasText: 'Buy Groceries' }).getByRole('checkbox')).not.toBeChecked();
    
    await expect(page.getByTestId('todo-count')).toHaveText('2 items left');
  });
});