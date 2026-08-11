import { expect, test, type Locator } from '@playwright/test';

async function expectAccent(card: Locator, color: string) {
  await expect(card).toHaveCSS('--recipe-card-accent', color);
  await expect(card).toHaveCSS('border-top-width', '2px');
  await expect(card.locator('.recipe-content strong')).toHaveCSS('-webkit-text-stroke-width', '1px');
  await expect(card.locator('.recipe-time-value')).toHaveCSS('-webkit-text-stroke-width', '1px');
  await expect(card.locator('.recipe-time-unit')).toHaveCSS('-webkit-text-stroke-width', '1px');
}

test('panoramic recipe cards use the accent of their discovery path', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /Śniadanie/ }).click();
  const categoryCard = page
    .getByRole('region', { name: 'Wyniki kategorii' })
    .getByRole('link')
    .first();
  await expectAccent(categoryCard, 'rgb(21, 148, 71)');

  await page.getByRole('button', { name: 'Szukaj' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('searchbox', { name: 'Szukaj przepisu' }).fill('chorizo');
  await expectAccent(dialog.getByRole('link').first(), 'rgb(255, 79, 46)');

  await dialog.getByRole('button', { name: /Mapa/ }).click();
  await expectAccent(dialog.getByRole('link').first(), 'rgb(23, 104, 210)');
});
