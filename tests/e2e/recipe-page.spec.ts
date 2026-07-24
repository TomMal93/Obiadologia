import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('recipe page presents model data with ingredients and a way back', async ({ page }) => {
  await page.goto('/recipes/kurczak-z-grilla-z-salatka');

  await expect(page).toHaveTitle('Kurczak z grilla z sałatką — Obiadologia');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Kurczak z grilla z sałatką' }),
  ).toBeVisible();
  await expect(page.locator('.site-header')).toHaveCount(0);
  await expect(page.locator('.recipe-article > .recipe-hero')).toBeVisible();
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
  await page.getByRole('button', { name: 'Miary domowe' }).click();
  await expect(oliwaHousehold).toBeVisible();
  await expect(oliwaHousehold).toHaveText('2 łyżki');
  await expect(oliwaMetric).toBeHidden();
  await page.getByRole('button', { name: 'Gramy / ml' }).click();
  await expect(oliwaMetric).toBeVisible();

  // Składniki można lokalnie odhaczać, a postęp i stan nie opierają się na kolorze.
  await expect(ingredients.getByText('0/5 odhaczonych')).toBeVisible();
  const chickenToggle = ingredients.locator('[data-checkable-ingredient]').filter({ hasText: 'kurczak' });
  await expect(chickenToggle).toHaveAccessibleName('Odhacz składnik: kurczak');
  await chickenToggle.click();
  await expect(chickenToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(chickenToggle).toHaveAccessibleName('Cofnij odhaczenie składnika: kurczak');
  await expect(chickenToggle.locator('.ingredient__name')).toHaveCSS('text-decoration-line', 'line-through');
  await expect(ingredients.getByText('1/5 odhaczonych')).toBeVisible();

  const steps = page.getByRole('region', { name: 'Kroki' });
  await expect(steps.getByRole('heading', { level: 2, name: 'Kroki' })).toBeVisible();
  await expect(
    steps.getByRole('listitem').filter({ hasText: 'Rozgrzej grill i piecz kurczaka' }),
  ).toBeVisible();
  const firstStep = steps.locator('[data-checkable-step]').first();
  await expect(firstStep).toHaveAccessibleName('Oznacz krok 1 jako wykonany');
  await firstStep.click();
  await expect(firstStep).toHaveAttribute('aria-pressed', 'true');
  await expect(firstStep).toHaveAccessibleName('Cofnij wykonanie kroku 1');
  await expect(firstStep.locator('.recipe-step__text')).toHaveCSS('text-decoration-line', 'line-through');

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
  await expect(
    page.getByText('Zacznij główne gotowanie o 17:35 — całość zajmuje około 25 min.'),
  ).toBeVisible();
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

test('recipe document keeps one centered mobile composition without horizontal overflow', async ({
  page,
}) => {
  for (const width of [320, 375, 390, 430, 480, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/recipes/makaron-z-cukinia-i-feta');

    const geometry = await page.evaluate(() => {
      const shell = document.querySelector('.app-shell');
      if (!(shell instanceof HTMLElement)) throw new Error('App shell was not found');
      const bounds = shell.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        shellWidth: bounds.width,
        shellCenter: bounds.left + bounds.width / 2,
      };
    });

    expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);
    expect(geometry.shellWidth).toBeLessThanOrEqual(480);
    expect(geometry.shellCenter).toBeCloseTo(width / 2, 0);
  }
});
