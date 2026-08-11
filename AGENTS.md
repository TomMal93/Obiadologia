# Obiadologia — instrukcja dla agentów

## Czytaj tylko to, czego wymaga zadanie

- orientacja i routing dokumentacji: `docs/README.md`
- cel produktu i zakres MVP: `docs/product/`
- strona główna: `docs/product/features/home-page.md`
- wspólny overlay Mapa/Wyszukiwarka: `docs/product/features/discovery-overlay.md`
- strona przepisu: `docs/product/features/recipe-page.md`
- szablon do przygotowania treści przepisu: `docs/content/recipe-template.md`
- wygląd i komponenty: `docs/design/ui-system.md`
- model danych: `docs/engineering/data-model.md`
- przyjęte i otwarte decyzje techniczne: `docs/engineering/technical-decisions.md`; zaakceptowane decyzje kosztowne do odwrócenia: `docs/engineering/adr/`
- testy, dostępność i wydajność: `docs/engineering/quality-requirements.md`
- konwencje kodu (miejsce styli, nazewnictwo, importy, hydratacja): `docs/engineering/code-conventions.md`

Nie wczytuj całego katalogu `docs/`, jeśli zadanie dotyczy jednego obszaru.

## Mapa kodu

Dokumentacja opisuje docelowe kontrakty, a nie stan implementacji. Zanim zaczniesz kodować, sprawdź tutaj, gdzie mieszka dana odpowiedzialność i co już istnieje, zamiast przeszukiwać całe `src/`. Źródłem prawdy dla szczegółów faktycznie zaimplementowanych pozostają kod i testy.

| Obszar | Ścieżka |
|---|---|
| typy modelu `Recipe` i reguły Kategorii (bez zod, bezpieczne dla paczki klienckiej) | `src/domain/recipe.ts` |
| schematy `zod` i walidacja `parseRecipes` (wyłącznie etap builda) | `src/domain/recipe-schema.ts` |
| schemat `Ingredient` i jego walidacja buildowa | `src/domain/ingredient.ts` |
| kontrolowany podział składników na grupy zakupowe | `src/domain/ingredient-category.ts` |
| kliencki model ilości składnika, formatowanie i przeliczanie miar | `src/domain/ingredient-measure.ts` |
| kontrakt i lokalny adapter `RecipeSearch`, normalizacja oraz ranking Mapy | `src/domain/recipe-search.ts` |
| definicja kolekcji `recipes` (loader `glob` + schemat `recipeSchema`, walidacja buildowa) | `src/content.config.ts` |
| pliki katalogu przepisów zgodnych z `Recipe` — jeden plik JSON na przepis | `src/content/recipes/*.json` |
| kanoniczny dostęp do katalogu dla stron Astro (`getRecipes` / `getPublishedRecipes`) | `src/data/recipes.ts` |
| syntetyczne przepisy używane wyłącznie w testach jednostkowych i komponentowych | `src/test/fixtures/recipes.ts` |
| aktywne locale i metadane języków | `src/i18n/config.ts` |
| typowany dostęp do słowników UI | `src/i18n/messages.ts` |
| polskie treści interfejsu | `src/i18n/locales/pl.ts` |
| interpolacja i odmiana komunikatów UI | `src/i18n/format.ts` |
| wyspa interaktywna (wybór ścieżki, Kategorie, wyniki) | `src/components/DiscoveryExperience.tsx` |
| style współlokowane wyspy interaktywnej | `src/components/DiscoveryExperience.css` |
| wspólny nagłówek z logo/brandem | `src/components/SiteHeader.astro` |
| style współlokowane nagłówka | `src/components/SiteHeader.css` |
| strona główna i osadzenie wyspy | `src/pages/index.astro` |
| style współlokowane strony głównej | `src/pages/home-page.css` |
| ekran zastępczy szczegółowego wyszukiwania Kategorii `/categories` | `src/pages/categories.astro` |
| style współlokowane ekranu zastępczego Kategorii | `src/pages/categories-page.css` |
| strona przepisu `/recipes/:slug` | `src/pages/recipes/[slug].astro` |
| style współlokowane strony przepisu | `src/pages/recipes/recipe-page.css` |
| wspólny layout, `<head>` i kontener mobilny | `src/layouts/BaseLayout.astro` |
| style współlokowane powłoki layoutu | `src/layouts/BaseLayout.css` |
| tokeny, reset i klasy współdzielone | `src/styles/global.css` |
| testy jednostkowe i komponentów | `src/**/*.test.ts(x)` |
| testy E2E i kontrola `axe-core` | `tests/e2e/` |

## Stan implementacji

Status „wersja wstępna” oznacza pierwszą wersję (init) spełniającą kontrakt w minimalnym zakresie — istnieje i można na niej bazować, ale nie jest to jeszcze docelowy kształt.

| Obszar | Stan | Uwagi |
|---|---|---|
| Model `Recipe` i katalog danych | wersja wstępna | jedna reprezentacja z walidacją (`zod` w `src/domain/recipe-schema.ts`, uruchamianą na etapie builda) współdzielona przez ścieżki; `ingredients` to obiekty `Ingredient` z grammaturą (`src/domain/ingredient.ts`); katalog przechowywany w Astro Content Collections — jeden plik JSON na przepis w `src/content/recipes/`, dostęp przez `src/data/recipes.ts`; walidacja i prerendering pozostają w całości buildowe |
| Przygotowanie treści UI pod lokalizację | wersja wstępna | komponenty i strony pobierają teksty interfejsu z typowanego słownika; aktywny jest wyłącznie polski, bez wielojęzycznego routingu i bez lokalizacji danych przepisów oraz wyszukiwania |
| Nagłówek (logo/brand + menu) | wersja wstępna | statyczny `<header>` z brandem poza wyspą React; ikona menu (hamburger) otwiera mobilne menu nawigacyjne (Strona główna, Kategorie, Szukaj, Mapa) obsługiwane skryptem współlokowanym w `SiteHeader.astro`; Szukaj/Mapa otwierają wspólny overlay (na stronie głównej wprost, z innych stron przez kotwicę `/#szukaj`/`/#mapa`) |
| Hero (komunikat główny) | wersja wstępna | statyczna sekcja Astro z tłem znaków wodnych i `<h1>` „Co dziś jemy?” zgodnie z makietą `home-hero.png` |
| Kategorie | wersja wstępna | wybór, filtr AND, wyniki i ich ukrywanie zgodnie ze specyfikacją |
| Szczegółowe wyszukiwanie Kategorii | ekran zastępczy | przycisk w panelu prowadzi do statycznej informacji o funkcji w przygotowaniu; filtry pozostają poza MVP |
| Wybór ścieżki (3 karty) | wersja wstępna | pełna kompozycja z makiety; Kategorie prowadzą do sekcji, a Mapa i Szukaj otwierają odpowiedni tryb wspólnego overlaya |
| Discovery overlay (Wyszukiwarka i Mapa) | wersja wstępna | wspólna powłoka, lokalna sesja historii, wyszukiwanie z sugestiami, interaktywna Mapa oraz wspólne karty wyników; dane pozostają prototypowe |
| Strona przepisu `/recipes/:slug` | wersja wstępna | implementacja prezentuje pola modelu `Recipe` (zdjęcie/placeholder, opis, trudność, czas, porcje, tagi, składniki z mieszaną formą miary: metryczną, domową albo obiema po ukośniku, zgodnie z polem `measure` składnika — bez przełącznika jednostek); zmiana liczby porcji skaluje ilości; opcjonalny, klikalny panel „Zanim zaczniesz” grupuje przygotowania możliwe dzień wcześniej oraz wykonywane tuż przed gotowaniem lub w trakcie, a nieodhaczone czynności wstawia jako półkroki przed wskazane kroki asystenta; panel współpracuje z przełącznikiem „Tryb asystenta / Tylko kroki” jako wzbogacenie progresywne; `stepsOnly` pozostaje samodzielną wersją dla trybu bez panelu; opcjonalne `tips` tworzy panel „Coś jeszcze”; opublikowane rekordy otrzymują prerenderowane trasy |

Aktualizuj obie tabele, gdy przenosisz odpowiedzialność między plikami albo zmieniasz stan ścieżki. Nie prowadź tu dziennika prac.

## Reguły pracy

1. Każdy kontrakt ma jedno normatywne źródło zgodne z tabelą „Źródła prawdy” w `docs/README.md`: specyfikacja funkcji definiuje zachowanie, `data-model.md` dane i dopasowanie, `ui-system.md` wspólne reguły wizualne, `quality-requirements.md` wymagania przekrojowe, a rejestr decyzji i ADR-y decyzje techniczne oraz ich uzasadnienie.
2. W innym dokumencie można umieścić krótkie streszczenie albo kryterium weryfikacji, ale MUSI ono odsyłać do normatywnego źródła i nie może dodawać własnych szczegółów kontraktu. W razie różnicy obowiązuje źródło wskazane w `docs/README.md`.
3. Zachowaj jeden model `Recipe` dla Kategorii, Wyszukiwarki i Mapy.
4. Nie dodawaj domyślnych wyborów w trybie Kategorii. Stan z wybranymi wartościami na makiecie przedstawia przykład po interakcji. Mapa rozpoczyna w punkcie środkowym.
5. Każdą istotną zmianę zachowania uzupełnij w odpowiedniej specyfikacji i kryteriach akceptacji.
6. Nie podejmuj po cichu kosztownych decyzji technicznych. Zapisz je jako otwarte albo dodaj ADR po uzgodnieniu.
7. Po implementacji uruchom testy wskazane w projekcie. Dopóki nie powstanie kod aplikacji i rzeczywiste skrypty projektu, brak poleceń jest jawnym stanem etapu, a nie zgodą na pominięcie weryfikacji po ich dodaniu.
8. W bieżącym etapie twórz wyłącznie jeden układ mobilny. Nie projektuj osobnych układów tabletowych ani desktopowych.
9. Nie implementuj zakresu odłożonego na później. Jeżeli jest potrzebny do zachowania przepływu, użyj jawnie opisanego ekranu lub danych zastępczych.

Dokument bliżej zmienianego kodu może opisywać lokalny szczegół implementacji, ale nie może redefiniować kontraktu należącego do innego źródła prawdy.
