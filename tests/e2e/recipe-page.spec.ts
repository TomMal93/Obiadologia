import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('published chorizo shakshuka recipe presents its complete model data', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  await expect(page).toHaveTitle('Szakszuka — Obiadologia');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Szakszuka' }),
  ).toBeVisible();
  await expect(page.getByText(/Klasyczna szakszuka w bogatszym wydaniu/)).toBeVisible();
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
  expect(metaHeight).toBeLessThanOrEqual(160);

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
  await expect(ingredients.getByText('0/5')).toBeVisible();
  await expect(ingredients.getByRole('heading', { level: 3 })).toHaveText([
    'Warzywa i owoce',
    'Mięso i wędliny',
    'Nabiał i jajka',
    'Pieczywo i produkty zbożowe',
    'Spiżarnia',
    'Przyprawy',
  ]);
  await expect(ingredients.getByRole('heading', { level: 3 }).first()).toHaveCSS(
    'font-size',
    '14px',
  );
  await expect(ingredients.getByRole('heading', { level: 3 }).first()).toHaveCSS(
    'font-weight',
    '700',
  );
  await expect(ingredients.locator('.unit-toggle')).toHaveCount(0);
  await expect(ingredients.locator('.recipe-section-toggle')).toBeVisible();
  const ingredientHeadGeometry = await ingredients.evaluate((section) => {
    const heading = section.querySelector('#ingredients-heading');
    const chevron = section.querySelector('.recipe-section-toggle > svg');
    if (
      !(heading instanceof HTMLElement)
      || !(chevron instanceof SVGElement)
    ) {
      throw new Error('Ingredient section header was not found');
    }
    const headingBounds = heading.getBoundingClientRect();
    const chevronBounds = chevron.getBoundingClientRect();
    const sectionBounds = section.getBoundingClientRect();
    const sectionStyles = getComputedStyle(section);
    return {
      headingCenter: headingBounds.top + headingBounds.height / 2,
      sectionRight: sectionBounds.right,
      sectionBorderRight: Number.parseFloat(sectionStyles.borderRightWidth),
      sectionPaddingRight: Number.parseFloat(sectionStyles.paddingRight),
      chevronRight: chevronBounds.right,
    };
  });
  expect(ingredientHeadGeometry.chevronRight).toBeCloseTo(
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

  const meatGroup = ingredients.locator('[data-ingredient-group]').filter({ hasText: 'Mięso i wędliny' });
  const chorizoToggle = ingredients.locator('[data-checkable-ingredient]').filter({
    hasText: 'chorizo',
  });
  await chorizoToggle.click();
  await expect(chorizoToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(meatGroup.getByText('Komplet')).toBeVisible();

  await page.getByRole('button', { name: 'Tylko kroki' }).click();
  const steps = page.getByRole('region', { name: 'Kroki' });
  const standaloneJourney = steps.locator('[data-step-journey="steps"]');
  await expect(steps.getByRole('listitem')).toHaveCount(9);
  await expect(standaloneJourney.locator('[data-steps-progress-text]')).toHaveText('Krok 1 z 9');

  const stepItems = standaloneJourney.locator('[data-step-item]');
  const firstStep = stepItems.first();
  const secondStep = stepItems.nth(1);
  const firstStepAction = firstStep.locator('[data-checkable-step]');
  // Ścieżka prowadzi po jednym etapie: rozwinięty jest tylko najbliższy do zrobienia.
  await expect(firstStep).toHaveClass(/is-current/);
  await expect(firstStep.locator('[data-step-body]')).toBeVisible();
  await expect(secondStep.locator('[data-step-body]')).toBeHidden();
  await expect(firstStep.locator('[data-step-badge]')).toHaveText('1');
  await expect(firstStepAction).toBeVisible();
  await expect(firstStepAction).toContainText('Oznacz jako zrobione');
  await expect(firstStepAction).toHaveCSS('color', 'rgb(168, 45, 24)');
  await expect(firstStepAction).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(firstStepAction).toHaveCSS('border-radius', '999px');
  const [firstStepActionBox, firstStepBox] = await Promise.all([
    firstStepAction.boundingBox(),
    firstStep.locator('.step-final').boundingBox(),
  ]);
  expect(firstStepActionBox).not.toBeNull();
  expect(firstStepBox).not.toBeNull();
  expect(firstStepActionBox!.x + firstStepActionBox!.width / 2).toBeCloseTo(
    firstStepBox!.x + firstStepBox!.width / 2,
    0,
  );

  await firstStepAction.click();
  await expect(firstStepAction).toHaveAttribute('aria-pressed', 'true');
  await expect(firstStep).toHaveClass(/is-done/);
  await expect(firstStep.locator('[data-step-badge]')).toHaveText('✓');
  // Wykonany etap zwija się do samej jednoliniowej zapowiedzi treści — kafel nie
  // powtarza numeru etykietą „Etap 1” — a ścieżka rozwija kolejny etap do zrobienia.
  await expect(firstStep.locator('[data-step-body]')).toBeHidden();
  await expect(firstStep.locator('.step-item__preview')).toBeVisible();
  await expect(firstStep.locator('.step-item__label')).toHaveCount(0);
  await expect(secondStep.locator('[data-step-body]')).toBeVisible();
  await expect(standaloneJourney.locator('[data-steps-progress-text]')).toHaveText('Krok 2 z 9');

  await firstStep.locator('[data-step-head]').click();
  await expect(firstStep.locator('[data-step-body]')).toBeVisible();
  await expect(firstStep.locator('.step-final__text')).toHaveCSS(
    'text-decoration-line',
    'line-through',
  );
  await expect(firstStepAction).toContainText('Zrobione');
  await expect(firstStepAction).toHaveCSS('background-color', 'rgb(168, 45, 24)');
  await firstStepAction.click();
  await expect(firstStepAction).toHaveAttribute('aria-pressed', 'false');
  await expect(firstStep.locator('[data-step-badge]')).toHaveText('1');

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
  await dialog.getByRole('link', { name: /Szakszuka/ }).click();
  await expect(page).toHaveURL(/\/recipes\/szakszuka-z-chorizo-i-cukinia$/);

  await page.getByRole('link', { name: 'Powrót do poprzedniego widoku' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('chorizo');
});

test('recipe preparation groups day-before and just-in-time tasks in assistant mode', async ({ page }) => {
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
  await expect(page.getByText('Kiedy zacząć')).toHaveCount(0);

  await assistantMode.click();
  await expect(assistantMode).toHaveAttribute('aria-pressed', 'true');
  await expect(stepsMode).toHaveAttribute('aria-pressed', 'false');
  await expect(preparation).toBeVisible();
  await expect(preparation.getByRole('listitem')).toHaveCount(5);
  await expect(preparation).toContainText(
    'przygotowanie tych rzeczy wcześniej może usprawnić późniejsze gotowanie',
  );
  await expect(
    preparation.getByRole('button', { name: 'Zanim zaczniesz', exact: true }),
  ).toHaveAttribute('aria-expanded', 'true');
  await expect(preparation.getByRole('listitem').first()).toBeVisible();
  await expect(
    preparation.getByRole('region', { name: 'Nawet dzień wcześniej' }).getByRole('listitem'),
  ).toHaveCount(2);
  await expect(
    preparation.getByRole('region', { name: 'Tuż przed lub w trakcie' }).getByRole('listitem'),
  ).toHaveCount(3);
  const assistantSteps = steps.locator('[data-step-journey="assistant"]');
  const standaloneSteps = steps.locator('[data-step-journey="steps"]');
  const halfSteps = assistantSteps.locator('[data-preparation-half-step]');
  const assistantStepItems = assistantSteps.locator('[data-step-item]');
  await expect(assistantSteps).toBeVisible();
  await expect(standaloneSteps).toBeHidden();
  await expect(assistantStepItems).toHaveCount(7);
  await expect(assistantSteps.locator('[data-steps-progress-text]')).toHaveText('Krok 1 z 7');
  await expect(halfSteps).toHaveCount(5);
  await expect(assistantSteps.getByText('Do zrobienia', { exact: true })).toHaveCount(0);

  // Ścieżka prowadzi etap po etapie: rozwinięty jest tylko najbliższy do
  // zrobienia, a przypisane półkroki są częścią jego karty.
  const firstStepItem = assistantStepItems.first();
  await expect(firstStepItem).toHaveClass(/is-current/);
  await expect(firstStepItem.locator('[data-step-body]')).toBeVisible();
  await expect(assistantStepItems.nth(1).locator('[data-step-body]')).toBeHidden();
  await expect(firstStepItem.getByText('Przygotuj przed wykonaniem')).toBeVisible();
  await expect(firstStepItem.locator('[data-step-group-progress]')).toContainText(
    '0/3 wykonane',
  );
  await expect(firstStepItem.getByText('Finalny krok')).toBeVisible();
  // Finalny krok stoi bez znacznika z numerem — numer niesie wyłącznie oś.
  await expect(firstStepItem.locator('.step-final__badge')).toHaveCount(0);
  await expect(firstStepItem.locator('.step-final__text')).toContainText(
    'Połóż chorizo na zimnej patelni',
  );
  const halfStepTargets = await halfSteps.evaluateAll((items) =>
    items.map((item) => item.closest<HTMLElement>('[data-step-item]')?.dataset.stepNumber),
  );
  expect(halfStepTargets).toEqual(['1', '1', '1', '2', '4']);

  const chorizoPreparation = preparation.getByRole('button', { name: /Pokrój chorizo/ });
  const chorizoHalfStep = assistantSteps.locator(
    '[data-preparation-half-step="pokroj-chorizo"]',
  );
  const chorizoHalfStepToggle = chorizoHalfStep.getByRole('button');
  await expect(chorizoPreparation).toHaveAttribute('aria-pressed', 'false');
  await expect(chorizoHalfStep).toBeVisible();
  await chorizoPreparation.click();
  await expect(chorizoPreparation).toHaveAttribute('aria-pressed', 'true');
  await expect(chorizoHalfStepToggle).toHaveAttribute('aria-pressed', 'true');
  await expect(chorizoHalfStepToggle).toHaveClass(/is-checked/);
  await expect(chorizoHalfStep.locator('.step-prep__text')).toBeVisible();
  await expect(chorizoHalfStep.locator('.step-prep__text')).toHaveCSS(
    'text-decoration-line',
    'line-through',
  );
  await expect(chorizoHalfStep).not.toContainText('Gotowe');
  await expect(chorizoHalfStepToggle).toHaveAttribute(
    'aria-label',
    /Cofnij wykonanie przygotowania/,
  );
  await expect(firstStepItem.locator('[data-step-group-progress]')).toContainText(
    '1/3 wykonane',
  );
  await chorizoPreparation.click();
  await expect(chorizoHalfStepToggle).toHaveAttribute('aria-pressed', 'false');
  await expect(firstStepItem.locator('[data-step-group-progress]')).toContainText(
    '0/3 wykonane',
  );

  await chorizoHalfStepToggle.click();
  await expect(chorizoPreparation).toHaveAttribute('aria-pressed', 'true');
  await expect(chorizoHalfStepToggle).toBeFocused();

  const firstCookingStep = firstStepItem.locator('[data-checkable-step]');
  const preparationBeforeFirstStep = firstStepItem.locator('[data-preparation-toggle]');
  await expect(preparationBeforeFirstStep).toHaveCount(3);
  await firstCookingStep.click();
  await expect(firstCookingStep).toHaveAttribute('aria-pressed', 'true');
  await expect(firstStepItem.locator('[data-step-group-progress]')).toContainText(
    'Przygotowanie gotowe',
  );
  for (const preparationButton of await preparationBeforeFirstStep.all()) {
    await expect(preparationButton).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(
    assistantSteps.locator(
      '[data-preparation-half-step][data-before-step="2"] [data-preparation-toggle]',
    ),
  ).toHaveAttribute('aria-pressed', 'false');
  await expect(
    assistantSteps.locator(
      '[data-preparation-half-step][data-before-step="4"] [data-preparation-toggle]',
    ),
  ).toHaveAttribute('aria-pressed', 'false');
  // Wykonany etap zwija się, a ścieżka rozwija kolejny do zrobienia.
  await expect(firstStepItem.locator('[data-step-body]')).toBeHidden();
  await expect(assistantStepItems.nth(1).locator('[data-step-body]')).toBeVisible();
  await expect(assistantSteps.locator('[data-steps-progress-text]')).toHaveText('Krok 2 z 7');

  await firstStepItem.locator('[data-step-head]').click();
  await firstCookingStep.click();
  await expect(firstCookingStep).toHaveAttribute('aria-pressed', 'false');
  await expect(firstStepItem.locator('[data-step-group-progress]')).toContainText(
    '0/3 wykonane',
  );
  for (const preparationButton of await preparationBeforeFirstStep.all()) {
    await expect(preparationButton).toHaveAttribute('aria-pressed', 'false');
  }

  // Drugi etap został rozwinięty przez ścieżkę i pozostał otwarty mimo powrotu
  // do pierwszego, więc jego akcja jest dostępna od razu.
  const secondStepItem = assistantStepItems.nth(1);
  await expect(secondStepItem.locator('[data-step-body]')).toBeVisible();
  await secondStepItem.locator('[data-checkable-step]').click();
  for (const preparationButton of await preparationBeforeFirstStep.all()) {
    await expect(preparationButton).toHaveAttribute('aria-pressed', 'false');
  }
  await expect(
    assistantSteps.locator(
      '[data-preparation-half-step][data-before-step="2"] [data-preparation-toggle]',
    ),
  ).toHaveAttribute('aria-pressed', 'true');

  const choiceHeadingLeft = await page.getByRole('heading', {
    name: 'Jak chcesz gotować?',
  }).evaluate((element) => element.getBoundingClientRect().left);
  const descriptionHeadingLeft = await page.getByRole('heading', {
    name: 'O daniu',
  }).evaluate((element) => element.getBoundingClientRect().left);
  expect(choiceHeadingLeft).toBeCloseTo(descriptionHeadingLeft, 0);
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
  // Wersja samodzielna nie ma półkroków, więc nie ma też licznika przygotowania.
  await expect(standaloneSteps.locator('[data-step-group-progress]')).toHaveCount(0);
  await expect(standaloneSteps.locator('[data-steps-progress-text]')).toHaveText('Krok 1 z 9');
  const standaloneStepItems = standaloneSteps.locator('[data-step-item]');
  await standaloneStepItems.first().locator('[data-checkable-step]').click();
  await expect(standaloneStepItems.first()).toHaveClass(/is-done/);
  await expect(standaloneSteps.locator('[data-steps-progress-text]')).toHaveText('Krok 2 z 9');
  await expect(standaloneSteps.getByRole('listitem').first()).toContainText(
    'Cukinię pokrój w półplastry',
  );

  await assistantMode.click();
  await expect(preparation).toBeVisible();
  await expect(assistantSteps).toBeVisible();
  await expect(standaloneSteps).toBeHidden();
  await expect(chorizoHalfStep).toBeVisible();
  await expect(chorizoHalfStep.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('every main recipe section can be collapsed and expanded independently', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const description = page.getByRole('region', { name: 'O daniu' });
  const ingredients = page.getByRole('region', { name: 'Składniki' });

  for (const { section, name, content } of [
    {
      section: description,
      name: 'O daniu',
      content: description.getByText(/Aromatyczna szakszuka z rumianym chorizo/),
    },
    {
      section: ingredients,
      name: 'Składniki',
      content: ingredients.getByText('Warzywa i owoce'),
    },
  ]) {
    const toggle = section.getByRole('button', { name, exact: true });
    await toggle.click();
    await expect(content).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(content).toBeVisible();
  }

  const choice = page.getByRole('button', { name: 'Jak chcesz gotować?', exact: true });
  const neutralFrameColors = await page.evaluate(() => {
    const cookingFlow = document.querySelector('.recipe-cooking-flow');
    const ingredientsFrame = document.querySelector('.recipe-ingredients');
    if (!(cookingFlow instanceof HTMLElement) || !(ingredientsFrame instanceof HTMLElement)) {
      throw new Error('Nie znaleziono ramek przepisu');
    }
    return {
      cookingFlow: getComputedStyle(cookingFlow).borderColor,
      ingredients: getComputedStyle(ingredientsFrame).borderColor,
      cookingFlowBackground: getComputedStyle(cookingFlow).backgroundColor,
      cookingFlowBackgroundImage: getComputedStyle(cookingFlow).backgroundImage,
      cookingFlowGradientOpacity: getComputedStyle(cookingFlow, '::before').opacity,
      cookingFlowGradientTransition: getComputedStyle(cookingFlow, '::before').transitionDuration,
      ingredientsBackground: getComputedStyle(ingredientsFrame).backgroundColor,
    };
  });
  expect(neutralFrameColors.cookingFlow).toBe(neutralFrameColors.ingredients);
  expect(neutralFrameColors.cookingFlowBackground).toBe(
    neutralFrameColors.ingredientsBackground,
  );
  expect(neutralFrameColors.cookingFlowBackgroundImage).toBe('none');
  expect(neutralFrameColors.cookingFlowGradientOpacity).toBe('0');
  expect(neutralFrameColors.cookingFlowGradientTransition).not.toBe('0s');
  const toggleRightInsets = await page.evaluate(() => {
    const getRightInset = (containerSelector: string, toggleName: string) => {
      const container = document.querySelector(containerSelector);
      const toggle = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-section-toggle]'))
        .find((button) => button.textContent?.trim() === toggleName);
      const icon = toggle?.querySelector(':scope > svg');
      if (!(container instanceof HTMLElement) || !(icon instanceof SVGElement)) {
        throw new Error(`Nie znaleziono geometrii sekcji: ${toggleName}`);
      }
      return container.getBoundingClientRect().right - icon.getBoundingClientRect().right;
    };

    return {
      description: getRightInset('.recipe-lead', 'O daniu'),
      cookingChoice: getRightInset('.recipe-cooking-flow', 'Jak chcesz gotować?'),
    };
  });
  expect(toggleRightInsets.cookingChoice).toBeCloseTo(toggleRightInsets.description, 0);
  await choice.click();
  await expect(page.getByRole('button', { name: 'Tryb asystenta' })).toBeHidden();
  const collapsedFrameShapes = await page.evaluate(() => {
    const cookingFlow = document.querySelector('.recipe-cooking-flow');
    const description = document.querySelector('.recipe-lead');
    if (!(cookingFlow instanceof HTMLElement) || !(description instanceof HTMLElement)) {
      throw new Error('Nie znaleziono ramek do porównania kształtu');
    }
    const cookingStyles = getComputedStyle(cookingFlow);
    const descriptionStyles = getComputedStyle(description);
    return {
      cookingBorderRadius: cookingStyles.borderRadius,
      descriptionBorderRadius: descriptionStyles.borderRadius,
      cookingPadding: cookingStyles.padding,
      descriptionPadding: descriptionStyles.padding,
    };
  });
  expect(collapsedFrameShapes.cookingBorderRadius).toBe(
    collapsedFrameShapes.descriptionBorderRadius,
  );
  expect(collapsedFrameShapes.cookingPadding).toBe(collapsedFrameShapes.descriptionPadding);
  await choice.click();
  await page.getByRole('button', { name: 'Tryb asystenta' }).click();
  await expect(page.locator('.recipe-cooking-flow')).not.toHaveCSS(
    'border-color',
    neutralFrameColors.ingredients,
  );
  await expect.poll(() => page.locator('.recipe-cooking-flow').evaluate(
    (element) => getComputedStyle(element, '::before').opacity,
  )).toBe('1');

  await choice.click();
  await expect(page.getByRole('region', { name: 'Zanim zaczniesz' })).toBeHidden();
  await expect(page.getByRole('region', { name: 'Kroki' })).toBeHidden();
  await expect(page.getByRole('region', { name: 'Coś jeszcze' })).toBeHidden();
  await choice.click();

  for (const name of ['Zanim zaczniesz', 'Kroki', 'Coś jeszcze']) {
    const section = page.getByRole('region', { name });
    const toggle = section.getByRole('button', { name, exact: true });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    if (name === 'Zanim zaczniesz' || name === 'Kroki') {
      const centers = await section.evaluate((element) => {
        const head = element.querySelector('.recipe-section-head');
        const icon = element.querySelector('.recipe-section-toggle > svg');
        if (!(head instanceof HTMLElement) || !(icon instanceof SVGElement)) {
          throw new Error('Nie znaleziono geometrii zwiniętego nagłówka');
        }
        const headBounds = head.getBoundingClientRect();
        const iconBounds = icon.getBoundingClientRect();
        return {
          head: headBounds.top + headBounds.height / 2,
          icon: iconBounds.top + iconBounds.height / 2,
        };
      });
      expect(centers.icon).toBeCloseTo(centers.head, 0);
    }
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    if (name === 'Zanim zaczniesz' || name === 'Kroki') {
      const centers = await section.evaluate((element) => {
        const head = element.querySelector('.recipe-section-head');
        const icon = element.querySelector('.recipe-section-toggle > svg');
        if (!(head instanceof HTMLElement) || !(icon instanceof SVGElement)) {
          throw new Error('Nie znaleziono geometrii rozwiniętego nagłówka');
        }
        const headBounds = head.getBoundingClientRect();
        const iconBounds = icon.getBoundingClientRect();
        return {
          head: headBounds.top + headBounds.height / 2,
          icon: iconBounds.top + iconBounds.height / 2,
        };
      });
      expect(centers.icon).toBeCloseTo(centers.head, 0);
    }
  }

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('collapsing a section animates its height and respects reduced motion', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  const collapse = await ingredients.evaluate(async (section) => {
    const toggle = section.querySelector<HTMLButtonElement>('[data-section-toggle]');
    const content = section.querySelector<HTMLElement>('[data-section-content]');
    if (!toggle || !content) throw new Error('Nie znaleziono kontrolki zwijania sekcji');

    const open = section.getBoundingClientRect().height;
    toggle.click();
    const animations = content.getAnimations().length;
    const frames: number[] = [];
    await new Promise<void>((resolve) => {
      const collect = () => {
        frames.push(section.getBoundingClientRect().height);
        if (frames.length > 40) resolve();
        else requestAnimationFrame(collect);
      };
      requestAnimationFrame(collect);
    });

    const settled = frames[frames.length - 1];
    const moving = frames.filter((height) => Math.round(height) !== Math.round(settled));
    return {
      open,
      animations,
      settled,
      lastMoving: moving.length > 0 ? moving[moving.length - 1] : settled,
      distinctHeights: new Set(frames.map((height) => Math.round(height))).size,
    };
  });

  expect(collapse.animations).toBe(1);
  expect(collapse.settled).toBeLessThan(collapse.open);
  // Ruch prowadzi krawędź sekcji przez kolejne wysokości, a nie jednym skokiem.
  expect(collapse.distinctHeights).toBeGreaterThan(5);
  // Ostatnia klatka ruchu ma wysokość stanu docelowego, więc układ nie
  // przeskakuje o odstęp siatki w chwili ukrycia treści.
  expect(Math.abs(collapse.lastMoving - collapse.settled)).toBeLessThan(4);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const instant = await ingredients.evaluate((section) => {
    const toggle = section.querySelector<HTMLButtonElement>('[data-section-toggle]');
    const content = section.querySelector<HTMLElement>('[data-section-content]');
    if (!toggle || !content) throw new Error('Nie znaleziono kontrolki zwijania sekcji');

    const open = section.getBoundingClientRect().height;
    toggle.click();
    return {
      open,
      animations: content.getAnimations().length,
      collapsed: section.getBoundingClientRect().height,
    };
  });

  expect(instant.animations).toBe(0);
  expect(instant.collapsed).toBeLessThan(instant.open);
});

test('opening a step animates its height and leaves the other open steps expanded', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');
  await page.getByRole('button', { name: 'Tryb asystenta' }).click();

  const items = page.locator('[data-step-journey="assistant"] [data-step-item]');
  const animations = await items.nth(2).evaluate((item) => {
    item.querySelector<HTMLButtonElement>('[data-step-head]')?.click();
    return item.querySelector<HTMLElement>('[data-step-body]')?.getAnimations().length ?? 0;
  });

  expect(animations).toBe(1);
  await expect(items.nth(2).locator('[data-step-head]')).toHaveAttribute('aria-expanded', 'true');
  await expect(items.nth(2).locator('[data-step-body]')).toBeVisible();
  // Karty rozwijają się niezależnie: bieżący etap zostaje otwarty.
  await expect(items.first().locator('[data-step-body]')).toBeVisible();
  await expect(items.first().locator('[data-step-head]')).toHaveAttribute(
    'aria-expanded',
    'true',
  );

  // Ponowne kliknięcie nagłówka zwija wyłącznie własną kartę.
  await items.nth(2).locator('[data-step-head]').click();
  await expect(items.nth(2).locator('[data-step-body]')).toBeHidden();
  await expect(items.first().locator('[data-step-body]')).toBeVisible();

  // Ścieżka dokłada kolejny etap do zrobienia, nie ruszając kart otwartych
  // wcześniej przez czytelnika.
  await items.nth(2).locator('[data-step-head]').click();
  await items.first().locator('[data-checkable-step]').click();
  await expect(items.first().locator('[data-step-body]')).toBeHidden();
  await expect(items.nth(1).locator('[data-step-body]')).toBeVisible();
  await expect(items.nth(2).locator('[data-step-body]')).toBeVisible();
});

test('completing every step shows the finished-dish message for the active mode', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  await page.getByRole('button', { name: 'Tylko kroki' }).click();
  const standaloneJourney = page.locator('[data-step-journey="steps"]');
  const standaloneItems = standaloneJourney.locator('[data-step-item]');
  const standaloneCompletion = page.locator('[data-step-list-completion="steps"]');
  await expect(standaloneCompletion).toBeHidden();

  // Ścieżka sama rozwija kolejny etap, więc kroki odhaczamy po kolei.
  for (const item of await standaloneItems.all()) {
    await item.locator('[data-checkable-step]').click();
  }
  await expect(standaloneCompletion).toBeVisible();
  await expect(standaloneCompletion).toHaveText('Gratulacje, danie gotowe!');
  await expect(standaloneJourney.locator('[data-steps-progress-text]')).toHaveText('Krok 9 z 9');
  expect(
    await standaloneCompletion.evaluate((element) =>
      element.previousElementSibling?.matches('[data-step-list="steps"]'),
    ),
  ).toBe(true);

  const lastStandaloneItem = standaloneItems.last();
  await lastStandaloneItem.locator('[data-step-head]').click();
  await lastStandaloneItem.locator('[data-checkable-step]').click();
  await expect(standaloneCompletion).toBeHidden();

  await page.getByRole('button', { name: 'Tryb asystenta' }).click();
  const assistantJourney = page.locator('[data-step-journey="assistant"]');
  const assistantItems = assistantJourney.locator('[data-step-item]');
  const assistantCompletion = page.locator('[data-step-list-completion="assistant"]');
  await expect(assistantCompletion).toBeHidden();
  for (const item of await assistantItems.all()) {
    await item.locator('[data-checkable-step]').click();
  }
  await expect(assistantCompletion).toBeVisible();
  await expect(standaloneCompletion).toBeHidden();

  const firstAssistantItem = assistantItems.first();
  await firstAssistantItem.locator('[data-step-head]').click();
  await firstAssistantItem.locator('[data-checkable-step]').click();
  await expect(assistantCompletion).toBeHidden();
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

test('ingredient counter fills its progress bar and lands on a complete state', async ({ page }) => {
  await page.goto('/recipes/szakszuka-z-chorizo-i-cukinia');

  const ingredients = page.getByRole('region', { name: 'Składniki' });
  const vegetableGroup = ingredients.locator('[data-ingredient-group]').first();
  const progress = vegetableGroup.locator('[data-ingredient-group-progress]');
  const progressText = progress.locator('[data-ingredient-progress-text]');
  const toggles = vegetableGroup.locator('[data-checkable-ingredient]');

  const fillRatio = () =>
    progress.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).getPropertyValue('--ingredient-progress') || '0'),
    );

  await expect(progressText).toHaveText('0/5');
  await expect(progress).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect(await fillRatio()).toBeCloseTo(0, 2);

  await toggles.first().click();
  await expect(progressText).toHaveText('1/5');
  await expect.poll(fillRatio).toBeCloseTo(1 / 5, 2);

  const total = await toggles.count();
  for (let index = 1; index < total; index += 1) {
    await toggles.nth(index).click();
  }
  await expect(progressText).toHaveText('Komplet');
  await expect(progress).toHaveClass(/is-complete/);
  expect(await fillRatio()).toBeCloseTo(1, 2);

  await toggles.first().click();
  await expect(progressText).toHaveText('4/5');
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
