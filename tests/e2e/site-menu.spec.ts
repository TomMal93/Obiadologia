import { expect, test } from '@playwright/test';

const menu = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: 'Menu główne' });

// Uchwyt na przycisk jest stały; jego dostępna nazwa zmienia się między
// „Otwórz menu” a „Zamknij menu” wraz ze stanem.
const toggle = (page: import('@playwright/test').Page) =>
  page.locator('[data-site-menu-toggle]');

test('hamburger opens the menu, moves focus in, and Escape restores it', async ({ page }) => {
  await page.goto('/');
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle(page)).toHaveAttribute('aria-label', 'Otwórz menu');

  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle(page)).toHaveAttribute('aria-label', 'Zamknij menu');
  await expect(menu(page).getByRole('link', { name: 'Strona główna' })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle(page)).toBeFocused();
});

test('menu Szukaj opens the shared overlay on the home page', async ({ page }) => {
  await page.goto('/');
  await toggle(page).click();
  await menu(page).getByRole('link', { name: 'Szukaj' }).click();

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test('menu Mapa from another page returns home and opens the map mode', async ({ page }) => {
  await page.goto('/categories');
  await toggle(page).click();
  await menu(page).getByRole('link', { name: 'Mapa' }).click();

  await expect(page).toHaveURL(/\/$/);
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Talerz na mapie/ })).toBeVisible();
});

test('clicking the backdrop closes the menu', async ({ page }) => {
  await page.goto('/');
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');

  await page.locator('[data-site-menu-backdrop]').click({ position: { x: 8, y: 220 } });
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
});
