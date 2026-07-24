import { z } from 'zod';
import { ingredientUnits } from './ingredient-measure';

export {
  formatHouseholdMeasure,
  formatMetricMeasure,
  ingredientUnits,
  millilitresToHousehold,
} from './ingredient-measure';
export type { IngredientMeasure, IngredientUnit } from './ingredient-measure';

/**
 * Schemat składnika jest używany wyłącznie podczas walidacji danych na etapie
 * builda. Czyste formatowanie i przeliczanie miar mieszka osobno w
 * `ingredient-measure.ts`, aby mogło bezpiecznie trafić do skryptu klienta.
 */
export const ingredientSchema = z
  .object({
    name: z.string().trim().min(1),
    amount: z.number().positive(),
    unit: z.enum(ingredientUnits),
    // Gęstość składnika sypkiego wyrażona jako gramy na jedną szklankę (250 ml).
    gramsPerCup: z.number().positive().optional(),
  })
  .strict();

export type Ingredient = z.infer<typeof ingredientSchema>;
