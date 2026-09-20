import { test, expect } from '@playwright/test';

test.describe('Language Switching', () => {
  test('language switcher shows all 3 locales', async ({ page }) => {
    await page.goto('/lt');
    const switcher = page.locator('a[hreflang="lt"], a[hreflang="en"], a[hreflang="ru"]');
    await expect(switcher).toHaveCount(3);
  });

  test('switching to EN changes URL to /en', async ({ page }) => {
    await page.goto('/lt');
    await page.click('a[hreflang="en"]');
    await expect(page).toHaveURL(/\/en/);
  });

  test('switching to RU changes URL to /ru', async ({ page }) => {
    await page.goto('/lt');
    await page.click('a[hreflang="ru"]');
    await expect(page).toHaveURL(/\/ru/);
  });

  test('current locale is highlighted in switcher', async ({ page }) => {
    await page.goto('/lt');
    // Current locale link should have aria-current or distinct styling
    const currentLt = page.locator('a[hreflang="lt"][aria-current="page"], a[hreflang="lt"].font-bold, a[hreflang="lt"].text-amber-700');
    await expect(currentLt).toBeVisible();
  });

  test('locale persists across page navigation', async ({ page }) => {
    await page.goto('/en/about/history');
    await expect(page).toHaveURL(/\/en\/about\/history/);
    // Nav links should still be /en prefixed
    const navLink = page.locator('nav a[href^="/en/"]').first();
    await expect(navLink).toBeVisible();
  });
});
