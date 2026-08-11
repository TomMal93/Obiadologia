import { expect, test } from '@playwright/test';

test('zachowuje dekoracyjny puls koloru przy ograniczeniu ruchu', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('.intro-screen')).toHaveCSS('animation-name', 'brand-pulse');
  await expect(page.locator('.home-hero-bg span').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );
});

test('kafle hero używają obramowania w kolorze swojej drogi', async ({ page }) => {
  await page.goto('/');

  for (const [variant, accent] of [
    ['map', 'rgb(23, 104, 210)'],
    ['search', 'rgb(255, 79, 46)'],
    ['categories', 'rgb(21, 148, 71)'],
  ] as const) {
    const tile = page.locator(`.path-col--${variant} .path-tile`);
    await expect(tile).toHaveCSS('--col-accent', accent);
    await expect(tile).toHaveCSS('border-top-width', '1px');
    await expect(tile).toHaveCSS('border-top-style', 'solid');
  }
});
