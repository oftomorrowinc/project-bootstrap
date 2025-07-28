import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/NextJS App/);
});

test('displays the welcome message', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('NextJS App with Firebase');
});

test('ShadCN button is rendered and clickable', async ({ page }) => {
  await page.goto('/');

  // Find the ShadCN button
  const button = page.getByRole('button', { name: 'Click Me!' });
  
  // Check that button is visible and enabled
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
  
  // Check that button has correct ShadCN classes (indicates ShadCN is working)
  await expect(button).toHaveClass(/inline-flex/);
  await expect(button).toHaveClass(/items-center/);
  
  // Click the button (should not cause any errors)
  await button.click();
});

test('navigation links are working', async ({ page }) => {
  await page.goto('/');
  
  // Get all links
  const links = await page.getByRole('link');
  const count = await links.count();
  
  // Verify we have at least 2 documentation links
  expect(count).toBeGreaterThanOrEqual(2);
  
  // Check specific links point to correct documentation
  await expect(page.getByRole('link', { name: /nextjs docs/i })).toHaveAttribute('href', 'https://nextjs.org/docs');
  await expect(page.getByRole('link', { name: /firebase docs/i })).toHaveAttribute('href', 'https://firebase.google.com/docs');
});