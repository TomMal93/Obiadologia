import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('search session switches modes and explicit close resets on browser Forward', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  const opener = page.getByRole('button', { name: 'Szukaj' });
  await opener.click();

  const dialog = page.getByRole('dialog');
  const search = dialog.getByRole('searchbox', { name: 'Szukaj przepisu' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await expect(search).not.toBeFocused();
  await expect(dialog.getByRole('heading', { name: 'Propozycje' })).toHaveCount(0);

  await search.fill('kurczak');
  await expect(dialog.getByRole('button', { name: 'kurczak', exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Kurczak z grilla z sałatką/ })).toBeVisible();

  await dialog.getByRole('button', { name: /Mapa/ }).click();
  await expect(
    dialog.getByRole('button', { name: /Talerz na mapie: tempo neutralne · charakter neutralny/ }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: /Talerz na mapie/ }).press('ArrowLeft');
  await expect(
    dialog.getByRole('button', { name: /Talerz na mapie: szybko 55% · charakter neutralny/ }),
  ).toBeVisible();

  await dialog.getByRole('button', { name: /Wyszukiwarka/ }).click();
  await expect(search).toHaveValue('kurczak');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();

  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('');
});

test('map supports pointer input and returning from a recipe restores the suspended session', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mapa' }).click();

  const dialog = page.getByRole('dialog');
  const map = dialog.getByRole('application', { name: /Mapa preferencji/ });
  const bounds = await map.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.click(bounds!.x + bounds!.width * 0.2, bounds!.y + bounds!.height * 0.2);
  await expect(dialog.getByRole('button', { name: /Talerz na mapie: szybko 80% · lekko 80%/ })).toBeVisible();

  await dialog.getByRole('button', { name: /Wyszukiwarka/ }).click();
  const search = dialog.getByRole('searchbox', { name: 'Szukaj przepisu' });
  await search.fill('feta');
  await dialog.getByRole('link', { name: /Makaron z cukinią i fetą/ }).click();
  await expect(page).toHaveURL(/\/recipes\/makaron-z-cukinia-i-feta$/);

  await page.goBack();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('feta');
  await page.getByRole('dialog').getByRole('button', { name: /Mapa/ }).click();
  await expect(page.getByRole('button', { name: /Talerz na mapie: szybko 80% · lekko 80%/ })).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).include('.discovery-overlay').analyze();
  expect(accessibility.violations).toEqual([]);
});
