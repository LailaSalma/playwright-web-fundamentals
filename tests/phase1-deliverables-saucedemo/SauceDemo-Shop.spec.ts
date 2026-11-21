import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'https://www.saucedemo.com',
  testIdAttribute: 'data-test',
});

test.describe('Sauce Demo Shop Test Suite', () => {
    test.beforeEach('Login with valid credentials', async ({page}) => {
        await page.goto('/');
        await page.getByLabel('Username').fill('standard_user');
        await page.getByLabel('Password').fill('secret_sauce');
        await page.getByRole('button', {name: 'Login'}).click();

        await expect(page.getByTestId('title')).toHaveText('Products');
    });

    test('Adding multiple products to cart and removing one', {tag: '@smoke'}, async ({page}) => {
        const cartBadge = page.getByTestId('shopping-cart-badge');
        await expect(cartBadge).toHaveCount(0);

        const item = page.getByTestId('inventory-item');
        const firstItem = item.filter({hasText: 'Sauce Labs Backpack'});
        const secondItem = item.filter({hasText: 'Sauce Labs Onesie'});

        await firstItem.getByRole('button', {name: 'Add to cart'}).click();
        await expect(firstItem.getByRole('button', {name: 'Remove'})).toBeVisible();
        await expect(cartBadge).toHaveText('1');

        await secondItem.getByRole('button', {name: 'Add to cart'}).click();
        await expect(secondItem.getByRole('button', {name: 'Remove'})).toBeVisible();
        await expect(cartBadge).toHaveText('2');

        await firstItem.getByRole('button', {name: 'Remove'}).click();
        await expect(firstItem.getByRole('button', {name: 'Add to cart'})).toBeVisible();
        await expect(cartBadge).toHaveText('1');
    });

    test('Sort products by price low to high', {tag: '@regression'}, async ({page}) => {
        const sort = page.getByTestId('product-sort-container');
        const prices = page.getByTestId('inventory-item-price');

        await expect(prices).toHaveText(['$29.99', '$9.99', '$15.99', '$49.99', '$7.99', '$15.99']);
        await sort.selectOption('lohi');
        await expect(prices).toHaveText(['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99']);
    });

    test('The cart lists the products that were added', {tag: '@smoke'}, async ({page}) => {
        const cartLink = page.getByTestId('shopping-cart-link');
        const item = page.getByTestId('inventory-item');
        const firstItem = item.filter({hasText: 'Sauce Labs Backpack'});
        const secondItem = item.filter({hasText: 'Sauce Labs Onesie'});

        await firstItem.getByRole('button', {name: 'Add to cart'}).click();
        await secondItem.getByRole('button', {name: 'Add to cart'}).click();
        await cartLink.click();

        await expect(page.getByTestId('title')).toHaveText('Your Cart');
        await expect(page.getByTestId('inventory-item-name')).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Onesie']);
    });

    test('Full checkout ends at "Thank you for your order!" page', {tag: '@smoke'}, async ({page}) => {
        const cartLink = page.getByTestId('shopping-cart-link');
        const item = page.getByTestId('inventory-item');
        const firstItem = item.filter({hasText: 'Sauce Labs Backpack'});
        const secondItem = item.filter({hasText: 'Sauce Labs Onesie'});

        await firstItem.getByRole('button', {name: 'Add to cart'}).click();
        await secondItem.getByRole('button', {name: 'Add to cart'}).click();
        await cartLink.click();
        await page.getByRole('button', {name: 'Checkout'}).click();

        const firstName = page.getByRole('textbox', {name: 'First Name'});
        const lastName = page.getByRole('textbox', {name: 'Last Name'});
        const postalCode = page.getByRole('textbox', {name: 'Zip/Postal Code'});
        const contBtn = page.getByRole('button', {name: 'Continue'});
        
        await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
        await firstName.fill('Laila-Salma');
        await lastName.fill('Ghaly');
        await postalCode.fill('1999');
        await contBtn.click();

        await expect(page.getByTestId('secondary-header')).toHaveText('Checkout: Overview');
        await expect(page.getByTestId('inventory-item-name')).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Onesie']);
        await expect(page.getByTestId('subtotal-label')).toHaveText('Item total: $37.98');

        await page.getByRole('button', {name: 'Finish'}).click();
        await expect(page.getByTestId('title')).toHaveText('Checkout: Complete!');
        await expect(page.getByRole('heading', {name: 'Thank you for your order!'})).toBeVisible();
    });

    test('Checkout with an empty first name', {tag: '@regression'}, async ({page}) => {
        const cartLink = page.getByTestId('shopping-cart-link');
        const item = page.getByTestId('inventory-item').filter({hasText: 'Sauce Labs Backpack'});

        await item.getByRole('button', {name: 'Add to cart'}).click();
        await cartLink.click();
        await page.getByRole('button', {name: 'Checkout'}).click();
        await page.getByRole('textbox', {name: 'Last Name'}).fill('Ghaly');
        await page.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('1999');
        await page.getByRole('button', {name: 'Continue'}).click();

        await expect(page.getByText('Error: First Name is required')).toBeVisible();
    });

    test('Logout returns to login page', {tag: '@smoke'}, async ({page}) => {
        await page.getByRole('button', {name: 'Open Menu'}).click();
        await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible();

        await page.getByRole('button', {name: 'Logout'}).click();
        await expect(page.getByLabel('Username')).toBeVisible();
        await expect(page.getByLabel('Password')).toBeVisible();
        await expect(page.getByRole('button', {name: 'Login'})).toBeVisible();
        
        await page.goto('/inventory.html');
        await expect(page.getByText("Epic sadface: You can only access '/inventory.html' when you are logged in.")).toBeVisible();
    });

});