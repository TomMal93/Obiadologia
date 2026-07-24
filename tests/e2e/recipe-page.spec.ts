import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('published pork cutlet recipe presents its complete model data', async ({ page }) => {
  await page.goto('/recipes/kotlet-schabowy-z-ziemniakami');

  await expect(page).toHaveTitle('Kotlet schabowy z ziemniakami — Obiadologia');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Kotlet schabowy z ziemniakami' }),
  ).toBeVisible();
  await expect(page.getByText(/Chrupiący kotlet schabowy w klasycznej panierce/)).toBeVisible();
  await expect(page.getByText('Czas przygotowania: 50 min')).toBeVisible();
  await expect(page.getByText('Średnia', { exact: true })).toBeVisible();

  const servings = page.locator('[data-servings-output]');
  const decreaseServings = page.getByRole('button', { name: 'Zmniejsz liczbę porcji' });
  const increaseServings = page.getByRole('button', { name: 'Zwiększ liczbę porcji' });
  await expect(servings).toHaveText('4');
  await expect(decreaseServings).toBeVisible();
  await expect(increaseServings).toBeVisible();

  const tags = page.getByRole('list', { name: 'Tagi' });
  for (const tag of ['obiad', 'domowe', 'klasyka']) {
    await expect(tags.getByRole('listitem').filter({ hasText: tag })).toBeVisible();
  }

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  await expect(ingredients.getByText('0/12 odhaczonych')).toBeVisible();
  await expect(
    ingredients.getByRole('button', { name: /Odhacz składnik: młode ziemniaki/ }),
  ).toBeVisible();
  await expect(
    ingredients.getByRole('button', { name: /Odhacz składnik: słonina albo wędzony boczek/ }),
  ).toBeVisible();
  await expect(
    ingredients.getByRole('button', { name: /Odhacz składnik: świeży koperek/ }),
  ).toBeVisible();

  const flour = ingredients.locator('.ingredient').filter({ hasText: 'mąka pszenna' });
  const pork = ingredients.locator('.ingredient').filter({ hasText: 'schab bez kości' });
  await expect(flour.locator('.ingredient__measure-metric')).toHaveText('60 g');
  await expect(pork.locator('.ingredient__measure-metric')).toHaveText('600 g');
  await increaseServings.click();
  await expect(servings).toHaveText('5');
  await expect(pork.locator('.ingredient__measure-metric')).toHaveText('750 g');
  await decreaseServings.click();
  await expect(servings).toHaveText('4');
  await expect(pork.locator('.ingredient__measure-metric')).toHaveText('600 g');

  await page.getByRole('button', { name: 'Miary domowe' }).click();
  await expect(flour.locator('.ingredient__measure-household')).toHaveText('½ szklanki');

  const porkToggle = ingredients.locator('[data-checkable-ingredient]').filter({
    hasText: 'schab bez kości',
  });
  await porkToggle.click();
  await expect(porkToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(ingredients.getByText('1/12 odhaczonych')).toBeVisible();

  const steps = page.getByRole('region', { name: 'Kroki' });
  await expect(steps.getByRole('listitem')).toHaveCount(8);
  const firstStep = steps.locator('[data-checkable-step]').first();
  await firstStep.click();
  await expect(firstStep).toHaveAttribute('aria-pressed', 'true');

  const tips = page.getByRole('region', { name: 'Coś jeszcze' });
  await expect(tips.getByRole('listitem')).toHaveCount(3);
  await expect(tips.getByText(/Nie wkładaj na patelnię zbyt wielu kotletów/)).toBeVisible();
  await expect(tips.getByText(/Blender uwolni za dużo skrobi/)).toBeVisible();
  expect(
    await tips.evaluate((element) =>
      element.previousElementSibling?.classList.contains('recipe-steps'),
    ),
  ).toBe(true);

  await page.getByRole('link', { name: 'Wróć do strony głównej' }).click();
  await expect(page).toHaveURL('/');
});

test('recipe preparation enables assistant mode and start-time calculation', async ({ page }) => {
  await page.goto('/recipes/kotlet-schabowy-z-ziemniakami');

  const preparation = page.getByRole('region', { name: 'Przygotowanie' });
  await expect(preparation).toBeVisible();
  await expect(preparation.getByRole('listitem')).toHaveCount(4);

  await page.locator('#serve-time').fill('18:00');
  await expect(
    page.getByText('Zacznij główne gotowanie o 17:10 — całość zajmuje około 50 min.'),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Tylko kroki' }).click();
  await expect(preparation).toBeHidden();
  await expect(page.getByRole('region', { name: 'Kroki' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Coś jeszcze' })).toBeVisible();

  await page.getByRole('button', { name: 'Tryb asystenta' }).click();
  await expect(preparation).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('recipe page stays centered and has no horizontal overflow', async ({ page }) => {
  for (const width of [320, 375, 390, 430, 480, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/recipes/kotlet-schabowy-z-ziemniakami');

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
