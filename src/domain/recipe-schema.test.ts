import { describe, expect, it } from 'vitest';
import { parseRecipes, recipeSchema } from './recipe-schema';
import { testRecipes } from '@/test/fixtures/recipes';

describe('Recipe schema', () => {
  it('accepts the validated prototype dataset with unique identifiers', () => {
    expect(parseRecipes(testRecipes)).toHaveLength(5);
  });

  it('rejects an incomplete image reference', () => {
    expect(() => recipeSchema.parse({ ...testRecipes[0], image: { src: '/dish.webp' } })).toThrow();
  });
});
