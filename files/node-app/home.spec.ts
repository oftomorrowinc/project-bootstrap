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

  // Wait for HTMX to load and make the API call
  await page.waitForResponse('/api/time');
  
  // Verify the API response is displayed in the HTMX target div
  const timeDiv = page.locator('div[hx-get="/api/time"]');
  await expect(timeDiv).toContainText('Server time retrieved successfully');
  
  // Verify the response contains an ISO timestamp
  const content = await page.textContent('div[hx-get="/api/time"]');
  expect(content).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO timestamp pattern
});