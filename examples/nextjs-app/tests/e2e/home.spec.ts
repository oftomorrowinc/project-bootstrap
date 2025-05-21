import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/NextJS App/);
});

test('displays the welcome message', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('NextJS App with Firebase');
});

test('theme toggle button works', async ({ page }) => {
  await page.goto('/');
  
  // Check that page initially has no dark mode class
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
  
  // Find and click the theme toggle button
  const themeToggle = page.getByRole('button', { name: /dark mode/i });
  await themeToggle.click();
  
  // Check that dark mode is now enabled
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  
  // Click the toggle again
  const themeToggleLight = page.getByRole('button', { name: /light mode/i });
  await themeToggleLight.click();
  
  // Check that dark mode is now disabled
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
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