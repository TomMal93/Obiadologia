export const ingredientCategories = [
  'produce',
  'meat',
  'dairy',
  'grains',
  'pantry',
  'spices',
] as const;

export type IngredientCategory = (typeof ingredientCategories)[number];
