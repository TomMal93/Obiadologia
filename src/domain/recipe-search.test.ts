import { describe, expect, it } from 'vitest';
import {
  createRecipeSearch,
  normalizeSearchText,
  rankRecipesForMap,
} from '@/domain/recipe-search';
import { testRecipes } from '@/test/fixtures/recipes';

describe('recipe search', () => {
  it('normalizes case, whitespace and Polish diacritics', () => {
    expect(normalizeSearchText('  SAŁATKA  ')).toBe('salatka');
  });

  it('ranks title and ingredient matches and returns related suggestions', () => {
    const search = createRecipeSearch(testRecipes);

    expect(search.search('KURCZAK')[0]?.slug).toBe('testowe-danie-z-kurczakiem');
    expect(search.search('cukinia').map((recipe) => recipe.slug)).toContain('testowe-danie-warzywne');
    expect(search.suggest('kur')).toContain('kurczak');
    const compactSuggestions = search.suggest('testowe');
    expect(compactSuggestions.length).toBeGreaterThan(0);
    expect(compactSuggestions.every((suggestion) => suggestion.trim().split(/\s+/u).length <= 2))
      .toBe(true);
    expect(search.suggest('na')).not.toContain('na');
    expect(search.suggest('dla')).not.toContain('dla');
    expect(search.suggest('dla')).toContain('dla dzieci');
    expect(search.search('')).toEqual([]);
  });

  it('does not suggest standalone connector words from catalog data', () => {
    const recipeWithNoisyTags = {
      ...testRecipes[0],
      id: 'test_noisy_suggestions',
      slug: 'testowe-szumy-sugestii',
      tags: ['albo', 'bez', 'dla', 'do', 'i', 'lub', 'na', 'oraz', 'w', 'z'],
    };
    const search = createRecipeSearch([...testRecipes, recipeWithNoisyTags]);

    for (const stopword of recipeWithNoisyTags.tags) {
      expect(search.suggest(stopword)).not.toContain(stopword);
    }
  });

  it('offers typed tropes from categories and ingredients, each a real query', () => {
    const search = createRecipeSearch(testRecipes);
    const tropes = search.tropes();

    expect(tropes.length).toBeGreaterThan(0);
    expect(tropes.length).toBeLessThanOrEqual(16);
    // Różne rodzaje niosą różne kolory — oczekujemy więcej niż jednego.
    expect(new Set(tropes.map((trope) => trope.kind)).size).toBeGreaterThan(1);
    // Zapytania są unikalne i każde prowadzi do trafień.
    expect(new Set(tropes.map((trope) => trope.query)).size).toBe(tropes.length);
    for (const trope of tropes) {
      expect(search.search(trope.query).length).toBeGreaterThan(0);
    }
  });
});

describe('map ranking', () => {
  it('returns four diverse proposals for the neutral centre', () => {
    const results = rankRecipesForMap(testRecipes, { x: 50, y: 50 });
    const mealTimes = new Set(results.flatMap((recipe) => recipe.mealTimes));

    expect(results).toHaveLength(4);
    expect(mealTimes).toEqual(new Set(['breakfast', 'lunch', 'dinner']));
  });

  it('maps the upper-left corner to quick and light recipes', () => {
    expect(rankRecipesForMap(testRecipes, { x: 0, y: 0 })[0]?.slug).toBe(
      'testowe-sniadanie',
    );
  });
});
