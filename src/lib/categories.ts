import type { CollectionEntry } from "astro:content";

export type CategoryFilter =
  | { type: "all" }
  | { type: "query" | "tag"; value: string };

export interface RecipeCategory {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  filter: CategoryFilter;
  suggestions: string[];
}

export const recipeCategories = [
  {
    slug: "szybkie",
    title: "Szybkie obiady",
    shortTitle: "Szybkie",
    description: "Pomysły na dni, w których liczy się prosty ruch i krótki czas przy kuchence.",
    intro: "Bez długiego stania i bez układania całego planu gotowania.",
    filter: { type: "tag", value: "do 30 minut" },
    suggestions: ["do 15 minut", "jedna patelnia", "mało zmywania"]
  },
  {
    slug: "tanie",
    title: "Tanie obiady",
    shortTitle: "Tanie",
    description: "Przepisy oparte na niedrogich składnikach i rzeczach, które łatwo mieć pod ręką.",
    intro: "Dobre, kiedy zakupy mają być krótkie, a obiad nadal konkretny.",
    filter: { type: "tag", value: "tanie" },
    suggestions: ["bez zakupów", "z resztek", "jajka"]
  },
  {
    slug: "malo-zmywania",
    title: "Mało zmywania",
    shortTitle: "Mało zmywania",
    description: "Dania, po których nie zostaje pół kuchni do ogarnięcia.",
    intro: "Jedna patelnia, jeden garnek albo bardzo krótka ścieżka sprzątania.",
    filter: { type: "tag", value: "mało zmywania" },
    suggestions: ["jedna patelnia", "jednogarnkowe", "szybkie"]
  },
  {
    slug: "bez-zakupow",
    title: "Bez zakupów",
    shortTitle: "Bez zakupów",
    description: "Przepisy, które można złożyć z podstawowych zapasów i resztek lodówki.",
    intro: "Na moment, kiedy nie ma planu ani ochoty na dodatkowy sklep.",
    filter: { type: "tag", value: "bez zakupów" },
    suggestions: ["tanie", "z resztek", "makaron"]
  },
  {
    slug: "z-resztek",
    title: "Z resztek",
    shortTitle: "Z resztek",
    description: "Pomysły, które pomagają sensownie zużyć końcówki składników.",
    intro: "Drugie życie ryżu, pieczywa, warzyw i tego, co już czeka w lodówce.",
    filter: { type: "tag", value: "z resztek" },
    suggestions: ["ryż", "pieczywo", "mało zmywania"]
  },
  {
    slug: "jajka",
    title: "Przepisy z jajkami",
    shortTitle: "Jajka",
    description: "Szybkie dania z jajkami na śniadanie, kolację albo awaryjny obiad.",
    intro: "Najlepsze wtedy, gdy chcesz coś ciepłego bez większych przygotowań.",
    filter: { type: "query", value: "jajka" },
    suggestions: ["do 15 minut", "tanie", "pieczywo"]
  },
  {
    slug: "pieczywo",
    title: "Przepisy z pieczywem",
    shortTitle: "Pieczywo",
    description: "Tosty, kromki i proste składanie, kiedy trzeba zużyć chleb.",
    intro: "Dobra kategoria na mały głód i bardzo szybkie gotowanie.",
    filter: { type: "query", value: "pieczywo" },
    suggestions: ["jajka", "serowe", "z resztek"]
  },
  {
    slug: "serowe",
    title: "Serowe przepisy",
    shortTitle: "Serowe",
    description: "Ciepłe, proste i sycące rzeczy z serem w roli głównej.",
    intro: "Na szybkie tosty, tortille, makarony i obiady bez napinki.",
    filter: { type: "query", value: "ser" },
    suggestions: ["pieczywo", "do 15 minut", "makaron"]
  },
  {
    slug: "do-15-minut",
    title: "Do 15 minut",
    shortTitle: "Do 15 minut",
    description: "Najkrótsze przepisy na moment, kiedy obiad ma wydarzyć się od razu.",
    intro: "Minimum kroków, minimum czekania, maksimum konkretu.",
    filter: { type: "tag", value: "do 15 minut" },
    suggestions: ["jajka", "serowe", "mało zmywania"]
  },
  {
    slug: "jednogarnkowe",
    title: "Jednogarnkowe obiady",
    shortTitle: "Jednogarnkowe",
    description: "Dania, które trzymają cały obiad w jednym naczyniu.",
    intro: "Mniej pilnowania, mniej naczyń i większa szansa na porcję na później.",
    filter: { type: "tag", value: "jednogarnkowe" },
    suggestions: ["na dwa dni", "bez mięsa", "mało zmywania"]
  },
  {
    slug: "bez-miesa",
    title: "Obiady bez mięsa",
    shortTitle: "Bez mięsa",
    description: "Warzywne, sycące i proste dania bez mięsa.",
    intro: "Bez traktowania bezmięsnego obiadu jak kompromisu.",
    filter: { type: "tag", value: "bez mięsa" },
    suggestions: ["ryż", "jednogarnkowe", "tanie"]
  },
  {
    slug: "ryz",
    title: "Przepisy z ryżem",
    shortTitle: "Ryż",
    description: "Miski, curry, patelnie i obiady dobre do pudełka.",
    intro: "Ryż jako baza, która dobrze znosi sosy, warzywa i odgrzewanie.",
    filter: { type: "query", value: "ryż" },
    suggestions: ["na dwa dni", "bez mięsa", "kurczak"]
  },
  {
    slug: "na-dwa-dni",
    title: "Na dwa dni",
    shortTitle: "Na dwa dni",
    description: "Przepisy, które dobrze znoszą odgrzewanie i pudełko na jutro.",
    intro: "Gotujesz raz, a kolejny posiłek jest już prawie załatwiony.",
    filter: { type: "tag", value: "na dwa dni" },
    suggestions: ["jednogarnkowe", "ryż", "tanie"]
  },
  {
    slug: "do-podzialu",
    title: "Do podziału",
    shortTitle: "Do podziału",
    description: "Proste rzeczy do postawienia na stole albo rozdzielenia między kilka osób.",
    intro: "Na luźny stół, szybkie porcje i jedzenie bez ceremonii.",
    filter: { type: "query", value: "tortilla" },
    suggestions: ["serowe", "mało zmywania", "tanie"]
  },
  {
    slug: "dla-dzieci",
    title: "Dla dzieci",
    shortTitle: "Dla dzieci",
    description: "Łagodniejsze i bardziej przewidywalne obiady na wspólny stół.",
    intro: "Znane smaki, proste składniki i mniej ryzykownych niespodzianek.",
    filter: { type: "tag", value: "dla dzieci" },
    suggestions: ["kurczak", "ryż", "szybkie"]
  },
  {
    slug: "kurczak",
    title: "Przepisy z kurczakiem",
    shortTitle: "Kurczak",
    description: "Proste obiady z kurczakiem, gdy ma być znajomo i konkretnie.",
    intro: "Bez kombinowania, z bazą, którą łatwo połączyć z ryżem albo warzywami.",
    filter: { type: "query", value: "kurczak" },
    suggestions: ["ryż", "dla dzieci", "szybkie"]
  },
  {
    slug: "makaron",
    title: "Przepisy z makaronem",
    shortTitle: "Makaron",
    description: "Szybkie makarony i proste sosy z tego, co zwykle jest pod ręką.",
    intro: "Dobre na obiad bez długiej listy zakupów.",
    filter: { type: "query", value: "makaron" },
    suggestions: ["serowe", "tanie", "bez zakupów"]
  }
] satisfies RecipeCategory[];

export function getRecipeCategory(slug: string) {
  return recipeCategories.find((category) => category.slug === slug);
}

export function getRecipeCountLabel(count: number) {
  if (count === 1) return "1 przepis";
  if (count > 1 && count < 5) return `${count} przepisy`;
  return `${count} przepisów`;
}

export function getRecipeSearchText(recipe: CollectionEntry<"recipes">) {
  return [
    recipe.data.title,
    recipe.data.summary,
    recipe.data.description,
    recipe.data.effort,
    recipe.data.mood,
    recipe.data.cost,
    ...recipe.data.tags,
    ...recipe.data.categories,
    ...recipe.data.mainIngredients,
    ...recipe.data.searchAliases
  ].join(" ");
}

export function normalizeCategoryText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toCategorySlug(value: string) {
  return normalizeCategoryText(value).replace(/\s+/g, "-");
}

export function matchesCategoryFilter(recipe: CollectionEntry<"recipes">, filter: CategoryFilter) {
  if (filter.type === "all") return true;
  if (filter.type === "tag") {
    const normalizedValue = normalizeCategoryText(filter.value);
    const categorySlug = toCategorySlug(filter.value);

    return (
      recipe.data.tags.some((tag) => normalizeCategoryText(tag) === normalizedValue) ||
      recipe.data.categories.includes(categorySlug)
    );
  }

  return normalizeCategoryText(getRecipeSearchText(recipe)).includes(normalizeCategoryText(filter.value));
}

export function getCategoryRecipes(recipes: CollectionEntry<"recipes">[], category: RecipeCategory) {
  return recipes
    .filter((recipe) => matchesCategoryFilter(recipe, category.filter))
    .sort((a, b) => a.data.timeMinutes - b.data.timeMinutes);
}
