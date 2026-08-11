import { z } from 'zod';
import { ingredientSchema } from '@/domain/ingredient';
import { difficulties, mealTimes, occasions, tempos } from '@/domain/recipe';

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

export const recipeSchema = z
  .object({
    id: z.string().trim().min(1),
    slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    image: imageReferenceSchema.nullable(),
    preparationMinutes: z.number().int().positive(),
    difficulty: z.enum(difficulties),
    servings: z.number().int().positive().max(12),
    ingredients: z.array(ingredientSchema).min(1),
    // Czynności wykonywane przed właściwym gotowaniem — sekcja „Zanim zaczniesz”:
    // mise en place, sprzęt, a także to, co da się zrobić z wyprzedzeniem. Możliwość
    // wcześniejszego wykonania jest częścią zdania („możesz to zrobić wieczorem”),
    // a nie osobnym polem czasu: strona niczego z niej nie wylicza.
    preparation: z.array(z.string().trim().min(1)).min(1).optional(),
    // Kroki właściwego gotowania pisane tak, jakby sekcja „Zanim zaczniesz” była
    // już wykonana. To wersja dla „Trybu asystenta” i dla przepisu bez tej sekcji,
    // a także treść pokazywana bez skryptu.
    steps: z.array(z.string().trim().min(1)).min(1),
    // Samodzielna wersja kroków dla trybu „Tylko kroki”, w którym sekcja
    // „Zanim zaczniesz” jest ukryta. Musi zawierać wszystko, co w `steps` zostało
    // z niej założone (krojenie, sprzęt), więc jest osobnym tekstem, a nie kopią.
    stepsOnly: z.array(z.string().trim().min(1)).min(1).optional(),
    // Opcjonalne, krótkie porady redakcyjne prezentowane po krokach.
    // Brak pola oznacza przepis bez sekcji „Coś jeszcze”.
    tips: z.array(z.string().trim().min(1)).min(1).optional(),
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
  .strict()
  .superRefine((recipe, context) => {
    // `stepsOnly` istnieje dokładnie wtedy, gdy przepis ma sekcję „Zanim zaczniesz”.
    // Bez niej tryb „Tylko kroki” nie powstaje, a druga lista byłaby martwą
    // treścią, która po cichu rozjedzie się z `steps`.
    if (recipe.preparation && !recipe.stepsOnly) {
      context.addIssue({
        code: 'custom',
        path: ['stepsOnly'],
        message:
          'Przepis z sekcją „Zanim zaczniesz” wymaga samodzielnej wersji kroków w `stepsOnly`.',
      });
    }

    if (!recipe.preparation && recipe.stepsOnly) {
      context.addIssue({
        code: 'custom',
        path: ['stepsOnly'],
        message:
          'Przepis bez sekcji „Zanim zaczniesz” nie ma trybu „Tylko kroki”, więc `stepsOnly` jest zbędne.',
      });
    }
  });

export type Recipe = z.infer<typeof recipeSchema>;

/**
 * Sprawdza unikalność `id` i `slug` w obrębie całego katalogu. `recipeSchema`
 * waliduje pojedynczy rekord, ale nie widzi pozostałych — integralność między
 * rekordami trzeba wymusić osobno. Współdzielone przez `parseRecipes` (dane
 * ładowane jako jedna tablica) i przez katalog Content Collections, gdzie każdy
 * przepis jest osobnym plikiem walidowanym niezależnie.
 */
export function assertUniqueRecipeIdentity(recipes: readonly Recipe[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const recipe of recipes) {
    if (ids.has(recipe.id)) throw new Error(`Powtórzony identyfikator przepisu: ${recipe.id}`);
    if (slugs.has(recipe.slug)) throw new Error(`Powtórzony slug przepisu: ${recipe.slug}`);
    ids.add(recipe.id);
    slugs.add(recipe.slug);
  }
}

export function parseRecipes(input: unknown): Recipe[] {
  const recipes = z.array(recipeSchema).parse(input);
  assertUniqueRecipeIdentity(recipes);
  return recipes;
}
