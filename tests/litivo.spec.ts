import { expect, test } from '@playwright/test';

test('Abre la app en Chromium', async ({ page }) => {
  const url = process.env.LITIVO_URL ?? 'http://localhost:3000';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(url);
});
