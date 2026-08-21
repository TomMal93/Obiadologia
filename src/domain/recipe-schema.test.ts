import { describe, expect, it } from 'vitest';
import { formatHouseholdMeasure } from './ingredient';
import { parseRecipes, recipeSchema } from './recipe-schema';
import { testRecipes } from '@/test/fixtures/recipes';

// Katalog przepisów mieszka teraz w Content Collections: jeden plik JSON na
// przepis. Test czyta te same pliki co build i sortuje po `id` tak jak
// `getRecipes`, więc weryfikuje realny katalog bez runtime'u Astro.
const recipeModules = import.meta.glob('../content/recipes/*.json', {
  eager: true,
  import: 'default',
});
const catalog = parseRecipes(Object.values(recipeModules)).sort((left, right) =>
  left.id.localeCompare(right.id),
);

describe('Recipe schema', () => {
  it('accepts the validated prototype dataset with unique identifiers', () => {
    expect(parseRecipes(testRecipes)).toHaveLength(5);
  });

  it('validates the application recipe catalog', () => {
    expect(catalog).toHaveLength(20);

    expect(catalog.every(({ status }) => status === 'published')).toBe(true);
  });

  it('provides natural household measures for the chorizo shakshuka', () => {
    const recipe = catalog.find(({ slug }) => slug === 'szakszuka-z-chorizo-i-cukinia');

    expect(recipe?.ingredients.map(formatHouseholdMeasure)).toEqual([
      '10 plastrów',
      '8 sztuk',
      '1 sztuka',
      '4 garści',
      '2 sztuki',
      '2 sztuki',
      '4 łyżki',
      '1 szklanka',
      '4 kromki',
      '0,6 łyżeczki',
      '2 łyżeczki',
      '2 szczypty',
      '2 szczypty',
    ]);
  });

  it('rejects an incomplete image reference', () => {
    expect(() => recipeSchema.parse({ ...testRecipes[0], image: { src: '/dish.webp' } })).toThrow();
  });

  it('accepts non-empty tips and rejects an empty tips section', () => {
    expect(recipeSchema.parse(testRecipes[0]).tips).toEqual(['Zapamiętaj poradę testową.']);
    expect(() => recipeSchema.parse({ ...testRecipes[0], tips: [] })).toThrow();
  });

  it('requires a standalone step version exactly for recipes with support stages', () => {
    const withSupportStages = testRecipes[0];
    const withoutSupportStages = testRecipes[1];

    expect(recipeSchema.parse(withSupportStages).stepsOnly).toEqual([
      'Przygotuj sprzęt i wykonaj krok testowy.',
    ]);
    expect(recipeSchema.parse(withoutSupportStages).stepsOnly).toBeUndefined();

    expect(() => recipeSchema.parse({ ...withSupportStages, stepsOnly: undefined })).toThrow();
    expect(() => recipeSchema.parse({ ...withSupportStages, stepsOnly: [] })).toThrow();
    expect(() =>
      recipeSchema.parse({ ...withoutSupportStages, stepsOnly: ['Krok samodzielny.'] }),
    ).toThrow();
  });

  it('accepts only the controlled preparation timing groups', () => {
    const [first] = testRecipes;
    const preparation = first.preparation?.[0];
    if (!preparation) throw new Error('Test recipe preparation is missing');

    expect(recipeSchema.parse(first).preparation?.map(({ timing }) => timing)).toEqual([
      'day_before',
      'just_in_time',
    ]);
    expect(() =>
      recipeSchema.parse({
        ...first,
        preparation: [{ ...preparation, timing: 'later' }],
      }),
    ).toThrow();
  });

  it('requires unique preparation ids and an existing target step', () => {
    const [first] = testRecipes;
    const preparation = first.preparation?.[0];
    if (!preparation) throw new Error('Test recipe preparation is missing');

    expect(() =>
      recipeSchema.parse({
        ...first,
        preparation: [preparation, { ...preparation }],
      }),
    ).toThrow();
    expect(() =>
      recipeSchema.parse({
        ...first,
        preparation: [{ ...preparation, beforeStep: first.steps.length + 1 }],
      }),
    ).toThrow();
  });

  it('keeps the assistant and steps-only versions of the catalog recipe different', () => {
    const recipe = catalog.find(({ slug }) => slug === 'szakszuka-z-chorizo-i-cukinia');

    // Kroki asystenta zakładają wykonane „Zanim zaczniesz”, więc wersja samodzielna
    // musi wnosić czynności, których tam nie ma — inaczej tryb „Tylko kroki”
    // gubiłby krojenie i osuszanie składników.
    expect(recipe?.stepsOnly).toBeDefined();
    expect(recipe?.stepsOnly).not.toEqual(recipe?.steps);
    expect(recipe?.steps.join(' ')).not.toContain('pokrój');
    expect(recipe?.stepsOnly?.join(' ')).toContain('pokrój');
  });

  it('rejects an unknown difficulty and servings outside the supported range', () => {
    expect(() => recipeSchema.parse({ ...testRecipes[0], difficulty: 'expert' })).toThrow();
    expect(() => recipeSchema.parse({ ...testRecipes[0], servings: 0 })).toThrow();
    expect(() => recipeSchema.parse({ ...testRecipes[0], servings: 13 })).toThrow();
  });
});
