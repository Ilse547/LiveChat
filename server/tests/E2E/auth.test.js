const { test, expect } = require('@playwright/test');

test.describe('Registration', () => {
  test('Register a new user ', async  ({ page })=> {
    await page.goto('/register');
    await page.fill('input[placeholder="Input your username"]', 'test');
    await page.fill('input[placeholder="Input your email"]', 'test@cool.com');
    await page.fill('input[placeholder="Input your password"]', '12345678');
    await page.click('button:has-text("Register")');
    await expect(page.locator('h2')).toHaveText('Confirm your account');
  });
});

test.describe('Login', () => {
  test('should show an error when inputing wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Input your username"]', 'vraoüds');
    await page.fill('input[placeholder="Input your password"]', 'jsjispie');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/login');
  });
  test('should show verification page afterloging in', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Input your username"]', 'testuser');
    await page.fill('input[placeholder="Input your password"]', '12345678');
    await page.click('button:has-text("Login")');
    await expect(page.locator('h2')).toHaveText('Verification')
  });

});

