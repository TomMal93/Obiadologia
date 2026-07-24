import { describe, expect, it } from 'vitest';
import { prototypeRecipes } from '@/data/prototype-recipes';
import { parseRecipes, recipeSchema } from './recipe-schema';
import { testRecipes } from '@/test/fixtures/recipes';

describe('Recipe schema', () => {
  it('accepts the validated prototype dataset with unique identifiers', () => {
    expect(parseRecipes(testRecipes)).toHaveLength(5);
  });

  it('validates the published application catalog', () => {
    expect(prototypeRecipes).toHaveLength(2);
    expect(prototypeRecipes[0]?.slug).toBe('kotlet-schabowy-z-ziemniakami');
    expect(prototypeRecipes[1]?.slug).toBe('podudzia-kurczaka-z-ziemniakami');
  });

  it('rejects an incomplete image reference', () => {
    expect(() => recipeSchema.parse({ ...testRecipes[0], image: { src: '/dish.webp' } })).toThrow();
  });

  it('accepts non-empty tips and rejects an empty tips section', () => {
    expect(recipeSchema.parse(testRecipes[0]).tips).toEqual(['Zapamiętaj poradę testową.']);
    expect(() => recipeSchema.parse({ ...testRecipes[0], tips: [] })).toThrow();
  });

  it('rejects an unknown difficulty and servings outside the supported range', () => {
    expect(() => recipeSchema.parse({ ...testRecipes[0], difficulty: 'expert' })).toThrow();
    expect(() => recipeSchema.parse({ ...testRecipes[0], servings: 0 })).toThrow();
    expect(() => recipeSchema.parse({ ...testRecipes[0], servings: 13 })).toThrow();
  });
});
