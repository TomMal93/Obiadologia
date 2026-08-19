import Fuse from 'fuse.js';
import type { Difficulty, MealTime, Occasion, Recipe, Tempo } from '@/domain/recipe';

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

const standaloneSuggestionStopwords = new Set([
  'albo',
  'bez',
  'dla',
  'do',
  'i',
  'lub',
  'na',
  'opcjonalnie',
  'oraz',
  'tylko',
  'w',
  'z',
  'ze',
]);

function isUsefulCompactSuggestion(value: string): boolean {
  const words = value.trim().split(/\s+/u);
  return words.length <= 2 && (
    words.length > 1 ||
    !standaloneSuggestionStopwords.has(normalizeSearchText(words[0] ?? ''))
  );
}

const tempoKeywords = [
  'szybko',
  'szybki',
  'szybkie',
  'ekspres',
  'ekspresowe',
  'blyskawicz',
  'minut',
  'kwadrans',
  'latw',
  'prost',
  'jednogarnkow',
  'pateln',
  'garnek',
  'zimno',
  'lunchbox',
  'zapas',
  'odgrzan',
  'bez pieczenia',
  'bez gotowania',
];

const occasionKeywords = [
  'dziec',
  'gosc',
  'grill',
  'imprez',
  'domowk',
  'wynos',
  'prac',
  'szkol',
  'piknik',
  'rodzin',
  'dwojg',
  'randk',
  'romantycz',
  'swiet',
  'niedziel',
  'lekk',
  'fit',
  'dietetycz',
  'zdrow',
  'konkret',
  'sycac',
  'bogat',
  'comfort',
  'wegetarian',
  'wege',
  'wegan',
  'miesa',
  'slodk',
  'wytrawn',
  'rozgrzewaj',
  'orzezwiaj',
  'pikant',
  'ostr',
  'lagodn',
  'warzyw',
];

function classifyTag(normalized: string): 'tempo' | 'occasion' | 'coral' {
  if (tempoKeywords.some((keyword) => normalized.includes(keyword))) return 'tempo';
  if (occasionKeywords.some((keyword) => normalized.includes(keyword))) return 'occasion';
  return 'coral';
}

// Rozkłada tropy z koszyków kolorystycznych naprzemiennie (round-robin), aby kolory
// (koralowy, zielony, niebieski) rozłożyły się po siatce po równo.
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

const categorySuggestions: Record<MealTime | Tempo | Occasion, string> = {
  breakfast: 'śniadanie',
  lunch: 'obiad',
  dinner: 'kolacja',
  now: 'na już',
  today: 'na dziś',
  two_days: 'dwa dni',
  kids: 'dla dzieci',
  guests: 'dla gości',
  grill: 'na grilla',
};

const difficultyTerms: Record<Difficulty, string> = {
  easy: 'łatwe proste szybkie łatwy prosty',
  medium: 'średnie dla każdego',
  hard: 'trudne dla wprawnych wymagające zaawansowane',
};

function mapPaceTerms(pace: number): string {
  if (pace <= 0.35) return 'szybko szybkie ekspresowe na już';
  if (pace >= 0.65) return 'bez pośpiechu powolne spokojne wolno';
  return '';
}

function mapLightnessTerms(lightness: number): string {
  if (lightness >= 0.65) return 'lekko lekkie lekka dietetyczne fit';
  if (lightness <= 0.35) return 'konkretnie konkretne konkretny sycące sycący';
  return '';
}

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
    categories: [
      ...recipe.mealTimes.map((value) => categoryTerms[value]),
      ...recipe.tempos.map((value) => categoryTerms[value]),
      ...recipe.occasions.map((value) => categoryTerms[value]),
      difficultyTerms[recipe.difficulty],
      mapPaceTerms(recipe.mapPosition.pace),
      mapLightnessTerms(recipe.mapPosition.lightness),
    ].map(normalizeSearchText),
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
          (value) => categorySuggestions[value],
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
        .filter(isUsefulCompactSuggestion)
        .sort((left, right) => left.length - right.length)
        .slice(0, limit);
    },
    // Typowane „tropy" na start i przy braku wyników: pory dnia, tempa i okazje
    // obecne w katalogu plus wyraziste składniki i cechy. Zrównoważone między
    // 3 grupami kolorów (koralowy = pora dnia / składnik, zielony = tempo, niebieski = okazja).
    // Każdy trop jest realnym zapytaniem, więc kliknięcie zawsze prowadzi do trafień.
    tropes(limit = 16) {
      const presentMealTimes = new Set(published.flatMap((recipe) => recipe.mealTimes));
      const presentTempos = new Set(published.flatMap((recipe) => recipe.tempos));
      const presentOccasions = new Set(published.flatMap((recipe) => recipe.occasions));
      const presentDifficulties = new Set(published.map((recipe) => recipe.difficulty));
      const hasFastPace = published.some((recipe) => recipe.mapPosition.pace <= 0.35);
      const hasSlowPace = published.some((recipe) => recipe.mapPosition.pace >= 0.65);
      const hasLight = published.some((recipe) => recipe.mapPosition.lightness >= 0.65);
      const hasHearty = published.some((recipe) => recipe.mapPosition.lightness <= 0.35);

      const seenQuery = new Set<string>();

      const coralBucket: Trope[] = [];
      const greenBucket: Trope[] = [];
      const blueBucket: Trope[] = [];

      function addTrope(trope: Trope, bucket: Trope[]) {
        const normalized = normalizeSearchText(trope.query);
        if (!normalized || seenQuery.has(normalized)) return;
        seenQuery.add(normalized);
        bucket.push(trope);
      }

      // 1. Grupa koralowa: Pory dnia
      for (const { value, label, query } of daypartTropes) {
        if (presentMealTimes.has(value)) {
          addTrope({ label, query, kind: 'daypart' }, coralBucket);
        }
      }

      // 2. Grupa zielona: Tempa, trudność i tempo z mapy
      for (const { value, label, query } of tempoTropes) {
        if (presentTempos.has(value)) {
          addTrope({ label, query, kind: 'tempo' }, greenBucket);
        }
      }
      if (presentDifficulties.has('easy')) {
        addTrope({ label: 'Łatwe', query: 'łatwe', kind: 'tempo' }, greenBucket);
      }
      if (hasFastPace) {
        addTrope({ label: 'Ekspresowe', query: 'ekspresowe', kind: 'tempo' }, greenBucket);
      }
      if (presentDifficulties.has('medium')) {
        addTrope({ label: 'Średnie', query: 'średnie', kind: 'tempo' }, greenBucket);
      }
      if (hasSlowPace) {
        addTrope({ label: 'Bez pośpiechu', query: 'bez pośpiechu', kind: 'tempo' }, greenBucket);
      }
      if (presentDifficulties.has('hard')) {
        addTrope({ label: 'Dla wprawnych', query: 'wymagające', kind: 'tempo' }, greenBucket);
      }

      // 3. Grupa niebieska: Okazje i charakter z mapy
      for (const { value, label, query } of occasionTropes) {
        if (presentOccasions.has(value)) {
          addTrope({ label, query, kind: 'occasion' }, blueBucket);
        }
      }
      if (hasLight) {
        addTrope({ label: 'Lekko', query: 'lekko', kind: 'occasion' }, blueBucket);
      }
      if (hasHearty) {
        addTrope({ label: 'Konkretnie', query: 'konkretnie', kind: 'occasion' }, blueBucket);
      }

      // 4. Tagi z przepisów — klasyfikacja do odpowiedniego koszyka
      for (const recipe of published) {
        for (const tag of recipe.tags) {
          const normalized = normalizeSearchText(tag);
          if (
            genericIngredients.has(tag) ||
            seenQuery.has(normalized) ||
            !isUsefulCompactSuggestion(tag)
          ) continue;

          const classification = classifyTag(normalized);
          if (classification === 'tempo') {
            addTrope({ label: capitalize(tag), query: tag, kind: 'tempo' }, greenBucket);
          } else if (classification === 'occasion') {
            addTrope({ label: capitalize(tag), query: tag, kind: 'occasion' }, blueBucket);
          } else {
            addTrope({ label: capitalize(tag), query: tag, kind: 'ingredient' }, coralBucket);
          }
        }
      }

      // 5. Składniki — do koszyka koralowego
      for (const recipe of published) {
        for (const { name } of recipe.ingredients) {
          const normalized = normalizeSearchText(name);
          if (
            genericIngredients.has(name) ||
            seenQuery.has(normalized) ||
            !isUsefulCompactSuggestion(name)
          ) continue;
          addTrope({ label: capitalize(name), query: name, kind: 'ingredient' }, coralBucket);
        }
      }

      // Przeplatamy 3 koszyki kolorów (koralowy, zielony, niebieski) naprzemiennie
      return interleave([coralBucket, greenBucket, blueBucket]).slice(0, limit);
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
