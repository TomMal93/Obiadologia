import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('category selection opens a prerendered recipe page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Co dziś jemy?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toBeVisible();
  const resultsFrame = page.locator('.category-results-frame');
  const readFrameGeometry = () => resultsFrame.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { documentTop: bounds.top + window.scrollY, height: bounds.height };
  });
  const initialFrameGeometry = await readFrameGeometry();
  await expect(page.getByText('Tutaj pojawią się dopasowane przepisy.')).toBeVisible();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);

  await page.getByRole('button', { name: /Obiad/ }).click();
  await expect(page.getByRole('region', { name: 'Wyniki kategorii' }).getByRole('link')).toHaveCount(4);
  const cardHeights = await page.locator('.category-results-body .recipe-card').evaluateAll(
    (cards) => cards.map((card) => card.getBoundingClientRect().height),
  );
  expect(Math.max(...cardHeights)).toBeLessThanOrEqual(92);
  const selectedFrameGeometry = await readFrameGeometry();
  expect(selectedFrameGeometry.documentTop).toBeCloseTo(initialFrameGeometry.documentTop, 0);
  expect(selectedFrameGeometry.height).toBeCloseTo(initialFrameGeometry.height, 0);

  await page.getByRole('link', { name: /Kurczak z grilla z sałatką/ }).click();
  await expect(page).toHaveURL(/\/recipes\/kurczak-z-grilla-z-salatka$/);
  await expect(page.getByRole('heading', { name: 'Kurczak z grilla z sałatką' })).toBeVisible();
  await page.getByRole('link', { name: /Wróć do strony głównej/ }).click();
  await expect(page).toHaveURL('/');
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

test('category content fills the section from its 20px top inset', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('/');

  const geometry = await page.locator('.category-section').evaluate((section) => {
    const heading = section.querySelector(':scope > .section-heading');
    const results = section.querySelector(':scope > .category-results-frame');

    if (!(heading instanceof HTMLElement) || !(results instanceof HTMLElement)) {
      throw new Error('Category section content was not found');
    }

    const sectionBounds = section.getBoundingClientRect();
    const sectionStyles = getComputedStyle(section);

    return {
      headingOffset: heading.getBoundingClientRect().top - sectionBounds.top,
      resultsBottomGap: sectionBounds.bottom
        - Number.parseFloat(sectionStyles.paddingBottom)
        - results.getBoundingClientRect().bottom,
    };
  });

  expect(geometry.headingOffset).toBeCloseTo(20, 0);
  expect(geometry.resultsBottomGap).toBeCloseTo(0, 0);
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
    const noteBounds = await page.locator('.path-note').evaluate(
      (element) => {
        const bounds = element.getBoundingClientRect();
        return { top: bounds.top, bottom: bounds.bottom };
      },
    );
    const actionMarginTop = await page.locator('.path-action').first().evaluate(
      (element) => Number.parseFloat(getComputedStyle(element).marginTop),
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
    for (const gap of actionNoteGaps) {
      expect(gap).toBeCloseTo(22, 0);
    }
    expect(panelBounds.bottom - noteBounds.bottom).toBeCloseTo(23, 0);
    expect(sectionBottom - panelBounds.bottom).toBeCloseTo(46, 0);
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
