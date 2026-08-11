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
