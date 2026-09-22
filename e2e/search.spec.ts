import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test('search page loads', async ({ page }) => {
    await page.goto('/lt/search');
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test('search input has autofocus', async ({ page }) => {
    await page.goto('/lt/search');
    const input = page.locator('input[type="search"]');
    await expect(input).toBeFocused();
  });

  test('search shows all pages when no query', async ({ page }) => {
    await page.goto('/lt/search');
    const allPages = page.locator('text=Visi puslapiai');
    await expect(allPages).toBeVisible();
  });

  test('search filters results by query', async ({ page }) => {
    await page.goto('/lt/search');
    const input = page.locator('input[type="search"]');
    await input.fill('mišios');
    // Results should appear
    const results = page.locator('text=Rasta');
    await expect(results).toBeVisible({ timeout: 5000 });
  });

  test('search results have locale-prefixed links', async ({ page }) => {
    await page.goto('/lt/search');
    const input = page.locator('input[type="search"]');
    await input.fill('istorija');
    // Wait for results
    await page.waitForTimeout(500);
    const resultLinks = page.locator('a[href^="/lt/"]');
    const count = await resultLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('search shows no results message for nonsense query', async ({ page }) => {
    await page.goto('/lt/search');
    const input = page.locator('input[type="search"]');
    await input.fill('xyznonexistent123');
    const noResults = page.locator('text=Nieko nerasta');
    await expect(noResults).toBeVisible({ timeout: 5000 });
  });
});
