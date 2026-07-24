import { getCollection } from 'astro:content';
import type { Recipe } from '@/domain/recipe';
import { assertUniqueRecipeIdentity } from '@/domain/recipe-schema';

// Kanoniczny dostęp do katalogu przepisów dla stron Astro (frontmatter/build).
// Zastępuje dawną tablicę `prototypeRecipes`: dane mieszkają teraz w osobnych
// plikach `src/content/recipes/*.json`, a `getCollection` zwraca rekordy już
// zwalidowane schematem z `src/content.config.ts`.
//
// Wywoływać wyłącznie po stronie serwera/builda. Wyspa React nie importuje tego
// modułu — otrzymuje przepisy jako propsy, więc `astro:content` nie trafia do
// paczki klienckiej.
export async function getRecipes(): Promise<Recipe[]> {
  const entries = await getCollection('recipes');
  // Kolejność plików z `getCollection` zależy od nazw; ustalamy stabilną,
  // redakcyjną kolejność po `id` (`recipe_001`…), niezależną od nazw plików.
  const recipes = entries
    .map((entry) => entry.data)
    .sort((left, right) => left.id.localeCompare(right.id));

  assertUniqueRecipeIdentity(recipes);
  return recipes;
}

// Tylko opublikowane rekordy mogą pojawić się użytkownikowi (data-model.md:
// „Integralność danych”). Wygodny filtr dla ścieżek pokazujących treść.
export async function getPublishedRecipes(): Promise<Recipe[]> {
  const recipes = await getRecipes();
  return recipes.filter((recipe) => recipe.status === 'published');
}
