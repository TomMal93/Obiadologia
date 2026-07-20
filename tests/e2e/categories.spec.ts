import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('category selection opens a prerendered recipe page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Co dziś jemy?' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toHaveCount(0);
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);

  await page.getByRole('button', { name: /Obiad/ }).click();
  await expect(page.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toBeVisible();

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
    expect(actionMarginTop).toBe(2);
    for (const gap of actionNoteGaps) {
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThanOrEqual(10.5);
    }
    expect(panelBounds.bottom - noteBounds.bottom).toBeCloseTo(23, 0);
    expect(sectionBottom - panelBounds.bottom).toBeCloseTo(46, 0);
  }
});

test('path tree lines and dots share an emphasized soft color', async ({ page }) => {
  await page.goto('/');

  for (const path of ['map', 'search', 'categories']) {
    const lineColor = await page.locator(`.tree-line--${path}`).evaluate(
      (element) => getComputedStyle(element).stroke,
    );
    const dotColor = await page.locator(`.tree-dot--${path}`).evaluate(
      (element) => getComputedStyle(element).fill,
    );
    const tileColor = await page.locator(`.path-col--${path} .path-tile`).evaluate(
      (element) => getComputedStyle(element).backgroundColor,
    );

    expect(lineColor).toBe(dotColor);
    expect(lineColor).not.toBe(tileColor);
  }
});
