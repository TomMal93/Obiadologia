import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import { DiscoveryExperience } from './DiscoveryExperience';

describe('DiscoveryExperience categories', () => {
  it('starts without selected options and without recipe results', () => {
    render(<DiscoveryExperience recipes={prototypeRecipes} />);

    for (const button of screen.getAllByRole('button', { pressed: false })) {
      expect(button).toHaveAttribute('aria-pressed', 'false');
    }
    expect(screen.queryByRole('heading', { name: 'Propozycje dla Ciebie' })).not.toBeInTheDocument();
  });

  it('filters after every change and hides results after removing the last selection', () => {
    render(<DiscoveryExperience recipes={prototypeRecipes} />);

    const lunch = screen.getByRole('button', { name: /Obiad/ });
    fireEvent.click(lunch);

    const results = screen.getByRole('heading', { name: 'Propozycje dla Ciebie' }).parentElement;
    expect(results).not.toBeNull();
    expect(within(results!).getAllByRole('link')).toHaveLength(4);
    expect(lunch).toHaveAttribute('aria-pressed', 'true');

    const grill = screen.getByRole('button', { name: /Na grilla/ });
    fireEvent.click(grill);
    expect(within(results!).getAllByRole('link')).toHaveLength(2);

    fireEvent.click(grill);
    fireEvent.click(lunch);
    expect(screen.queryByRole('heading', { name: 'Propozycje dla Ciebie' })).not.toBeInTheDocument();
  });
});
