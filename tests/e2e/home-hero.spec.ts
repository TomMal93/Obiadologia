import { expect, test, type Locator } from '@playwright/test';

async function resolvedCustomColor(locator: Locator, property: string) {
  return locator.evaluate((element, customProperty) => {
    const probe = document.createElement('span');
    probe.style.color = getComputedStyle(element).getPropertyValue(customProperty);
    element.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, property);
}

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
    expect(await resolvedCustomColor(tile, '--col-accent')).toBe(accent);
    await expect(tile).toHaveCSS('border-top-width', '1px');
    await expect(tile).toHaveCSS('border-top-style', 'solid');
  }
});
