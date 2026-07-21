import Fuse from 'fuse.js';
import type { MealTime, Occasion, Recipe, Tempo } from '@/domain/recipe';

export interface RecipeSearch {
  search(query: string): Recipe[];
  suggest(query: string, limit?: number): string[];
  tropes(limit?: number): string[];
}

export interface MapCoordinates {
  x: number;
  y: number;
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
    // Popularne „tropy" na start i przy braku wyników: najczęstsze tagi
    // opublikowanych przepisów. Każdy jest realnym zapytaniem, więc kliknięcie
    // zawsze prowadzi do trafień. Remisy rozstrzygamy alfabetycznie (pl-PL),
    // aby kolejność była stabilna między renderami.
    tropes(limit = 6) {
      const counts = new Map<string, number>();
      for (const recipe of published) {
        for (const tag of recipe.tags) {
          counts.set(tag, (counts.get(tag) ?? 0) + 1);
        }
      }
      return [...counts.entries()]
        .sort(
          (left, right) =>
            right[1] - left[1] || left[0].localeCompare(right[0], 'pl-PL'),
        )
        .slice(0, limit)
        .map(([tag]) => tag);
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
