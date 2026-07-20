# Konwencje kodu

> Status: obowiązujące dla MVP
> Aktualizacja: gdy zmienia się konwencja implementacyjna wspólna dla więcej niż jednego pliku

## Cel

Ten dokument jest jednym źródłem prawdy dla konwencji pisania kodu wspólnych dla całej aplikacji: gdzie mieszkają style, jak nazywamy klasy, jak importujemy moduły i kiedy hydratujemy komponenty. Zapobiega cichemu rozjeżdżaniu się kodu, gdy każde zadanie wprowadza własny styl.

Reguły zachowania, wyglądu, danych, decyzji technicznych i jakości mają własne źródła prawdy wskazane w [indeksie dokumentacji](../README.md). Ten dokument ich nie powtarza — tam, gdzie konwencja wynika z istniejącego kontraktu, odsyła do niego zamiast dodawać własne szczegóły.

## W zakresie

- organizacja i miejsce styli (CSS, tokeny, style lokalne komponentów);
- nazewnictwo klas i modyfikatorów;
- konwencje TypeScript i importów;
- dyscyplina hydratacji na granicy Astro/React;
- reguły struktury plików i współlokowania testów spinające istniejące źródła prawdy.

## Poza zakresem

- wartości tokenów wizualnych i prezentacja komponentów — [ui-system.md](../design/ui-system.md);
- decyzje architektoniczne (stos, granice, rendering) — [technical-decisions.md](./technical-decisions.md);
- bramki jakości, dostępność i wydajność — [quality-requirements.md](./quality-requirements.md);
- model danych i reguły dopasowania — [data-model.md](./data-model.md).

## Style i CSS

`src/styles/global.css` jest wspólnym arkuszem importowanym raz w [`BaseLayout.astro`](../../src/layouts/BaseLayout.astro).

- **Tokeny** (właściwości niestandardowe `--*`) MUSZĄ istnieć wyłącznie w `:root` w `global.css` i odzwierciedlać [ui-system.md](../design/ui-system.md). W komponentach kolory, odstępy, promienie, cienie i skala typografii MUSZĄ używać `var(--token)`; zaszyte wartości liczbowe i szesnastkowe kolory są niedozwolone poza definicją tokenu. Wyjątkiem są płynne `clamp()` do lokalnego dostrajania responsywnego (rozmiary ikon, kafli, płynne nagłówki) oraz nieliczne, jawnie udokumentowane wartości poza siatką — wartości semantyczne (kolory, siatka odstępów, skala typografii, promienie) zawsze przez token. Granicę opisuje [ui-system.md](../design/ui-system.md) „Geometria”/„Typografia”.
- `global.css` zawiera WYŁĄCZNIE: reset i style bazowe, definicje tokenów oraz klasy naprawdę współdzielone (używane w co najmniej dwóch miejscach, np. `.screen`, `.recipe-card`, `.eyebrow`).
- Style należące do jednego komponentu POWINNY mieszkać przy komponencie, a nie w `global.css`: wyciągamy je do **współlokowanego pliku `.css`** obok komponentu i importujemy go w tym komponencie (dla `.astro` w części frontmatter, dla wyspy React w module wyspy). Nie osadzamy styli w bloku `<style>` w pliku `.astro` ani nie dopisujemy jednorazowych, lokalnych reguł do arkusza globalnego. Przykłady: [`DiscoveryExperience.css`](../../src/components/DiscoveryExperience.css), [`recipe-page.css`](../../src/pages/recipes/recipe-page.css).
  - Konsekwencja: importowany plik `.css` NIE korzysta z auto-zakresowania Astro — jego reguły są globalne. Dlatego klasy komponentu MUSZĄ być jednoznaczne przez prefiks obszaru (np. `recipe-*`, `advance-*`, `assistant-*`) i konwencję `blok--modyfikator` z sekcji „Nazewnictwo klas”, aby nie kolidowały między komponentami.
  - Migracja istniejących komponentów z bloków `<style>` do plików `.css` jest stopniowa; stan wdrożenia śledzi tabela w [`AGENTS.md`](../../AGENTS.md). Nowe i dotykane komponenty stosują regułę pliku `.css` od razu.
- Atrybut `style=` inline jest niedozwolony dla wartości wyrażalnych klasą lub tokenem. MOŻE być użyty wyłącznie dla wartości naprawdę dynamicznych, liczonych w czasie działania (np. pozycja przeciąganego punktu mapy).
- Kolor nie może być jedynym nośnikiem znaczenia — reguła należy do [ui-system.md](../design/ui-system.md) i obowiązuje również w kodzie.

## Nazewnictwo klas

- Klasy CSS zapisujemy w `kebab-case`.
- Warianty bloku zapisujemy jako `blok--modyfikator` (np. `path-card--map`).
- Stany zapisujemy przedrostkiem `is-` lub `has-` i przełączamy z kodu (np. `category-option is-selected`), zamiast tworzyć osobne klasy bazowe dla każdego stanu.

## TypeScript i importy

- Projekt działa w trybie `strict` ([TD-015](./technical-decisions.md)); `any` jest niedozwolony. Dane wejściowe walidujemy na granicy systemu przez `zod` — zob. [quality-requirements.md](./quality-requirements.md#bezpieczeństwo-i-prywatność).
- Obowiązuje jeden model `Recipe`. Komponenty importują typy i reguły z `src/domain`, nie tworzą lokalnych kształtów danych ([TD-003](./technical-decisions.md)).
- Typy konkretnej biblioteki wyszukiwania nie przekraczają granicy `RecipeSearch` ([TD-013](./technical-decisions.md)).
- Importy modułów projektu używają aliasu `@/` (np. `@/domain/recipe`), a nie ścieżek względnych typu `../../`. Alias jest zdefiniowany w [`tsconfig.json`](../../tsconfig.json).

## Granica Astro/React

- Domyślnie tworzymy komponenty `.astro`. React obsługuje wyłącznie interaktywny obszar `DiscoveryExperience`; publiczne strony i pozostała treść pozostają statyczne bez hydratacji ([TD-015](./technical-decisions.md)).
- Wyspę hydratujemy najwęższą pasującą dyrektywą `client:*` (np. `client:visible`, `client:idle`). `client:load` stosujemy tylko wtedy, gdy interakcja musi być gotowa natychmiast po wczytaniu.

## Struktura plików i testy

- Jeden plik odpowiada za jedną odpowiedzialność zgodnie z „Mapą kodu" w [`AGENTS.md`](../../AGENTS.md); przenosząc odpowiedzialność między plikami, aktualizujemy tę tabelę.
- Testy współlokujemy z kodem jako `*.test.ts(x)`, a poziom testu dobieramy do zmiany: logika w Vitest, komponenty w React Testing Library, przepływy w Playwright ([TD-012](./technical-decisions.md), [quality-requirements.md](./quality-requirements.md#strategia-testów)).
- Dane zastępcze są jawnie oznaczone jako prototypowe, mieszkają w `src/data` i są zgodne z modelem `Recipe` ([quality-requirements.md](./quality-requirements.md#odporność-i-stany-danych)).

## Weryfikacja

- Przed uznaniem zmiany za ukończoną uruchamiamy `corepack pnpm verify`; lint działa z `--max-warnings=0`. Pełny opis bramek: [quality-requirements.md](./quality-requirements.md#polecenia-weryfikacyjne).
- Nie zostawiamy martwego ani odłożonego zakresu poza jawnie opisanymi elementami zastępczymi ([AGENTS.md](../../AGENTS.md), reguła 9).
