import { z } from 'zod';
import { ingredientSchema } from '@/domain/ingredient';
import { mealTimes, occasions, tempos } from '@/domain/recipe';

// Schematy zod mieszkają osobno od typów i reguł Kategorii (`recipe.ts`),
// bo walidacja danych odbywa się w całości na etapie builda (`src/data`).
// Nie importuj tego modułu z kodu trafiającego do przeglądarki (wyspa React,
// skrypty stron) — wciągnąłby zod do paczki klienckiej.

const imageReferenceSchema = z
  .object({
    src: z.string().trim().min(1),
    alt: z.string().trim().min(1),
  })
  .strict();

/**
 * Krok wykonywany z wyprzedzeniem czasowym („zrób wcześniej”): namoczenie,
 * marynowanie, schłodzenie ciasta. `leadTimeMinutes` to liczba minut przed
 * podaniem, o którą trzeba go zacząć. Wartość jest strukturalna (a nie „noc”
 * czy „2h”), aby na stronie dało się z niej policzyć godzinę startu przy
 * zadanej porze serwowania.
 */
export const advanceStepSchema = z
  .object({
    text: z.string().trim().min(1),
    leadTimeMinutes: z.number().int().positive(),
  })
  .strict();

export type AdvanceStep = z.infer<typeof advanceStepSchema>;

export const recipeSchema = z
  .object({
    id: z.string().trim().min(1),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    image: imageReferenceSchema.nullable(),
    preparationMinutes: z.number().int().positive(),
    ingredients: z.array(ingredientSchema).min(1),
    // Czynności z wyprzedzeniem czasowym; opcjonalne — brak pola oznacza przepis
    // bez etapu „zrób wcześniej”. Jeśli pole istnieje, MUSI mieć co najmniej jeden krok.
    advance: z.array(advanceStepSchema).min(1).optional(),
    // Przygotowanie wstępne (mise en place, skompletowanie sprzętu); opcjonalne,
    // zwykły tekst — struktura czasu nie jest tu potrzebna.
    preparation: z.array(z.string().trim().min(1)).min(1).optional(),
    steps: z.array(z.string().trim().min(1)).min(1),
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
