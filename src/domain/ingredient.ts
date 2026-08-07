import { z } from 'zod';
import { ingredientCategories } from './ingredient-category';
import { householdUnits, ingredientUnits } from './ingredient-measure';

export {
  formatHouseholdMeasure,
  formatMetricMeasure,
  householdUnits,
  ingredientUnits,
  millilitresToHousehold,
} from './ingredient-measure';
export type {
  HouseholdMeasureConversion,
  HouseholdUnit,
  IngredientMeasure,
  IngredientUnit,
} from './ingredient-measure';

const householdMeasureSchema = z
  .object({
    unit: z.enum(householdUnits),
    metricAmount: z.number().positive(),
  })
  .strict();

/**
 * Schemat składnika jest używany wyłącznie podczas walidacji danych na etapie
 * builda. Czyste formatowanie i przeliczanie miar mieszka osobno w
 * `ingredient-measure.ts`, aby mogło bezpiecznie trafić do skryptu klienta.
 */
export const ingredientSchema = z
  .object({
    category: z.enum(ingredientCategories),
    name: z.string().trim().min(1),
    amount: z.number().positive(),
    unit: z.enum(ingredientUnits),
    // Gęstość składnika sypkiego wyrażona jako gramy na jedną szklankę (250 ml).
    gramsPerCup: z.number().positive().optional(),
    // Naturalna miara (np. plaster lub garść) wyliczana z bazowej ilości
    // metrycznej; `metricAmount` to ilość g/ml odpowiadająca jednej mierze.
    household: householdMeasureSchema.optional(),
  })
  .strict()
  .superRefine((ingredient, context) => {
    if (ingredient.household && ingredient.unit === 'szt') {
      context.addIssue({
        code: 'custom',
        path: ['household'],
        message: 'Naturalny przelicznik domowy dotyczy wyłącznie ilości w g albo ml.',
      });
    }
  });

export type Ingredient = z.infer<typeof ingredientSchema>;
