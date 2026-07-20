# Obiadologia — instrukcja dla agentów

## Czytaj tylko to, czego wymaga zadanie

- orientacja i routing dokumentacji: `docs/README.md`
- cel produktu i zakres MVP: `docs/product/`
- strona główna: `docs/product/features/home-page.md`
- wspólny overlay Mapa/Wyszukiwarka: `docs/product/features/discovery-overlay.md`
- strona przepisu: `docs/product/features/recipe-page.md`
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
| model domenowy `Recipe`, walidacja i reguły Kategorii | `src/domain/recipe.ts` |
| model `Ingredient`, grammatura i przeliczanie miar (metryczne ↔ domowe) | `src/domain/ingredient.ts` |
| logika czasu etapów „Wcześniej” (formatowanie wyprzedzenia, godziny startu) | `src/domain/recipe-schedule.ts` |
| kontrakt i lokalny adapter `RecipeSearch`, normalizacja oraz ranking Mapy | `src/domain/recipe-search.ts` |
| dane prototypowe zgodne z `Recipe` | `src/data/prototype-recipes.ts` |
| wyspa interaktywna (wybór ścieżki, Kategorie, wyniki) | `src/components/DiscoveryExperience.tsx` |
| style współlokowane wyspy interaktywnej | `src/components/DiscoveryExperience.css` |
| wspólny nagłówek z logo/brandem | `src/components/SiteHeader.astro` |
| style współlokowane nagłówka | `src/components/SiteHeader.css` |
| strona główna i osadzenie wyspy | `src/pages/index.astro` |
| style współlokowane strony głównej | `src/pages/home-page.css` |
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
| Model `Recipe` i dane prototypowe | wersja wstępna | jedna reprezentacja z walidacją (`zod`) współdzielona przez ścieżki; `ingredients` to obiekty `Ingredient` z grammaturą (`src/domain/ingredient.ts`) |
| Nagłówek (logo/brand) | wersja wstępna | statyczny `<header>` z brandem poza wyspą React; ikona menu jeszcze nie renderowana |
| Hero (komunikat główny) | wersja wstępna | statyczna sekcja Astro z tłem znaków wodnych i `<h1>` „Co dziś jemy?” zgodnie z makietą `home-hero.png` |
| Kategorie | wersja wstępna | wybór, filtr AND, wyniki i ich ukrywanie zgodnie ze specyfikacją |
| Wybór ścieżki (3 karty) | wersja wstępna | pełna kompozycja z makiety; Kategorie prowadzą do sekcji, a Mapa i Szukaj otwierają odpowiedni tryb wspólnego overlaya |
| Discovery overlay (Wyszukiwarka i Mapa) | wersja wstępna | wspólna powłoka, lokalna sesja historii, wyszukiwanie z sugestiami, interaktywna Mapa oraz wspólne karty wyników; dane pozostają prototypowe |
| Strona przepisu `/recipes/:slug` | wersja wstępna | prerenderowana prezentacja pól modelu `Recipe` (zdjęcie/placeholder, opis, czas, tagi, składniki z grammaturą i przełącznikiem miar metryczne/domowe); opcjonalne etapy „Wcześniej” (z pomocnikiem startu) i „Przygotowanie” z przełącznikiem „Tryb asystenta / Tylko kroki”, oba jako wzbogacenie progresywne |

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
