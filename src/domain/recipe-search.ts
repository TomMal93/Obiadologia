import Fuse from 'fuse.js';
import type { MealTime, Occasion, Recipe, Tempo } from '@/domain/recipe';

export interface RecipeSearch {
  search(query: string): Recipe[];
  suggest(query: string, limit?: number): string[];
  tropes(limit?: number): Trope[];
}

export interface MapCoordinates {
  x: number;
  y: number;
}

// Rodzaj tropu decyduje o jego kolorze w UI — spójnie z akcentami wyboru
// Kategorii: pora dnia i składnik = koral (Wyszukiwarka), tempo = zielony
// (Kategorie), okazja = niebieski (Mapa).
export type TropeKind = 'daypart' | 'ingredient' | 'tempo' | 'occasion';

export interface Trope {
  label: string;
  query: string;
  kind: TropeKind;
}

interface CategoryTrope<Value extends string> {
  value: Value;
  label: string;
  query: string;
}

const daypartTropes: CategoryTrope<MealTime>[] = [
  { value: 'breakfast', label: 'Śniadanie', query: 'śniadanie' },
  { value: 'lunch', label: 'Obiad', query: 'obiad' },
  { value: 'dinner', label: 'Kolacja', query: 'kolacja' },
];

const tempoTropes: CategoryTrope<Tempo>[] = [
  { value: 'now', label: 'Szybko', query: 'szybko' },
  { value: 'today', label: 'Na dziś', query: 'na dziś' },
  { value: 'two_days', label: 'Dwa dni', query: 'dwa dni' },
];

const occasionTropes: CategoryTrope<Occasion>[] = [
  { value: 'kids', label: 'Dla dzieci', query: 'dzieci' },
  { value: 'guests', label: 'Dla gości', query: 'gości' },
  { value: 'grill', label: 'Na grilla', query: 'grill' },
];

// Składniki podstawowe (spiżarniane) nie są dobrymi tropami — pomijamy je, aby
// kafle niosły wyraziste, „prowadzące" hasła.
const genericIngredients = new Set([
  'oliwa', 'sól', 'czosnek', 'bulion', 'miód', 'cynamon', 'papryka wędzona',
  'sos jogurtowy', 'bułka', 'sałata', 'pomidor', 'pomidory', 'płatki owsiane',
]);

function capitalize(value: string): string {
  return value.charAt(0).toLocaleUpperCase('pl-PL') + value.slice(1);
}

// Rozkłada tropy z kilku koszyków naprzemiennie (round-robin), aby kolory
// rodzajów rozłożyły się po siatce, zamiast zbijać w jednolite bloki.
function interleave(buckets: Trope[][]): Trope[] {
  const out: Trope[] = [];
  const longest = Math.max(0, ...buckets.map((bucket) => bucket.length));
  for (let index = 0; index < longest; index += 1) {
    for (const bucket of buckets) {
      const trope = bucket[index];
      if (trope) out.push(trope);
    }
  }
  return out;
}

const categoryTerms: Record<MealTime | Tempo | Occasion, string> = {
  breakfast: 'śniadanie',
  lunch: 'obiad',
  dinner: 'kolacja',
  now: 'na już szybko',
  today: 'na dziś',
  two_days: 'na dwa dni',
  kids: 'dla dzieci',
  guests: 'dla gości',
  grill: 'na grilla grill',
};

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('pl-PL')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l');
}

export function createRecipeSearch(recipes: Recipe[]): RecipeSearch {
  const published = recipes.filter((recipe) => recipe.status === 'published');
  const records = published.map((recipe) => ({
    recipe,
    title: normalizeSearchText(recipe.title),
    ingredients: recipe.ingredients.map((ingredient) => normalizeSearchText(ingredient.name)),
    tags: recipe.tags.map(normalizeSearchText),
    description: normalizeSearchText(recipe.description),
    categories: [...recipe.mealTimes, ...recipe.tempos, ...recipe.occasions]
      .map((value) => normalizeSearchText(categoryTerms[value])),
  }));
  const fuse = new Fuse(records, {
    threshold: 0.34,
    ignoreLocation: true,
    includeScore: true,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'ingredients', weight: 0.25 },
      { name: 'tags', weight: 0.15 },
      { name: 'categories', weight: 0.1 },
      { name: 'description', weight: 0.05 },
    ],
  });

  const suggestions = Array.from(
    new Set(
      published.flatMap((recipe) => [
        recipe.title,
        ...recipe.ingredients.map((ingredient) => ingredient.name),
        ...recipe.tags,
        ...[...recipe.mealTimes, ...recipe.tempos, ...recipe.occasions].map(
          (value) => categoryTerms[value].split(' ')[0],
        ),
      ]),
    ),
  );

  return {
    search(query) {
      const normalized = normalizeSearchText(query);
      if (!normalized) return [];
      return fuse.search(normalized).map(({ item }) => item.recipe);
    },
    suggest(query, limit = 4) {
      const normalized = normalizeSearchText(query);
      if (!normalized) return [];
      return suggestions
        .filter((suggestion) => normalizeSearchText(suggestion).includes(normalized))
        .sort((left, right) => left.length - right.length)
        .slice(0, limit);
    },
    // Typowane „tropy" na start i przy braku wyników: pory dnia, tempa i okazje
    // obecne w katalogu plus wyraziste składniki. Każdy niesie rodzaj (kolor) i
    // jest realnym zapytaniem, więc kliknięcie zawsze prowadzi do trafień.
    // Koszyki są przeplatane, żeby kolory rozłożyły się po siatce.
    tropes(limit = 16) {
      const presentMealTimes = new Set(published.flatMap((recipe) => recipe.mealTimes));
      const presentTempos = new Set(published.flatMap((recipe) => recipe.tempos));
      const presentOccasions = new Set(published.flatMap((recipe) => recipe.occasions));

      const daypart: Trope[] = daypartTropes
        .filter((trope) => presentMealTimes.has(trope.value))
        .map(({ label, query }) => ({ label, query, kind: 'daypart' }));
      const tempo: Trope[] = tempoTropes
        .filter((trope) => presentTempos.has(trope.value))
        .map(({ label, query }) => ({ label, query, kind: 'tempo' }));
      const occasion: Trope[] = occasionTropes
        .filter((trope) => presentOccasions.has(trope.value))
        .map(({ label, query }) => ({ label, query, kind: 'occasion' }));

      const ingredient: Trope[] = [];
      const seenIngredient = new Set<string>();
      for (const recipe of published) {
        for (const { name } of recipe.ingredients) {
          const normalized = normalizeSearchText(name);
          if (genericIngredients.has(name) || seenIngredient.has(normalized)) continue;
          seenIngredient.add(normalized);
          ingredient.push({ label: capitalize(name), query: name, kind: 'ingredient' });
        }
      }

      return interleave([ingredient, tempo, occasion, daypart]).slice(0, limit);
    },
  };
}

function coversMealTime(recipe: Recipe, mealTime: MealTime): boolean {
  return recipe.mealTimes.includes(mealTime);
}

export function rankRecipesForMap(
  recipes: Recipe[],
  coordinates: MapCoordinates,
  limit = 4,
): Recipe[] {
  const published = recipes.filter((recipe) => recipe.status === 'published');
  const isNeutral = coordinates.x === 50 && coordinates.y === 50;

  if (isNeutral) {
    const byPriority = [...published].sort(
      (left, right) => right.editorialPriority - left.editorialPriority,
    );
    const selected: Recipe[] = [];

    for (const mealTime of ['breakfast', 'lunch', 'dinner'] as const) {
      const candidate = byPriority.find(
        (recipe) => !selected.includes(recipe) && coversMealTime(recipe, mealTime),
      );
      if (candidate) selected.push(candidate);
    }
    for (const recipe of byPriority) {
      if (selected.length >= limit) break;
      if (!selected.includes(recipe)) selected.push(recipe);
    }
    return selected
      .sort((left, right) => right.editorialPriority - left.editorialPriority)
      .slice(0, limit);
  }

  const pace = coordinates.x / 100;
  const lightness = 1 - coordinates.y / 100;
  return published
    .map((recipe) => ({
      recipe,
      distance: Math.hypot(
        recipe.mapPosition.pace - pace,
        recipe.mapPosition.lightness - lightness,
      ),
    }))
    .sort(
      (left, right) =>
        left.distance - right.distance ||
        right.recipe.editorialPriority - left.recipe.editorialPriority,
    )
    .slice(0, limit)
    .map(({ recipe }) => recipe);
}
