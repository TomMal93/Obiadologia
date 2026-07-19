import { z } from 'zod';
import { ingredientSchema } from '@/domain/ingredient';

export const mealTimes = ['breakfast', 'lunch', 'dinner'] as const;
export const tempos = ['now', 'today', 'two_days'] as const;
export const occasions = ['kids', 'guests', 'grill'] as const;

export type MealTime = (typeof mealTimes)[number];
export type Tempo = (typeof tempos)[number];
export type Occasion = (typeof occasions)[number];

const imageReferenceSchema = z
  .object({
    src: z.string().trim().min(1),
    alt: z.string().trim().min(1),
  })
  .strict();

export const recipeSchema = z
  .object({
    id: z.string().trim().min(1),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    image: imageReferenceSchema.nullable(),
    preparationMinutes: z.number().int().positive(),
    ingredients: z.array(ingredientSchema).min(1),
    tags: z.array(z.string().trim().min(1)).min(1),
    mealTimes: z.array(z.enum(mealTimes)).min(1),
    tempos: z.array(z.enum(tempos)).min(1),
    occasions: z.array(z.enum(occasions)).min(1),
    mapPosition: z
      .object({
        pace: z.number().min(0).max(1),
        lightness: z.number().min(0).max(1),
      })
      .strict(),
    editorialPriority: z.number(),
    status: z.enum(['draft', 'published', 'archived']),
  })
  .strict();

export type Recipe = z.infer<typeof recipeSchema>;

export interface CategorySelection {
  mealTime?: MealTime;
  tempo?: Tempo;
  occasion?: Occasion;
}

export function parseRecipes(input: unknown): Recipe[] {
  const recipes = z.array(recipeSchema).parse(input);
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const recipe of recipes) {
    if (ids.has(recipe.id)) throw new Error(`Powtórzony identyfikator przepisu: ${recipe.id}`);
    if (slugs.has(recipe.slug)) throw new Error(`Powtórzony slug przepisu: ${recipe.slug}`);
    ids.add(recipe.id);
    slugs.add(recipe.slug);
  }

  return recipes;
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
