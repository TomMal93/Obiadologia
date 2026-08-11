import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('published chorizo shakshuka recipe presents its complete model data', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  await expect(page).toHaveTitle('Szakszuka z chorizo i cukinią — Obiadologia');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Szakszuka z chorizo i cukinią' }),
  ).toBeVisible();
  await expect(page.getByText(/Aromatyczna szakszuka z rumianym chorizo/)).toBeVisible();
  await expect(page.getByText('Czas przygotowania: 35 min')).toBeVisible();
  await expect(page.getByText('Łatwa', { exact: true })).toBeVisible();

  const servings = page.locator('[data-servings-output]');
  const decreaseServings = page.getByRole('button', { name: 'Zmniejsz liczbę porcji' });
  const increaseServings = page.getByRole('button', { name: 'Zwiększ liczbę porcji' });
  await expect(servings).toHaveText('2');
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
  for (const tag of ['śniadanie', 'jajka', 'jedna patelnia']) {
    await expect(tags.getByRole('listitem').filter({ hasText: tag })).toBeVisible();
  }

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  await expect(ingredients.getByText('0/13 zebrane')).toBeVisible();
  await expect(ingredients.getByRole('heading', { level: 3 })).toHaveText([
    'Warzywa i owoce',
    'Mięso i wędliny',
    'Nabiał i jajka',
    'Pieczywo i produkty zbożowe',
    'Spiżarnia',
    'Przyprawy',
  ]);
  await expect(ingredients.locator('.unit-toggle')).toHaveCount(0);
  const ingredientHeadGeometry = await ingredients.evaluate((section) => {
    const heading = section.querySelector('#ingredients-heading');
    const progress = section.querySelector('.ingredient-progress');
    if (!(heading instanceof HTMLElement) || !(progress instanceof HTMLElement)) {
      throw new Error('Ingredient section header was not found');
    }
    const headingBounds = heading.getBoundingClientRect();
    const progressBounds = progress.getBoundingClientRect();
    const sectionBounds = section.getBoundingClientRect();
    const sectionStyles = getComputedStyle(section);
    return {
      headingCenter: headingBounds.top + headingBounds.height / 2,
      headingRight: headingBounds.right,
      sectionRight: sectionBounds.right,
      sectionBorderRight: Number.parseFloat(sectionStyles.borderRightWidth),
      sectionPaddingRight: Number.parseFloat(sectionStyles.paddingRight),
      progressCenter: progressBounds.top + progressBounds.height / 2,
      progressLeft: progressBounds.left,
      progressRight: progressBounds.right,
    };
  });
  // Licznik stoi w wierszu nagłówka, po jego prawej, przy krawędzi sekcji.
  expect(ingredientHeadGeometry.progressCenter).toBeCloseTo(
    ingredientHeadGeometry.headingCenter,
    0,
  );
  expect(ingredientHeadGeometry.progressLeft).toBeGreaterThanOrEqual(
    ingredientHeadGeometry.headingRight,
  );
  expect(ingredientHeadGeometry.progressRight).toBeCloseTo(
    ingredientHeadGeometry.sectionRight
      - ingredientHeadGeometry.sectionBorderRight
      - ingredientHeadGeometry.sectionPaddingRight,
    0,
  );
  await expect(
    ingredients.getByRole('button', { name: /Odhacz składnik: chorizo/ }),
  ).toBeVisible();
  await expect(
    ingredients.getByRole('button', { name: /Odhacz składnik: cukinia/ }),
  ).toBeVisible();
  await expect(
    ingredients.getByRole('button', { name: /Odhacz składnik: passata pomidorowa/ }),
  ).toBeVisible();

  const chorizo = ingredients.locator('.ingredient').filter({ hasText: 'chorizo' });
  const zucchini = ingredients.locator('.ingredient').filter({ hasText: 'cukinia' });
  await expect(chorizo.locator('[data-ingredient-measure]')).toHaveText('80 g / 10 plastrów');
  await expect(zucchini.locator('[data-ingredient-measure]')).toHaveText('300 g / 1 sztuka');
  await increaseServings.click();
  await expect(servings).toHaveText('3');
  await expect(chorizo.locator('[data-ingredient-measure]')).toHaveText('120 g / 15 plastrów');
  await decreaseServings.click();
  await expect(servings).toHaveText('2');
  await expect(chorizo.locator('[data-ingredient-measure]')).toHaveText('80 g / 10 plastrów');

  const chorizoToggle = ingredients.locator('[data-checkable-ingredient]').filter({
    hasText: 'chorizo',
  });
  await chorizoToggle.click();
  await expect(chorizoToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(ingredients.getByText('1/13 zebrane')).toBeVisible();

  await page.getByRole('button', { name: 'Tylko kroki' }).click();
  const steps = page.getByRole('region', { name: 'Kroki' });
  await expect(steps.getByRole('listitem')).toHaveCount(9);
  const firstStep = steps.locator('.steps-only-section [data-checkable-step]').first();
  await firstStep.click();
  await expect(firstStep).toHaveAttribute('aria-pressed', 'true');

  const tips = page.getByRole('region', { name: 'Coś jeszcze' });
  await expect(tips.getByRole('listitem')).toHaveCount(3);
  await expect(tips.getByText(/Bazę możesz przygotować do momentu dodania jajek/)).toBeVisible();
  await expect(tips.getByText(/Z solą postępuj ostrożnie/)).toBeVisible();
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
  await search.fill('chorizo');
  await dialog.getByRole('link', { name: /Szakszuka z chorizo i cukinią/ }).click();
  await expect(page).toHaveURL(/\/recipes\/szakszuka-z-chorizo-i-cukinia$/);

  await page.getByRole('link', { name: 'Powrót do poprzedniego widoku' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('chorizo');
});

test('recipe preparation enables assistant mode', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const preparation = page.getByRole('region', { name: 'Zanim zaczniesz' });
  const steps = page.getByRole('region', { name: 'Kroki' });
  const tips = page.getByRole('region', { name: 'Coś jeszcze' });
  const assistantMode = page.getByRole('button', { name: 'Tryb asystenta' });
  const stepsMode = page.getByRole('button', { name: 'Tylko kroki' });
  await expect(page.getByText('Wybierz tryb, aby zobaczyć dalszą część przepisu.')).toBeVisible();
  await expect(assistantMode).toHaveAttribute('aria-pressed', 'false');
  await expect(stepsMode).toHaveAttribute('aria-pressed', 'false');
  await expect(preparation).toBeHidden();
  await expect(steps).toBeHidden();
  await expect(tips).toBeHidden();

  await assistantMode.click();
  await expect(assistantMode).toHaveAttribute('aria-pressed', 'true');
  await expect(stepsMode).toHaveAttribute('aria-pressed', 'false');
  await expect(preparation).toBeVisible();
  await expect(preparation.getByRole('listitem')).toHaveCount(5);
  const assistantSteps = steps.locator('.step-list.assistant-section');
  const standaloneSteps = steps.locator('.step-list.steps-only-section');
  await expect(assistantSteps).toBeVisible();
  await expect(standaloneSteps).toBeHidden();
  await expect(assistantSteps.getByRole('listitem')).toHaveCount(7);
  await expect(assistantSteps.getByRole('listitem').first()).toContainText(
    'Połóż chorizo na zimnej patelni',
  );
  const choiceHeadingLeft = await page.getByRole('heading', {
    name: 'Jak chcesz gotować?',
  }).evaluate((element) => element.getBoundingClientRect().left);
  const preparationHeadingLeft = await preparation.getByRole('heading', {
    name: 'Zanim zaczniesz',
  }).evaluate((element) => element.getBoundingClientRect().left);
  expect(choiceHeadingLeft).toBeCloseTo(preparationHeadingLeft, 0);
  const neutralCardStyles = await Promise.all(
    [preparation, steps].map((section) =>
      section.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          border: styles.border,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          rowGap: styles.rowGap,
          backgroundColor: styles.backgroundColor,
          headingColor: getComputedStyle(element.querySelector('h2')!).color,
        };
      }),
    ),
  );
  expect(neutralCardStyles[1]).toEqual(neutralCardStyles[0]);

  await stepsMode.click();
  await expect(preparation).toBeHidden();
  await expect(page.getByRole('region', { name: 'Kroki' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Coś jeszcze' })).toBeVisible();
  // „Tylko kroki” ukrywa „Zanim zaczniesz”, więc jego kroki muszą same nieść
  // krojenie i osuszanie — to inny tekst niż lista trybu asystenta.
  await expect(assistantSteps).toBeHidden();
  await expect(standaloneSteps).toBeVisible();
  await expect(standaloneSteps.getByRole('listitem')).toHaveCount(9);
  await expect(standaloneSteps.getByRole('listitem').first()).toContainText(
    'Cukinię pokrój w półplastry',
  );

  await assistantMode.click();
  await expect(preparation).toBeVisible();
  await expect(assistantSteps).toBeVisible();
  await expect(standaloneSteps).toBeHidden();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('recipe page stays centered and has no horizontal overflow', async ({ page }) => {
  for (const width of [320, 375, 390, 430, 480, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

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

test('ingredient counter fills its ring and lands on a complete state', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  const progress = ingredients.locator('[data-ingredient-progress]');
  const progressText = progress.locator('[data-ingredient-progress-text]');
  const arc = progress.locator('.ingredient-progress__arc');
  const toggles = ingredients.locator('[data-checkable-ingredient]');
  // Nieprzebyta część pierścienia; wartość wyliczona ma postać `calc(0.92px)`.
  const ringRemainder = () =>
    arc.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).strokeDashoffset.replace(/[^\d.]+/g, ' ').trim()),
    );

  await expect(progressText).toHaveText('0/13 zebrane');
  expect(await ringRemainder()).toBeCloseTo(1, 2);

  await toggles.first().click();
  await expect(progressText).toHaveText('1/13 zebrane');
  // Pierścień dojeżdża płynnie, więc czekamy na koniec przejścia.
  await expect.poll(ringRemainder).toBeCloseTo(12 / 13, 2);

  const total = await toggles.count();
  for (let index = 1; index < total; index += 1) {
    await toggles.nth(index).click();
  }
  await expect(progressText).toHaveText('Komplet');
  await expect(progress).toHaveClass(/is-complete/);
  await expect(progress.locator('.ingredient-progress__mark')).toHaveCSS('opacity', '1');

  await toggles.first().click();
  await expect(progressText).toHaveText('12/13 zebrane');
  await expect(progress).not.toHaveClass(/is-complete/);
});

test('mixed ingredient measures scale with shakshuka servings', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  const servings = page.locator('[data-servings-output]');
  const decreaseServings = page.getByRole('button', { name: 'Zmniejsz liczbę porcji' });
  const measureFor = (name: string) =>
    ingredients.locator('.ingredient').filter({ hasText: name }).locator(
      '[data-ingredient-measure]',
    );

  await expect(servings).toHaveText('2');
  await expect(ingredients.getByRole('group')).toHaveCount(0);
  // Mieszana lista: forma metryczna, sama domowa i obie rozdzielone ukośnikiem.
  await expect(measureFor('chorizo')).toHaveText('80 g / 10 plastrów');
  await expect(measureFor('cukinia')).toHaveText('300 g / 1 sztuka');
  await expect(measureFor('szpinak')).toHaveText('100 g / 4 garści');
  await expect(measureFor('passata')).toHaveText('240 g / 1 szklanka');
  await expect(measureFor('chleb żytni')).toHaveText('4 kromki');
  await expect(measureFor('szczypiorek')).toHaveText('4 łyżki');
  await expect(measureFor('sól')).toHaveText('2 szczypty');
  await expect(measureFor('jajka')).toHaveText('8 sztuk');
  await expect(measureFor('oregano')).toHaveText('2 g');

  await decreaseServings.click();
  await expect(servings).toHaveText('1');
  await expect(measureFor('chorizo')).toHaveText('40 g / 5 plastrów');
  await expect(measureFor('cukinia')).toHaveText('150 g / ½ sztuki');
  await expect(measureFor('szpinak')).toHaveText('50 g / 2 garści');
  await expect(measureFor('passata')).toHaveText('120 g / ½ szklanki');
  await expect(measureFor('chleb żytni')).toHaveText('2 kromki');
  await expect(measureFor('szczypiorek')).toHaveText('2 łyżki');
  await expect(measureFor('sól')).toHaveText('1 szczypta');
  await expect(measureFor('jajka')).toHaveText('4 sztuki');
  await expect(measureFor('oregano')).toHaveText('1 g');
});
