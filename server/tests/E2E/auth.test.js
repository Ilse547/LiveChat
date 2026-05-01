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
