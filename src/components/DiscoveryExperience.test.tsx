import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import { DiscoveryExperience } from './DiscoveryExperience';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  window.sessionStorage.clear();
});

describe('DiscoveryExperience categories', () => {
  it('starts with a stable empty results frame and without recipe cards', () => {
    render(<DiscoveryExperience recipes={prototypeRecipes} />);

    for (const button of screen.getAllByRole('button', { pressed: false })) {
      expect(button).toHaveAttribute('aria-pressed', 'false');
    }
    expect(screen.getByText('Wybierz co najmniej jedną opcję.')).toBeInTheDocument();
    const results = screen.getByRole('region', { name: 'Wyniki kategorii' });
    expect(screen.getByRole('heading', { name: 'Propozycje dla Ciebie' })).toBeInTheDocument();
    expect(within(results).getByText('Tutaj pojawią się dopasowane przepisy.')).toBeInTheDocument();
    expect(within(results).queryByRole('link')).not.toBeInTheDocument();
  });

  it('filters after every change and hides results after removing the last selection', () => {
    render(<DiscoveryExperience recipes={prototypeRecipes} />);

    const lunch = screen.getByRole('button', { name: /Obiad/ });
    fireEvent.click(lunch);

    const results = screen.getByRole('region', { name: 'Wyniki kategorii' });
    expect(within(results).getAllByRole('link')).toHaveLength(4);
    expect(lunch).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Wybrano:/)).toBeInTheDocument();

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
    render(<DiscoveryExperience recipes={[]} />);

    const results = screen.getByRole('region', { name: 'Wyniki kategorii' });
    fireEvent.click(screen.getByRole('button', { name: /Obiad/ }));

    expect(screen.getByRole('region', { name: 'Wyniki kategorii' })).toBe(results);
    expect(within(results).getByText('Brak dopasowań. Zmień lub usuń wybrane kryterium.')).toBeInTheDocument();
  });
});

describe('DiscoveryExperience overlay', () => {
  function addOpener(mode: 'search' | 'map') {
    const opener = document.createElement('button');
    opener.textContent = mode === 'search' ? 'Szukaj' : 'Mapa';
    opener.dataset.discoveryMode = mode;
    document.body.append(opener);
    return opener;
  }

  it('opens search with an empty focused field and updates suggestions and results after a typing pause', async () => {
    render(<DiscoveryExperience recipes={prototypeRecipes} />);
    const opener = addOpener('search');
    fireEvent.click(opener);

    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    await waitFor(() => expect(input).toHaveFocus());
    expect(within(dialog).queryByRole('heading', { name: 'Propozycje' })).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'kurczak' } });
    expect(within(dialog).queryByRole('button', { name: 'kurczak' })).not.toBeInTheDocument();
    expect(await within(dialog).findByRole('button', { name: 'kurczak' })).toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Kurczak z grilla z sałatką/ })).toBeInTheDocument();
  });

  it('preserves search state while the map reacts to keyboard input', async () => {
    render(<DiscoveryExperience recipes={prototypeRecipes} />);
    fireEvent.click(addOpener('search'));
    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' });
    fireEvent.change(input, { target: { value: 'feta' } });

    fireEvent.click(within(dialog).getByRole('button', { name: /Mapa/ }));
    expect(within(dialog).getByText(/tempo neutralne · charakter neutralny/)).toBeInTheDocument();
    expect(within(dialog).getAllByRole('link')).toHaveLength(4);

    const point = within(dialog).getByRole('button', { name: /Talerz na mapie/ });
    fireEvent.keyDown(point, { key: 'ArrowLeft' });
    expect(within(dialog).getByText(/szybko 55% · charakter neutralny/)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Wyszukiwarka/ }));
    expect(within(dialog).getByRole('searchbox', { name: 'Szukaj przepisu' })).toHaveValue('feta');
  });
});
