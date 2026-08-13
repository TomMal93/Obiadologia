import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('search session switches modes and explicit close resets on browser Forward', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  const opener = page.getByRole('button', { name: 'Szukaj' });
  await opener.click();

  const dialog = page.getByRole('dialog');
  const search = dialog.getByRole('searchbox', { name: 'Szukaj przepisu' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  await expect(search).not.toBeFocused();
  await expect(dialog.getByRole('heading', { name: 'Propozycje' })).toHaveCount(0);

  await search.fill('chorizo');
  await expect(
    dialog.getByRole('link', { name: /Szakszuka z chorizo i cukinią/ }),
  ).toBeVisible();

  await dialog.getByRole('button', { name: /Mapa/ }).click();
  await expect(
    dialog.getByRole('button', { name: /Talerz na mapie: tempo neutralne · charakter neutralny/ }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: /Talerz na mapie/ }).press('ArrowLeft');
  await expect(
    dialog.getByRole('button', { name: /Talerz na mapie: szybko 55% · charakter neutralny/ }),
  ).toBeVisible();

  await dialog.getByRole('button', { name: /Wyszukiwarka/ }).click();
  await expect(search).toHaveValue('chorizo');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();

  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('');
});

test('the close (X) button closes the overlay and returns focus to the opener', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  const opener = page.getByRole('button', { name: 'Szukaj' });
  await opener.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Zamknij discovery' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(opener).toBeFocused();

  // Forward wciąż otwiera świeżą sesję — zamknięcie zdjęło wpis overlaya z historii.
  await page.goForward();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('');
});

test('map supports pointer input and preserves an unmatched search query', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mapa' }).click();

  const dialog = page.getByRole('dialog');
  const map = dialog.getByRole('application', { name: /Mapa preferencji/ });
  const bounds = await map.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.click(bounds!.x + bounds!.width * 0.2, bounds!.y + bounds!.height * 0.2);
  await expect(dialog.getByRole('button', { name: /Talerz na mapie: szybko 80% · lekko 80%/ })).toBeVisible();

  await dialog.getByRole('button', { name: /Wyszukiwarka/ }).click();
  const search = dialog.getByRole('searchbox', { name: 'Szukaj przepisu' });
  await search.fill('feta');
  await expect(dialog.getByText('Tego nie znaleźliśmy. Spróbujmy inaczej.')).toBeVisible();
  // Bez wyników w overlayu zostaje wyłącznie link brandu prowadzący na „/”.
  await expect(dialog.locator('.recipe-card')).toHaveCount(0);
  await dialog.getByRole('button', { name: /Mapa/ }).click();
  await expect(page.getByRole('button', { name: /Talerz na mapie: szybko 80% · lekko 80%/ })).toBeVisible();
  await dialog.getByRole('button', { name: /Wyszukiwarka/ }).click();
  await expect(search).toHaveValue('feta');

  const accessibility = await new AxeBuilder({ page }).include('.discovery-overlay').analyze();
  expect(accessibility.violations).toEqual([]);
});

// Logo i nazwa w nagłówku overlaya są drogą powrotną na stronę główną: sesja
// kończy się jak przy X, a strona wraca na górę bez dodatkowego wpisu historii.
for (const mode of ['Szukaj', 'Mapa']) {
  test(`the overlay brand (${mode}) returns to the home page and ends the session`, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
    await page.getByRole('button', { name: mode }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: 'Obiadologia — strona główna' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.home-hero')).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    // Sesja jest zakończona, więc „Dalej” otwiera świeży overlay zamiast wracać
    // do poprzednich kryteriów.
    await page.goForward();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
}
