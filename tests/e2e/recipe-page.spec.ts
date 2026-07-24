import { expect, test } from '@playwright/test';

test('empty recipe catalog does not expose a recipe route', async ({ page }) => {
  const response = await page.goto('/recipes/nieistniejacy-przepis');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '404: Not found' })).toBeVisible();
});
