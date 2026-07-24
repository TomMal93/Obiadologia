import { parseRecipes } from '@/domain/recipe-schema';

// Katalog pozostaje świadomie pusty do czasu dostarczenia nowych treści.
// Zachowujemy walidację na granicy danych, aby kolejne rekordy od razu
// podlegały temu samemu kontraktowi co wyszukiwarka, Mapa i Kategorie.
export const prototypeRecipes = parseRecipes([]);
