import { describe, expect, it } from 'vitest';
import { testRecipes } from '@/test/fixtures/recipes';
import { filterRecipesByCategories } from './recipe';

describe('Recipe', () => {
  it('returns no category results without a user selection', () => {
    expect(filterRecipesByCategories(testRecipes, {})).toEqual([]);
  });

  it('uses AND between selected groups and ignores unselected groups', () => {
    const results = filterRecipesByCategories(testRecipes, {
      mealTime: 'lunch',
      occasion: 'grill',
    });

    expect(results.map((recipe) => recipe.slug)).toEqual([
      'testowe-danie-z-kurczakiem',
      'testowe-danie-warzywne',
    ]);
  });
});
