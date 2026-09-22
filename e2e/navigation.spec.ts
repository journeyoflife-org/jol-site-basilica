import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads at /lt', async ({ page }) => {
    await page.goto('/lt');
    await expect(page).toHaveTitle(/Pradžia|Vilniaus/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('root redirects to /lt', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/lt/);
  });

  test('nav links are locale-prefixed', async ({ page }) => {
    await page.goto('/lt');
    const links = page.locator('nav a[href^="/lt/"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/lt/about/history');
    await expect(page.locator('h1')).toContainText(/Istorija|History/);
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    const response = await page.goto('/lt/nonexistent-page');
    // Next.js returns 404 status for not-found pages
    expect(response?.status()).toBe(404);
  });
});
