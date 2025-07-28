import { test, expect } from '@playwright/test';

test('homepage has correct title and heading', async ({ page }) => {
  await page.goto('/');

  // Check the title
  await expect(page).toHaveTitle(/node-app/);

  // Check heading
  const heading = page.locator('h1');
  await expect(heading).toHaveText(/node-app/);
});

test('time API endpoint is called via HTMX', async ({ page }) => {
  await page.goto('/');

  // Initially shows loading message
  let timeDiv = page.locator('div[hx-get="/api/time"]');
  await expect(timeDiv).toContainText('Loading server time');

  // After HTMX call, should contain server response
  await page.waitForResponse('/api/time');
  await expect(page.locator(':has-text("Server time retrieved")')).toBeVisible();

  // Verify content has been updated
  const content = await page.textContent('div[hx-get="/api/time"]');
  expect(content).not.toContain('Loading server time');
  expect(content).toContain('Server time retrieved');
});
