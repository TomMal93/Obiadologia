import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultLocale } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { testRecipes } from '@/test/fixtures/recipes';
import { DiscoveryExperience } from './DiscoveryExperience';

const messages = getMessages(defaultLocale);

function renderExperience(recipes = testRecipes) {
  return render(
    <DiscoveryExperience
      recipes={recipes}
      common={messages.common}
      messages={messages.experience}
      locale={defaultLocale}
    />,
  );
}

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.sessionStorage.clear();
});

describe('DiscoveryExperience categories', () => {
  it('starts with a stable empty results frame and without recipe cards', () => {
    renderExperience();

    for (const button of screen.getAllByRole('button', { pressed: false })) {
      expect(button).toHaveAttribute('aria-pressed', 'false');
    }
    expect(screen.getByText('Wybierz co najmniej jedną opcję.')).toBeInTheDocument();
    const results = screen.getByRole('region', { name: 'Wyniki kategorii' });
    const resultsFrame = screen.getByRole('heading', { name: 'Propozycje dla Ciebie' }).parentElement as HTMLElement;
    expect(within(resultsFrame).getByText('Wybierz co najmniej jedną opcję.')).toBeInTheDocument();
    expect(within(results).getByText('Tutaj pojawią się dopasowane przepisy.')).toBeInTheDocument();
    expect(within(results).queryByRole('link')).not.toBeInTheDocument();
  });

  it('filters after every change and hides results after removing the last selection', () => {
    renderExperience();

    const lunch = screen.getByRole('button', { name: /Obiad/ });
    fireEvent.click(lunch);

    const results = screen.getByRole('region', { name: 'Wyniki kategorii' });
    expect(within(results).getAllByRole('link')).toHaveLength(3);
    expect(within(results).getByRole('list')).toHaveClass('recipe-list--panoramic');
    const firstCard = within(results).getAllByRole('link')[0] as HTMLAnchorElement;
    expect(within(firstCard).getByText(/min/)).toHaveClass('recipe-time-unit');
    expect(within(firstCard).queryByLabelText('Tagi')).not.toBeInTheDocument();
    expect(lunch).toHaveAttribute('aria-pressed', 'true');
    const resultsFrame = screen.getByRole('heading', { name: 'Propozycje dla Ciebie' }).parentElement as HTMLElement;
    expect(within(resultsFrame).getByText(/Wybrano:/)).toBeInTheDocument();

    const grill = screen.getByRole('button', { name: /Na grilla/ });
    fireEvent.click(grill);
    expect(within(results).getAllByRole('link')).toHaveLength(2);

    fireEvent.click(grill);
    fireEvent.click(lunch);
    expect(screen.getByText('Wybierz co najmniej jedną opcję.')).toBeInTheDocument();
    expect(within(results).getByText('Tutaj pojawią się dopasowane przepisy.')).toBeInTheDocument();
    expect(within(results).queryByRole('link')).not.toBeInTheDocument();
  });

  it('keeps the same results frame when a selection has no matches', () => {
    renderExperience([]);

    const results = screen.getByRole('region', { name: 'Wyniki kategorii' });
    fireEvent.click(screen.getByRole('button', { name: /Obiad/ }));

    expect(screen.getByRole('region', { name: 'Wyniki kategorii' })).toBe(results);
    expect(within(results).getByText('Brak dopasowań. Zmień lub usuń wybrane kryterium.')).toBeInTheDocument();
  });
});

describe('DiscoveryExperience overlay', () => {
  // Karty wyników rozpoznajemy po czasie przygotowania — link brandu w nagłówku
  // overlaya prowadzi na stronę główną i nie jest wynikiem.
  const resultCards = (scope: HTMLElement) =>
    within(scope).queryAllByRole('link', { name: /Czas przygotowania/ });

  function addOpener(mode: 'search' | 'map') {
    const opener = document.createElement('button');
    opener.textContent = mode === 'search' ? 'Szukaj' : 'Mapa';
    opener.dataset.discoveryMode = mode;
    document.body.append(opener);
    return opener;
  }

  it('opens search with an empty field and focus on the dialog (no auto keyboard), then updates suggestions and results after a typing pause', async () => {
    renderExperience();
    const opener = addOpener('search');
    fireEvent.click(opener);

    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    await waitFor(() => expect(dialog).toHaveFocus());
    expect(input).not.toHaveFocus();
    expect(input).toHaveValue('');
    expect(within(dialog).queryByRole('heading', { name: 'Propozycje' })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'kurczak' } });
    expect(within(dialog).queryByRole('button', { name: 'kurczak' })).not.toBeInTheDocument();
    expect(await within(dialog).findByRole('button', { name: 'kurczak' })).toBeInTheDocument();
    const result = within(dialog).getByRole('link', { name: /Testowe danie z kurczakiem/ });
    expect(result).toBeInTheDocument();
    expect(within(result).queryByLabelText('Tagi')).not.toBeInTheDocument();
    expect(result).toHaveClass('recipe-card--placeholder');
    expect(within(result).getByText('zdjęcie potrawy')).toBeInTheDocument();
    expect(within(result).getByText('20')).toHaveClass('recipe-time-value');
    expect(within(result).getByText('min')).toHaveClass('recipe-time-unit');
    expect(within(result).getByText('Dane przeznaczone wyłącznie do testów.'))
      .toHaveClass('visually-hidden');
  });

  it('shows every recipe matching a text query', async () => {
    renderExperience();
    fireEvent.click(addOpener('search'));

    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    fireEvent.change(input, { target: { value: 'testowe' } });

    await waitFor(() => {
      expect(within(dialog).getAllByRole('link', { name: /Testowe/ }))
        .toHaveLength(testRecipes.length);
    });
  });

  it('fills the empty field with popular tropes and runs one when picked', async () => {
    renderExperience();
    fireEvent.click(addOpener('search'));

    const dialog = await screen.findByRole('dialog');
    const tropes = within(dialog).getByRole('group', { name: 'A może w tę stronę?' });
    const tiles = within(tropes).getAllByRole('button');
    expect(tiles.length).toBeGreaterThan(8);

    fireEvent.click(tiles[0] as HTMLButtonElement);

    // Kliknięcie ustawia zapytanie tropu (etykieta bywa inna niż zapytanie) i
    // ukrywa siatkę, a wyniki pojawiają się po debounce.
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    expect(input).not.toHaveValue('');
    expect(within(dialog).queryByRole('group', { name: 'A może w tę stronę?' })).not.toBeInTheDocument();
    await waitFor(() => expect(resultCards(dialog).length).toBeGreaterThan(0));
  });

  it('offers rescue tropes when a query returns no results', async () => {
    renderExperience();
    fireEvent.click(addOpener('search'));

    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    fireEvent.change(input, { target: { value: 'xyzzy' } });

    expect(await within(dialog).findByText('Tego nie znaleźliśmy. Spróbujmy inaczej.')).toBeInTheDocument();
    const rescue = within(dialog).getByRole('group', { name: 'Może coś z tego?' });
    // Brak wyników pokazuje tę samą siatkę bento co stan pusty (wiele kafli).
    const rescueTiles = within(rescue).getAllByRole('button');
    expect(rescueTiles.length).toBeGreaterThan(8);
    fireEvent.click(rescueTiles[0] as HTMLButtonElement);

    await waitFor(() => expect(resultCards(dialog).length).toBeGreaterThan(0));
  });

  it('preserves search state while the map reacts to keyboard input', async () => {
    renderExperience();
    fireEvent.click(addOpener('search'));
    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    fireEvent.change(input, { target: { value: 'cukinia' } });

    fireEvent.click(within(dialog).getByRole('button', { name: /Mapa/ }));
    expect(within(dialog).getByRole('button', { name: /Talerz na mapie: tempo neutralne · charakter neutralny/ })).toBeInTheDocument();
    // Liczone są karty wyników; w nagłówku overlaya jest jeszcze link brandu na „/”.
    const mapResults = within(dialog).getByRole('heading', { name: 'Propozycje' }).closest('section') as HTMLElement;
    expect(within(mapResults).getAllByRole('link')).toHaveLength(4);
    expect(within(dialog).getByText('4 dopasowania')).toBeInTheDocument();
    const featuredCard = within(dialog).getByText('Najbliżej Twojego apetytu').closest('a');
    expect(featuredCard).toHaveClass('recipe-card--featured');
    expect(featuredCard).toHaveClass('recipe-card--placeholder');
    expect(within(featuredCard as HTMLAnchorElement).getByText('zdjęcie potrawy')).toBeInTheDocument();
    expect(within(featuredCard as HTMLAnchorElement).getByText('Dlaczego pasuje:')).toBeInTheDocument();
    expect(within(featuredCard as HTMLAnchorElement).getByText('lekkie')).toBeInTheDocument();
    expect(within(featuredCard as HTMLAnchorElement).getByText('szybkie')).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'Propozycje' }).closest('section'))
      .toHaveClass('discovery-results--map');

    const point = within(dialog).getByRole('button', { name: /Talerz na mapie/ });
    fireEvent.keyDown(point, { key: 'ArrowLeft' });
    expect(within(dialog).getByRole('button', { name: /Talerz na mapie: szybko 55% · charakter neutralny/ })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Wyszukiwarka/ }));
    expect(within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('cukinia');
    await waitFor(() => expect(within(dialog).getByText('1 dopasowanie')).toBeInTheDocument());
    expect(within(dialog).getByRole('heading', { name: 'Propozycje' }).closest('section'))
      .toHaveClass('discovery-results--search');
  });

  it('shows a live mood name under the map that stays neutral near the centre and changes past the band edge', async () => {
    renderExperience();
    fireEvent.click(addOpener('map'));
    const dialog = await screen.findByRole('dialog');

    expect(within(dialog).getByText('Złoty środek')).toBeInTheDocument();

    const point = within(dialog).getByRole('button', { name: /Talerz na mapie/ });

    // Pojedynczy krok (x = 45) nie wychodzi z pasma neutralnego.
    fireEvent.keyDown(point, { key: 'ArrowLeft' });
    expect(within(dialog).getByText('Złoty środek')).toBeInTheDocument();

    // Przekroczenie granicy pasma (x = 35) przełącza na strefę „szybko”.
    fireEvent.keyDown(point, { key: 'ArrowLeft' });
    fireEvent.keyDown(point, { key: 'ArrowLeft' });
    expect(within(dialog).getByText('Szybki strzał')).toBeInTheDocument();
    expect(within(dialog).queryByText('Złoty środek')).not.toBeInTheDocument();
  });

  it('leads home from the header brand: closes the session and returns to the top of the page', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    renderExperience();
    fireEvent.click(addOpener('map'));

    const dialog = await screen.findByRole('dialog');
    const home = within(dialog).getByRole('link', { name: 'Obiadologia — strona główna' });
    expect(home).toHaveAttribute('href', '/');

    fireEvent.click(home);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 0 }));
    scrollTo.mockRestore();
  });
});
