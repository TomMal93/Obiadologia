import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('category selection opens the published chorizo shakshuka recipe', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Co dziś jemy?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toBeVisible();
  const resultsFrame = page.locator('.category-results-frame');
  const readFrameGeometry = () => resultsFrame.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { documentTop: bounds.top + window.scrollY, height: bounds.height };
  });
  const initialFrameGeometry = await readFrameGeometry();
  await expect(
    page.locator('.category-results-body').getByText(
      'Tutaj pojawią się dopasowane przepisy.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);

  await page.getByRole('button', { name: /Śniadanie/ }).click();
  const results = page.getByRole('region', { name: 'Wyniki kategorii' });
  const card = results.getByRole('link', { name: /Szakszuka/ });
  await expect(card).toBeVisible();
  const selectedFrameGeometry = await readFrameGeometry();
  expect(selectedFrameGeometry.documentTop).toBeCloseTo(initialFrameGeometry.documentTop, 0);
  expect(selectedFrameGeometry.height).toBeCloseTo(initialFrameGeometry.height, 0);

  await card.click();
  await expect(page).toHaveURL(/\/recipes\/szakszuka-z-chorizo-i-cukinia$/);
  await expect(
    page.getByRole('heading', { name: 'Szakszuka' }),
  ).toBeVisible();
});

test('initial homepage has no automatically detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('detailed category search opens an explicit placeholder and returns to categories', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Szczegółowe wyszukiwanie' }).click();
  await expect(page).toHaveURL(/\/categories$/);
  await expect(page.getByRole('heading', { name: 'Szczegółowe wyszukiwanie' })).toBeVisible();
  await expect(page.getByText('Ta funkcja jest w przygotowaniu.')).toBeVisible();

  await page.getByRole('link', { name: 'Wróć do kategorii' }).click();
  await expect(page).toHaveURL(/\/#kategorie$/);
});

test('category content shows five full cards and scrolls further results', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('/');
  await page.getByRole('button', { name: /Śniadanie/ }).click();

  const geometry = await page.locator('.category-section').evaluate((section) => {
    const heading = section.querySelector(':scope > .section-heading');
    const results = section.querySelector(':scope > .category-results-frame');

    if (!(heading instanceof HTMLElement) || !(results instanceof HTMLElement)) {
      throw new Error('Category section content was not found');
    }

    const sectionBounds = section.getBoundingClientRect();
    const resultsBody = results.querySelector('.category-results-body');
    const recipeList = resultsBody?.querySelector('.recipe-list');
    const cards = resultsBody instanceof HTMLElement
      ? [...resultsBody.querySelectorAll<HTMLElement>('.recipe-card')]
      : [];
    const bodyBounds = resultsBody?.getBoundingClientRect();
    const bodyStyle = resultsBody instanceof HTMLElement ? getComputedStyle(resultsBody) : null;
    const visibleTop = bodyBounds && bodyStyle
      ? bodyBounds.top + Number.parseFloat(bodyStyle.paddingTop)
      : 0;
    const visibleBottom = bodyBounds && bodyStyle
      ? bodyBounds.bottom - Number.parseFloat(bodyStyle.paddingBottom)
      : 0;

    return {
      headingOffset: heading.getBoundingClientRect().top - sectionBounds.top,
      resultsBottomGap: sectionBounds.bottom - results.getBoundingClientRect().bottom,
      resultCount: cards.length,
      firstFiveVisible: cards.slice(0, 5).every((card) => {
        const bounds = card.getBoundingClientRect();
        return bounds.top >= visibleTop - 1 && bounds.bottom <= visibleBottom + 1;
      }),
      sixthBelowViewport: cards.length > 5
        ? cards[5].getBoundingClientRect().top >= visibleBottom - 1
        : false,
      hasOverflow: resultsBody instanceof HTMLElement
        ? resultsBody.scrollHeight > resultsBody.clientHeight
        : false,
      listFillsBody: resultsBody instanceof HTMLElement && recipeList instanceof HTMLElement
        ? recipeList.getBoundingClientRect().height >= (
            resultsBody.clientHeight
            - Number.parseFloat(getComputedStyle(resultsBody).paddingTop)
            - Number.parseFloat(getComputedStyle(resultsBody).paddingBottom)
          )
        : null,
    };
  });

  expect(geometry.headingOffset).toBeCloseTo(20, 0);
  expect(geometry.resultsBottomGap).toBeCloseTo(0, 0);
  expect(geometry.resultCount).toBeGreaterThan(5);
  expect(geometry.firstFiveVisible).toBe(true);
  expect(geometry.sixthBelowViewport).toBe(true);
  expect(geometry.hasOverflow).toBe(true);
  expect(geometry.listFillsBody).toBe(true);

  const resultsBody = page.locator('.category-results-body');
  await resultsBody.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  const sixthVisibleAfterScroll = await resultsBody.evaluate((element) => {
    const sixthCard = element.querySelectorAll<HTMLElement>('.recipe-card')[5];
    const bodyBounds = element.getBoundingClientRect();
    const bodyStyle = getComputedStyle(element);
    const cardBounds = sixthCard.getBoundingClientRect();
    return cardBounds.top >= bodyBounds.top + Number.parseFloat(bodyStyle.paddingTop) - 1
      && cardBounds.bottom <= bodyBounds.bottom - Number.parseFloat(bodyStyle.paddingBottom) + 1;
  });
  expect(sixthVisibleAfterScroll).toBe(true);

  await page.getByRole('button', { name: /Na już/ }).click();
  await expect.poll(() => resultsBody.evaluate((element) => element.scrollTop)).toBe(0);
});

test('category results hand scrolling back to the page when they cannot scroll further', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('/');

  const resultsBody = page.locator('.category-results-body');
  const cdp = await page.context().newCDPSession(page);
  const swipe = async (x: number, y: number, movementY: number) => {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y: y + movementY }],
    });
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchEnd',
      touchPoints: [],
    });
  };

  await resultsBody.scrollIntoViewIfNeeded();
  const emptyBounds = await resultsBody.boundingBox();
  if (!emptyBounds) throw new Error('Empty category results are not visible');
  const emptyStart = await page.evaluate(() => window.scrollY);
  await swipe(
    emptyBounds.x + emptyBounds.width / 2,
    emptyBounds.y + emptyBounds.height / 2,
    160,
  );
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(emptyStart);

  await page.getByRole('button', { name: /Śniadanie/ }).click();
  await resultsBody.evaluate((element) => element.scrollTo({ top: 0 }));
  await resultsBody.scrollIntoViewIfNeeded();
  await resultsBody.hover();
  const pageAtListTop = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, -240);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(pageAtListTop);

  await resultsBody.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await resultsBody.scrollIntoViewIfNeeded();
  const pageAtListBottom = await page.evaluate(() => window.scrollY);
  const resultsBounds = await resultsBody.boundingBox();
  if (!resultsBounds) throw new Error('Category results are not visible');
  const touchX = resultsBounds.x + resultsBounds.width / 2;
  const touchY = resultsBounds.y + resultsBounds.height / 2;
  await swipe(touchX, touchY, -240);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(pageAtListBottom);
});

test('homepage heading and path panel keep stable mobile geometry', async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 412, height: 839 },
    { width: 430, height: 932 },
    { width: 480, height: 900 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const headingBounds = await page.getByRole('heading', { name: 'Co dziś jemy?' }).evaluate(
      (element) => {
        const bounds = element.getBoundingClientRect();
        return { top: bounds.top, bottom: bounds.bottom };
      },
    );
    const headerBottom = await page.locator('.site-header').evaluate(
      (element) => element.getBoundingClientRect().bottom,
    );
    const panelBounds = await page.locator('.path-panel').evaluate(
      (element) => {
        const bounds = element.getBoundingClientRect();
        return { top: bounds.top, bottom: bounds.bottom };
      },
    );
    const sectionBottom = await page.locator('.intro-screen').evaluate(
      (element) => element.getBoundingClientRect().bottom,
    );
    const sectionBottomPadding = await page.locator('.intro-screen').evaluate(
      (element) => Number.parseFloat(getComputedStyle(element).paddingBottom),
    );
    const noteBounds = await page.locator('.path-note').evaluate(
      (element) => {
        const bounds = element.getBoundingClientRect();
        return { top: bounds.top, bottom: bounds.bottom };
      },
    );
    const actionMarginTop = await page.locator('.path-action').first().evaluate(
      (element) => Number.parseFloat(getComputedStyle(element).marginTop),
    );
    const actionBounds = await page.locator('.path-action').evaluateAll(
      (actions) => actions.map((action) => {
        const bounds = action.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      }),
    );
    const actionNoteGaps = await page.locator('.path-action').evaluateAll(
      (actions, noteTop) => actions.map(
        (action) => Number(noteTop) - action.getBoundingClientRect().bottom,
      ),
      noteBounds.top,
    );
    const treeBottom = await page.locator('.path-tree').evaluate(
      (element) => element.getBoundingClientRect().bottom,
    );
    const gridTop = await page.locator('.path-grid').evaluate(
      (element) => element.getBoundingClientRect().top,
    );

    const headingCenter = (headingBounds.top + headingBounds.bottom) / 2;
    const availableSpaceCenter = (headerBottom + panelBounds.top) / 2;

    expect(headingCenter).toBeCloseTo(availableSpaceCenter, 0);
    expect(gridTop - treeBottom).toBeCloseTo(7, 0);
    expect(actionMarginTop).toBe(6);
    for (const bounds of actionBounds.slice(1)) {
      expect(bounds.width).toBeCloseTo(actionBounds[0].width, 1);
      expect(bounds.height).toBeCloseTo(actionBounds[0].height, 1);
    }
    for (const bounds of actionBounds) {
      expect(bounds.width).toBeCloseTo(bounds.height, 1);
    }
    for (const gap of actionNoteGaps) {
      expect(gap).toBeCloseTo(22, 0);
    }
    expect(panelBounds.bottom - noteBounds.bottom).toBeCloseTo(23, 0);
    expect(sectionBottomPadding).toBeGreaterThanOrEqual(16);
    expect(sectionBottomPadding).toBeLessThanOrEqual(24);
    expect(sectionBottom - panelBounds.bottom).toBeCloseTo(sectionBottomPadding, 0);
  }
});

test('path tree lines progress from a soft color to the full path accent', async ({ page }) => {
  await page.goto('/');

  for (const path of ['map', 'search', 'categories']) {
    const startColor = await page.locator(`.tree-gradient-start--${path}`).evaluate(
      (element) => getComputedStyle(element).stopColor,
    );
    const startOpacity = await page.locator(`.tree-gradient-start--${path}`).evaluate(
      (element) => getComputedStyle(element).stopOpacity,
    );
    const endColor = await page.locator(`.tree-gradient-end--${path}`).evaluate(
      (element) => getComputedStyle(element).stopColor,
    );
    const dotColor = await page.locator(`.tree-dot--${path}`).evaluate(
      (element) => getComputedStyle(element).fill,
    );
    const tileColor = await page.locator(`.path-col--${path} .path-tile`).evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );
    const accentColor = await page.locator(`.path-col--${path} .path-rule`).evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );

    expect(endColor).toBe(accentColor);
    expect(dotColor).toBe(accentColor);
    expect(startOpacity).toBe('0.4');
    expect(startColor).not.toBe(tileColor);
    expect(startColor).not.toBe(endColor);
  }
});

test('category panel is framed like path panel', async ({ page }) => {
  await page.goto('/');

  const categoryPanel = page.locator('.category-panel');
  await expect(categoryPanel).toHaveCSS('border-top-width', '1px');
  await expect(categoryPanel).toHaveCSS('border-top-style', 'solid');
  await expect(categoryPanel).toHaveCSS('border-top-left-radius', '28px');
});
