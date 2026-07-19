import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('recipe page presents model data with ingredients and a way back', async ({ page }) => {
  await page.goto('/recipes/kurczak-z-grilla-z-salatka');

  await expect(page).toHaveTitle('Kurczak z grilla z sałatką — Obiadologia');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Kurczak z grilla z sałatką' }),
  ).toBeVisible();
  await expect(page.getByText('Prototypowa propozycja lekkiego obiadu z grilla.')).toBeVisible();
  await expect(page.getByText('Czas przygotowania: 25 min')).toBeVisible();

  const tags = page.getByRole('list', { name: 'Tagi' });
  for (const tag of ['grill', 'lekko', 'obiad']) {
    await expect(tags.getByRole('listitem').filter({ hasText: tag })).toBeVisible();
  }

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  await expect(ingredients.getByRole('heading', { level: 2, name: 'Składniki' })).toBeVisible();
  for (const ingredient of ['kurczak', 'sałata', 'pomidor']) {
    await expect(ingredients.getByRole('listitem').filter({ hasText: ingredient })).toBeVisible();
  }

  const oliwa = ingredients.getByRole('listitem').filter({ hasText: 'oliwa' });
  const oliwaMetric = oliwa.locator('.ingredient__measure-metric');
  const oliwaHousehold = oliwa.locator('.ingredient__measure-household');

  // Domyślnie widoczna jest miara metryczna (grammatura).
  await expect(oliwaMetric).toBeVisible();
  await expect(oliwaMetric).toHaveText('30 ml');
  await expect(oliwaHousehold).toBeHidden();

  // Przełącznik zmienia formę miary na domową i z powrotem.
  await page.getByRole('button', { name: 'szklanki / szczypty' }).click();
  await expect(oliwaHousehold).toBeVisible();
  await expect(oliwaHousehold).toHaveText('2 łyżki');
  await expect(oliwaMetric).toBeHidden();
  await page.getByRole('button', { name: 'gramy / ml' }).click();
  await expect(oliwaMetric).toBeVisible();

  const steps = page.getByRole('region', { name: 'Kroki' });
  await expect(steps.getByRole('heading', { level: 2, name: 'Kroki' })).toBeVisible();
  await expect(
    steps.getByRole('listitem').filter({ hasText: 'Rozgrzej grill i piecz kurczaka' }),
  ).toBeVisible();

  await expect(page.getByText('Dane przepisu pochodzą z prototypowego katalogu.')).toBeVisible();

  await page.getByRole('link', { name: /Wróć do strony głównej/ }).click();
  await expect(page).toHaveURL('/');
});

test('recipe page guides prep with advance, preparation and a start-time helper', async ({
  page,
}) => {
  await page.goto('/recipes/kurczak-z-grilla-z-salatka');

  const advance = page.getByRole('region', { name: 'Wcześniej' });
  const preparation = page.getByRole('region', { name: 'Przygotowanie' });
  await expect(advance.getByRole('heading', { level: 2, name: 'Wcześniej' })).toBeVisible();
  await expect(preparation.getByRole('heading', { level: 2, name: 'Przygotowanie' })).toBeVisible();

  const marinade = advance.getByRole('listitem').filter({ hasText: 'zamarynowania' });
  await expect(marinade.getByText('na 2 godz przed podaniem')).toBeVisible();

  // Kalkulator startu liczy godzinę rozpoczęcia z pory podania (18:00 − 2 godz).
  await page.locator('#serve-time').fill('18:00');
  await expect(marinade.getByText('zacznij o 16:00')).toBeVisible();

  // Tryb „Tylko kroki” zwija etapy wspierające, zostawiając samą listę kroków.
  await page.getByRole('button', { name: 'Tylko kroki' }).click();
  await expect(advance).toBeHidden();
  await expect(preparation).toBeHidden();
  await expect(page.getByRole('region', { name: 'Kroki' })).toBeVisible();

  await page.getByRole('button', { name: 'Tryb asystenta' }).click();
  await expect(advance).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('recipe page has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/recipes/makaron-z-cukinia-i-feta');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
