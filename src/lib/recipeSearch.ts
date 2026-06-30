import MiniSearch from "minisearch";

export interface RecipeSearchDocument {
  id: string;
  title: string;
  summary: string;
  description: string;
  timeMinutes: number;
  tags: string[];
  categories: string[];
  mainIngredients: string[];
  searchAliases: string[];
  effort: string;
  mood: string;
  cost: string;
  equipment?: string[];
  diet?: string[];
}

export type RecipeSortMode = "relevance" | "time" | "title" | "low-cost" | "effort";

export interface RecipeSearchOptions {
  query?: string;
  filters?: string[];
  sort?: RecipeSortMode;
}

export interface RecipeSearchResult {
  ids: string[];
  suggestions: string[];
}

type RankedDocument = RecipeSearchDocument & { score?: number };

const SEARCH_FIELDS = [
  "title",
  "mainIngredients",
  "tags",
  "categories",
  "searchAliases",
  "summary",
  "description",
  "effort",
  "mood",
  "cost"
];

const FIELD_BOOSTS = {
  title: 5,
  mainIngredients: 4,
  tags: 4,
  categories: 2.4,
  searchAliases: 2.2,
  summary: 1.2,
  description: 1,
  effort: 0.8,
  mood: 0.8,
  cost: 0.8
};

export function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createRecipeSearch(documents: RecipeSearchDocument[]) {
  const byId = new Map(documents.map((document) => [document.id, document]));
  const miniSearch = new MiniSearch<RecipeSearchDocument>({
    fields: SEARCH_FIELDS,
    storeFields: ["id"],
    extractField: (document, fieldName) => {
      const value = document[fieldName as keyof RecipeSearchDocument];
      return Array.isArray(value) ? value.join(" ") : String(value ?? "");
    },
    searchOptions: {
      boost: FIELD_BOOSTS,
      prefix: true,
      fuzzy: (term) => (term.length > 3 ? 0.25 : false),
      combineWith: "AND"
    },
    processTerm: (term) => normalizeSearchText(term)
  });

  miniSearch.addAll(documents.map(normalizeDocument));

  function search({ query = "", filters = [], sort = "time" }: RecipeSearchOptions = {}): RecipeSearchResult {
    const normalizedQuery = normalizeSearchText(query);
    const normalizedFilters = filters.map(normalizeSearchText).filter(Boolean);
    const filterDocuments = (items: RankedDocument[]) =>
      items.filter((document) => normalizedFilters.every((filter) => matchesFilter(document, filter)));

    const ranked = normalizedQuery
      ? miniSearch.search(normalizedQuery).map((result) => ({ ...byId.get(result.id)!, score: result.score }))
      : documents.map((document) => ({ ...document, score: 0 }));

    const filtered = filterDocuments(ranked.filter((document) => document.id));
    const sorted = sort === "relevance" ? filtered : sortDocuments(filtered, sort);
    const suggestions = normalizedQuery && sorted.length < 3 ? suggest(normalizedQuery, normalizedFilters) : [];

    return {
      ids: sorted.map((document) => document.id),
      suggestions
    };
  }

  function suggest(query: string, filters: string[]) {
    return miniSearch
      .autoSuggest(query, { boost: FIELD_BOOSTS, prefix: true, fuzzy: true })
      .map((suggestion) => normalizeSearchText(suggestion.suggestion))
      .filter(Boolean)
      .filter((suggestion, index, all) => all.indexOf(suggestion) === index)
      .filter((suggestion) => {
        const ids = miniSearch.search(suggestion, { combineWith: "AND" }).map((result) => result.id);
        return ids.some((id) => {
          const document = byId.get(id);
          return document && filters.every((filter) => matchesFilter(document, filter));
        });
      })
      .slice(0, 3);
  }

  return { search };
}

function normalizeDocument(document: RecipeSearchDocument): RecipeSearchDocument {
  return {
    ...document,
    title: normalizeSearchText(document.title),
    summary: normalizeSearchText(document.summary),
    description: normalizeSearchText(document.description),
    tags: document.tags.map(normalizeSearchText),
    categories: document.categories.map(normalizeSearchText),
    mainIngredients: document.mainIngredients.map(normalizeSearchText),
    searchAliases: document.searchAliases.map(normalizeSearchText),
    effort: normalizeSearchText(document.effort),
    mood: normalizeSearchText(document.mood),
    cost: normalizeSearchText(document.cost),
    equipment: document.equipment?.map(normalizeSearchText),
    diet: document.diet?.map(normalizeSearchText)
  };
}

function matchesFilter(document: RecipeSearchDocument, filter: string) {
  if (filter === "do 15 minut" || filter === "15 min") return document.timeMinutes <= 15;
  if (filter === "do 30 minut" || filter === "30 min") return document.timeMinutes <= 30;
  if (filter === "do 45 minut" || filter === "45 min") return document.timeMinutes <= 45;

  const values = [
    ...document.tags,
    ...document.categories,
    ...document.mainIngredients,
    ...document.searchAliases,
    ...(document.equipment ?? []),
    ...(document.diet ?? []),
    document.effort,
    document.mood,
    document.cost
  ].map(normalizeSearchText);

  return values.includes(filter);
}

function sortDocuments(documents: RankedDocument[], mode: RecipeSortMode) {
  return [...documents].sort((a, b) => {
    if (mode === "title") return a.title.localeCompare(b.title, "pl");
    if (mode === "low-cost") return Number(b.cost === "tanie") - Number(a.cost === "tanie") || a.timeMinutes - b.timeMinutes;
    if (mode === "effort") return effortScore(b) - effortScore(a) || a.timeMinutes - b.timeMinutes;
    return a.timeMinutes - b.timeMinutes;
  });
}

function effortScore(document: RecipeSearchDocument) {
  const values = [...document.tags, ...document.categories, document.effort].map(normalizeSearchText);
  return Number(values.includes("malo zmywania")) + Number(values.includes("jedna patelnia")) + Number(values.includes("jednogarnkowe"));
}
