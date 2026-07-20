import { describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import { parseRecipes, recipeSchema } from './recipe-schema';

describe('Recipe schema', () => {
  it('accepts the validated prototype dataset with unique identifiers', () => {
    expect(parseRecipes(prototypeRecipes)).toHaveLength(5);
  });

  it('rejects an incomplete image reference', () => {
    expect(() => recipeSchema.parse({ ...prototypeRecipes[0], image: { src: '/dish.webp' } })).toThrow();
  });
});
