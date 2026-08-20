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
    const recipeWithVerboseIngredient = {
      ...testRecipes[0],
      id: 'test_verbose_ingredient',
      slug: 'testowy-rozbudowany-skladnik',
      ingredients: [
        ...testRecipes[0].ingredients,
        {
          category: 'produce' as const,
          name: 'młode ziemniaki albo ziemniaki mączyste na purée',
          amount: 500,
          unit: 'g' as const,
        },
      ],
    };
    const search = createRecipeSearch([...testRecipes, recipeWithVerboseIngredient]);
    const tropes = search.tropes();

    expect(tropes.length).toBeGreaterThan(0);
    expect(tropes.length).toBeLessThanOrEqual(16);
    // Różne rodzaje niosą różne kolory — oczekujemy więcej niż jednego.
    expect(new Set(tropes.map((trope) => trope.kind)).size).toBeGreaterThan(1);
    // Zapytania są unikalne i każde prowadzi do trafień.
    expect(new Set(tropes.map((trope) => trope.query)).size).toBe(tropes.length);
    for (const trope of tropes) {
      expect(trope.label.trim().split(/\s+/u).length).toBeLessThanOrEqual(2);
      expect(search.search(trope.query).length).toBeGreaterThan(0);
    }
  });

  it('keeps trope kinds literal instead of balancing colors with unrelated traits', () => {
    const search = createRecipeSearch(testRecipes);
    const tropes = search.tropes(16);
    const ingredientNames = new Set(
      testRecipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.name)),
    );

    for (const trope of tropes) {
      if (trope.kind === 'daypart') {
        expect(['śniadanie', 'obiad', 'kolacja']).toContain(trope.query);
      } else if (trope.kind === 'tempo') {
        expect(['szybko', 'na dziś', 'dwa dni']).toContain(trope.query);
      } else if (trope.kind === 'occasion') {
        expect(['dzieci', 'gości', 'grill']).toContain(trope.query);
      } else {
        expect(ingredientNames).toContain(trope.query);
      }
    }

    expect(tropes.map((trope) => trope.query)).not.toContain('łatwe');
    expect(tropes.map((trope) => trope.query)).not.toContain('lekko');
  });

  it('does not synthesize search matches from difficulty or map position', () => {
    const recipe = {
      ...testRecipes[0],
      title: 'Neutralny posiłek',
      description: 'Neutralny opis dania.',
      ingredients: [{ category: 'grains' as const, name: 'ryż', amount: 100, unit: 'g' as const }],
      tags: ['neutralny'],
      difficulty: 'hard' as const,
      mealTimes: ['lunch' as const],
      tempos: ['today' as const],
      occasions: [],
      mapPosition: { pace: 0, lightness: 1 },
    };
    const search = createRecipeSearch([recipe]);

    expect(search.search('zaawansowane')).toEqual([]);
    expect(search.search('dietetyczne')).toEqual([]);
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
