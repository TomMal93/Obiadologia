import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { recipeSchema } from '@/domain/recipe-schema';

// Katalog przepisów: jeden plik JSON na przepis w `src/content/recipes/`.
// Loader `glob` wczytuje i waliduje pliki na etapie builda tym samym schematem
// `zod`, co reszta ścieżek (TD-003) — nie powstaje druga definicja `Recipe`.
// Rozwiązanie jest w całości buildowe: strony pozostają prerenderowane do
// statycznego HTML, więc czas wczytania u użytkownika się nie zmienia.
const recipes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/recipes' }),
  schema: recipeSchema,
});

export const collections = { recipes };
