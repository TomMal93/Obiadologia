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
  await expect(decreaseServings).toHaveCSS('width', '44px');
  await expect(decreaseServings.locator('.servings-control__button-mark')).toHaveCSS(
    'width',
    '32px',
  );
  const metaLabelTops = await page.locator('.recipe-meta__label').evaluateAll(
    (labels) => labels.map((label) => label.getBoundingClientRect().top),
  );
  expect(new Set(metaLabelTops.map(Math.round)).size).toBe(1);
  const metaHeight = await page.locator('.recipe-meta').evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(metaHeight).toBeLessThanOrEqual(72);

  const tags = page.getByRole('list', { name: 'Tagi' });
  const heroContentOrder = await page.locator('.recipe-hero__caption > *').evaluateAll(
    (elements) => elements.map((element) => element.tagName),
  );
  expect(heroContentOrder).toEqual(['H1', 'UL']);
  await expect(tags.locator('.recipe-tags__separator')).toHaveCount(2);
  for (const tag of ['obiad', 'domowe', 'klasyka']) {
    await expect(tags.getByRole('listitem').filter({ hasText: tag })).toBeVisible();
  }

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  await expect(ingredients.getByText('0/12 odhaczonych')).toBeVisible();
  await expect(ingredients.getByRole('heading', { level: 3 })).toHaveText([
    'Warzywa i owoce',
    'Mięso i wędliny',
    'Nabiał i jajka',
    'Pieczywo i produkty zbożowe',
    'Spiżarnia',
    'Przyprawy',
  ]);
  const ingredientHeadGeometry = await ingredients.evaluate((section) => {
    const heading = section.querySelector('#ingredients-heading');
    const unitToggle = section.querySelector('.unit-toggle');
    const progress = section.querySelector('.ingredient-progress');
    if (
      !(heading instanceof HTMLElement)
      || !(unitToggle instanceof HTMLElement)
      || !(progress instanceof HTMLElement)
    ) {
      throw new Error('Ingredient section header was not found');
    }
    const headingBounds = heading.getBoundingClientRect();
    const toggleBounds = unitToggle.getBoundingClientRect();
    const progressBounds = progress.getBoundingClientRect();
    const sectionBounds = section.getBoundingClientRect();
    return {
      headingBottom: headingBounds.bottom,
      sectionLeft: sectionBounds.left,
      sectionRight: sectionBounds.right,
      toggleTop: toggleBounds.top,
      toggleLeft: toggleBounds.left,
      toggleBottom: toggleBounds.bottom,
      toggleRight: toggleBounds.right,
      toggleHeight: toggleBounds.height,
      progressTop: progressBounds.top,
      progressRight: progressBounds.right,
    };
  });
  expect(ingredientHeadGeometry.toggleTop).toBeGreaterThan(
    ingredientHeadGeometry.headingBottom,
  );
  expect(ingredientHeadGeometry.toggleLeft).toBeCloseTo(ingredientHeadGeometry.sectionLeft, 0);
  expect(ingredientHeadGeometry.toggleRight).toBeCloseTo(ingredientHeadGeometry.sectionRight, 0);
  expect(ingredientHeadGeometry.progressTop).toBeGreaterThanOrEqual(
    ingredientHeadGeometry.toggleBottom,
  );
  expect(ingredientHeadGeometry.progressRight).toBeCloseTo(
    ingredientHeadGeometry.toggleRight,
    0,
  );
  expect(ingredientHeadGeometry.toggleHeight).toBe(52);
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

  await page.getByRole('link', { name: 'Powrót do poprzedniego widoku' }).click();
  await expect(page).toHaveURL('/');
});

test('recipe back action restores the previous discovery view', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Szukaj' }).click();

  const dialog = page.getByRole('dialog');
  const search = dialog.getByRole('searchbox', { name: 'Szukaj przepisu' });
  await search.fill('schab');
  await dialog.getByRole('link', { name: /Kotlet schabowy z ziemniakami/ }).click();
  await expect(page).toHaveURL(/\/recipes\/kotlet-schabowy-z-ziemniakami$/);

  await page.getByRole('link', { name: 'Powrót do poprzedniego widoku' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('schab');
});

test('recipe preparation enables assistant mode and start-time calculation', async ({ page }) => {
  await page.goto('/recipes/kotlet-schabowy-z-ziemniakami');

  const preparation = page.getByRole('region', { name: 'Przygotowanie' });
  const startHelper = page.getByRole('region', { name: 'Kiedy zacząć' });
  const steps = page.getByRole('region', { name: 'Kroki' });
  const tips = page.getByRole('region', { name: 'Coś jeszcze' });
  await expect(preparation).toBeVisible();
  await expect(preparation.getByRole('listitem')).toHaveCount(4);
  await expect(startHelper.locator('.start-helper__hint')).toHaveCount(0);
  await expect(startHelper.locator('.start-helper__field')).toHaveCSS('padding', '0px');
  await expect(startHelper.locator('.start-helper__field')).toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  const cardStyles = await Promise.all(
    [startHelper, preparation, steps].map((section) =>
      section.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          border: styles.border,
          borderRadius: styles.borderRadius,
        };
      }),
    ),
  );
  expect(cardStyles[1]).toEqual(cardStyles[0]);
  expect(cardStyles[2]).toEqual(cardStyles[0]);
  await expect(startHelper).toHaveCSS('padding', '12px');
  await expect(startHelper).toHaveCSS('row-gap', '8px');
  const accentStyles = await Promise.all(
    [startHelper, tips].map((section) =>
      section.evaluate((element) => ({
        backgroundColor: getComputedStyle(element).backgroundColor,
        headingColor: getComputedStyle(element.querySelector('h2')!).color,
      })),
    ),
  );
  expect(accentStyles[0]).toEqual(accentStyles[1]);

  await page.locator('#serve-time').fill('18:00');
  await expect(
    page.getByText('Zacznij główne gotowanie o 17:10 — całość zajmuje około 50 min.'),
  ).toBeVisible();
  await expect(startHelper.locator('.start-helper__result')).toHaveCSS('font-size', '14px');

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

test('shakshuka restores gram amounts after switching unit modes', async ({ page }) => {
  await page.goto('/recipes/szakszuka');

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  const cumin = ingredients.locator('.ingredient').filter({ hasText: 'kmin rzymski mielony' });
  const metricMeasure = cumin.locator('.ingredient__measure-metric');
  const householdMeasure = cumin.locator('.ingredient__measure-household');

  await expect(metricMeasure).toHaveText('5 g');
  await ingredients.getByRole('button', { name: 'Miary domowe' }).click();
  await expect(householdMeasure).toHaveText('2½ łyżeczki');
  await ingredients.getByRole('button', { name: 'Gramy / ml' }).click();
  await expect(metricMeasure).toHaveText('5 g');
  await expect(metricMeasure).toBeVisible();
});

test('natural household measures scale with shakshuka servings', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  const servings = page.locator('[data-servings-output]');
  const decreaseServings = page.getByRole('button', { name: 'Zmniejsz liczbę porcji' });
  const rowFor = (name: string) => ingredients.locator('.ingredient').filter({ hasText: name });

  await expect(servings).toHaveText('2');
  await ingredients.getByRole('button', { name: 'Miary domowe' }).click();
  const chorizoMetric = rowFor('chorizo').locator('.ingredient__measure-metric');
  const chorizoHousehold = rowFor('chorizo').locator('.ingredient__measure-household');
  await expect(chorizoMetric).toBeHidden();
  await expect(chorizoHousehold).toBeVisible();
  await expect(chorizoHousehold).toHaveText('10 plastrów');
  await expect(rowFor('cukinia').locator('.ingredient__measure-household')).toHaveText(
    '1 sztuka',
  );
  await expect(rowFor('szpinak').locator('.ingredient__measure-household')).toHaveText(
    '4 garści',
  );
  await expect(rowFor('passata').locator('.ingredient__measure-household')).toHaveText(
    '1 szklanka',
  );
  await expect(rowFor('chleb żytni').locator('.ingredient__measure-household')).toHaveText(
    '4 kromki',
  );

  await decreaseServings.click();
  await expect(servings).toHaveText('1');
  await expect(rowFor('chorizo').locator('.ingredient__measure-household')).toHaveText(
    '5 plastrów',
  );
  await expect(rowFor('cukinia').locator('.ingredient__measure-household')).toHaveText(
    '½ sztuki',
  );
  await expect(rowFor('szpinak').locator('.ingredient__measure-household')).toHaveText(
    '2 garści',
  );
  await expect(rowFor('passata').locator('.ingredient__measure-household')).toHaveText(
    '½ szklanki',
  );
  await expect(rowFor('chleb żytni').locator('.ingredient__measure-household')).toHaveText(
    '2 kromki',
  );

  await ingredients.getByRole('button', { name: 'Gramy / ml' }).click();
  await expect(chorizoHousehold).toBeHidden();
  await expect(chorizoMetric).toBeVisible();
  await expect(chorizoMetric).toHaveText('40 g');
});
