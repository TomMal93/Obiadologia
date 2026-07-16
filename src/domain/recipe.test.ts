import { describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import { filterRecipesByCategories, parseRecipes, recipeSchema } from './recipe';

describe('Recipe', () => {
  it('accepts the validated prototype dataset with unique identifiers', () => {
    expect(parseRecipes(prototypeRecipes)).toHaveLength(5);
  });

  it('rejects an incomplete image reference', () => {
    expect(() => recipeSchema.parse({ ...prototypeRecipes[0], image: { src: '/dish.webp' } })).toThrow();
  });

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
