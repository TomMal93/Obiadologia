import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('category selection opens a prerendered recipe page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Co dziś jemy?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toHaveCount(0);
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);

  await page.getByRole('button', { name: /Obiad/ }).click();
  await expect(page.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toBeVisible();

  await page.getByRole('link', { name: /Kurczak z grilla z sałatką/ }).click();
  await expect(page).toHaveURL(/\/recipes\/kurczak-z-grilla-z-salatka$/);
  await expect(page.getByRole('heading', { name: 'Kurczak z grilla z sałatką' })).toBeVisible();
  await page.getByRole('link', { name: /Wróć do strony głównej/ }).click();
  await expect(page).toHaveURL('/');
});

test('initial homepage has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
