import { test, expect } from '@playwright/test';

test('homepage has correct title and heading', async ({ page }) => {
  await page.goto('/');
  
  // Check the title
  await expect(page).toHaveTitle(/{{name}}/);
  
  // Check heading
  const heading = page.locator('h1');
  await expect(heading).toHaveText(/{{name}}/);
});

test('time API endpoint is called via HTMX', async ({ page }) => {
  await page.goto('/');
  
  // Initially shows loading message
  let timeDiv = page.locator('div[hx-get="/api/time"]');
  await expect(timeDiv).toContainText('Loading server time');
  
  // After HTMX call, should contain server response
  await page.waitForResponse('/api/time');
  await page.waitForSelector(':has-text("Server time retrieved")');
  
  // Verify content has been updated
  const content = await page.textContent('div[hx-get="/api/time"]');
  expect(content).not.toContain('Loading server time');
  expect(content).toContain('Server time retrieved');
});