import { describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import { filterRecipesByCategories } from './recipe';

describe('Recipe', () => {
  it('returns no category results without a user selection', () => {
    expect(filterRecipesByCategories(prototypeRecipes, {})).toEqual([]);
  });

  it('uses AND between selected groups and ignores unselected groups', () => {
    const results = filterRecipesByCategories(prototypeRecipes, {
      mealTime: 'lunch',
      occasion: 'grill',
    });

    expect(results.map((recipe) => recipe.slug)).toEqual([
      'kurczak-z-grilla-z-salatka',
      'burgery-z-halloumi',
    ]);
  });
});
