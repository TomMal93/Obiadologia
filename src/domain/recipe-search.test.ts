import { describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import {
  createRecipeSearch,
  normalizeSearchText,
  rankRecipesForMap,
} from '@/domain/recipe-search';

describe('recipe search', () => {
  it('normalizes case, whitespace and Polish diacritics', () => {
    expect(normalizeSearchText('  SAŁATKA  ')).toBe('salatka');
  });

  it('ranks title and ingredient matches and returns related suggestions', () => {
    const search = createRecipeSearch(prototypeRecipes);

    expect(search.search('KURCZAK')[0]?.slug).toBe('kurczak-z-grilla-z-salatka');
    expect(search.search('mieso').map((recipe) => recipe.slug)).toContain('burgery-z-halloumi');
    expect(search.suggest('kur')).toContain('kurczak');
    expect(search.search('')).toEqual([]);
  });
});

describe('map ranking', () => {
  it('returns four diverse proposals for the neutral centre', () => {
    const results = rankRecipesForMap(prototypeRecipes, { x: 50, y: 50 });
    const mealTimes = new Set(results.flatMap((recipe) => recipe.mealTimes));

    expect(results).toHaveLength(4);
    expect(mealTimes).toEqual(new Set(['breakfast', 'lunch', 'dinner']));
  });

  it('maps the upper-left corner to quick and light recipes', () => {
    expect(rankRecipesForMap(prototypeRecipes, { x: 0, y: 0 })[0]?.slug).toBe(
      'owsianka-z-owocami',
    );
  });
});
