import type { Recipe } from '@/domain/recipe-schema';

// Typy i reguły Kategorii importowane przez wyspę React — ten moduł nie może
// mieć zależności wykonywalnych od zod; schematy i walidacja mieszkają
// w `recipe-schema.ts` i działają wyłącznie na etapie builda.
export type { AdvanceStep, Recipe } from '@/domain/recipe-schema';

export const mealTimes = ['breakfast', 'lunch', 'dinner'] as const;
export const tempos = ['now', 'today', 'two_days'] as const;
export const occasions = ['kids', 'guests', 'grill'] as const;

export type MealTime = (typeof mealTimes)[number];
export type Tempo = (typeof tempos)[number];
export type Occasion = (typeof occasions)[number];

export interface CategorySelection {
  mealTime?: MealTime;
  tempo?: Tempo;
  occasion?: Occasion;
}

export function hasCategorySelection(selection: CategorySelection): boolean {
  return Boolean(selection.mealTime || selection.tempo || selection.occasion);
}

export function filterRecipesByCategories(
  recipes: Recipe[],
  selection: CategorySelection,
): Recipe[] {
  if (!hasCategorySelection(selection)) return [];

  return recipes
    .filter((recipe) => recipe.status === 'published')
    .filter((recipe) => !selection.mealTime || recipe.mealTimes.includes(selection.mealTime))
    .filter((recipe) => !selection.tempo || recipe.tempos.includes(selection.tempo))
    .filter((recipe) => !selection.occasion || recipe.occasions.includes(selection.occasion))
    .sort((left, right) => right.editorialPriority - left.editorialPriority);
}
