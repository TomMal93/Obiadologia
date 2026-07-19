# Raport z analizy kodu projektu Obiadologia

Data analizy: 2026-07-19 · Stan repozytorium: `main` @ `9e8f362` (po merge PR #12)

## 1. Podsumowanie

Kod projektu jest w bardzo dobrym stanie jak na etap prototypu MVP. Architektura jest czysta
(wydzielona warstwa domenowa z czystymi funkcjami, jedna wyspa React, reszta statyczna),
typowanie ścisłe, dane walidowane przez `zod`, a dostępność potraktowana ponadprzeciętnie
poważnie (pułapka fokusu, komunikaty `aria-live`, kontrola `axe-core` w testach E2E,
progresywne wzbogacanie strony przepisu). Cała weryfikacja przechodzi: lint, typecheck,
20 testów jednostkowych, 6 testów E2E i build.

Nie znaleziono błędów krytycznych ani problemów bezpieczeństwa. Zidentyfikowane uwagi to
drobne usterki (niepoprawna polska odmiana w komunikacie czytnika ekranu przy 0 wyników,
niezabezpieczony zapis do `sessionStorage`), kruche miejsca (hack rankingu w słowniku
kategorii) oraz kwestie optymalizacyjne (`zod` w bundlu klienta) i środowiskowe
(niezgodność wersji Node i przeglądarki Playwright ze środowiskiem uruchomieniowym).

## 2. Zakres i metoda

Przeanalizowano cały kod źródłowy (`src/`, `tests/`, `scripts/`, konfiguracje) — łącznie
ok. 2160 linii — oraz uruchomiono pełną weryfikację projektu (`lint`, `typecheck`, `test`,
`test:e2e`, `build`). Dokumentacja w `docs/` była wcześniej audytowana osobno
(`raport-audytu-dokumentacji.md`); ten raport dotyczy kodu.

## 3. Wyniki weryfikacji

| Krok | Wynik | Uwagi |
|---|---|---|
| `pnpm lint` (ESLint, `--max-warnings=0`) | ✅ | bez ostrzeżeń |
| `pnpm typecheck` (`astro check`) | ✅ | 25 plików, 0 błędów, 0 ostrzeżeń |
| `pnpm test` (Vitest) | ✅ | 20/20 testów w 4 plikach |
| `pnpm test:e2e` (Playwright + axe-core) | ✅ | 6/6 testów, po obejściu środowiskowym (pkt 6.3) |
| `pnpm build` (Astro, output `static`) | ✅ | 6 stron statycznych |

## 4. Architektura — ocena

Struktura odpowiada mapie kodu z `AGENTS.md` i jest konsekwentna:

- **Warstwa domenowa** (`src/domain/`) — czyste funkcje bez zależności od UI:
  model `Recipe` z walidacją `zod` i regułami Kategorii (`recipe.ts`), model `Ingredient`
  z przeliczaniem miar metrycznych na domowe wraz z poprawną polską odmianą liczebników
  (`ingredient.ts`), kontrakt `RecipeSearch` z adapterem na `fuse.js`, normalizacją
  polskich znaków i rankingiem Mapy (`recipe-search.ts`).
- **Jedna wyspa interaktywna** (`DiscoveryExperience.tsx`, hydratacja `client:load`) —
  reszta stron jest w pełni statyczna. Strona przepisu używa progresywnego wzbogacania:
  bez JS działa lista w jednostkach metrycznych, skrypt jedynie odsłania przełącznik miar.
- **Jeden model `Recipe`** współdzielony przez Kategorie, Wyszukiwarkę i Mapę — zgodnie
  z regułą nr 3 z `AGENTS.md`.
- **Dane prototypowe** walidowane w miejscu definicji przez `parseRecipes`, które dodatkowo
  wymusza unikalność `id` i `slug`.

Warta odnotowania jest obsługa sesji overlaya przez `history.pushState`/`popstate`
z rejestrem zakończonych sesji w `sessionStorage` — dzięki temu przyciski Wstecz/Dalej
przeglądarki oraz powrót ze strony przepisu poprawnie przywracają lub resetują stan
(zachowanie pokryte testami E2E).

## 5. Mocne strony

1. **Ścisłe typowanie i walidacja** — `tsconfig` na bazie `astro/tsconfigs/strict`,
   schematy `zod` z `.strict()`, typy pochodne (`z.infer`), `as const satisfies` dla
   konfiguracji grup kategorii, wyczerpujące `switch` po unii jednostek.
2. **Dostępność** — pułapka fokusu i przywracanie fokusu w overlayu, komunikaty liczby
   wyników przez `aria-live` z debounce 250 ms, `aria-pressed` na przełącznikach,
   etykiety `visually-hidden`, obsługa `prefers-reduced-motion`, sterowanie Mapą
   z klawiatury (strzałki), automatyczna kontrola `axe-core` na obu stronach w E2E.
3. **Jakość testów** — piramida jest kompletna: testy jednostkowe domeny (w tym polska
   odmiana miar i normalizacja diakrytyków), testy komponentu z Testing Library
   (stan początkowy, filtr AND, zachowanie sesji overlaya) i testy E2E scenariuszy
   przeglądarkowych (historia, wskaźnik, powroty). Test `astro-island[ssr]` pilnuje,
   by hydratacja faktycznie się zakończyła przed interakcją.
4. **Higiena stylów** — tokeny projektowe w `global.css` z odsyłaczami do
   `docs/design/ui-system.md`, style komponentowe współlokowane, brak duplikacji reguł.
5. **Komentarze wyjaśniające „dlaczego"** — np. uzasadnienie progów miar domowych,
   reguły reflow WCAG, powodu ukrycia przełącznika miar bez JS.

## 6. Znalezione problemy

### 6.1. Drobne błędy (warte poprawy)

- **Niepoprawna odmiana przy 0 wyników w komunikacie czytnika ekranu** —
  `src/components/DiscoveryExperience.tsx:308`: dla `resultCount === 0` komunikat brzmi
  „Znaleziono 0 propozycje." zamiast „…0 propozycji.". Liczba wyników jest ścięta do 4,
  więc formy „propozycje" (2–4) i „propozycję" (1) są poprawne, ale zero wymaga dopełniacza.
  Ironia: warstwa domenowa ma wzorcową funkcję `pluralForm` w `ingredient.ts:78`, której
  ten komunikat nie używa.
- **Zapis do `sessionStorage` bez zabezpieczenia** —
  `src/components/DiscoveryExperience.tsx:131`: `getEndedSessions` owija odczyt w
  `try/catch`, ale `markSessionEnded` wywołuje `setItem` bez ochrony. W trybach
  prywatnych/przy wyłączonym storage wyjątek poleci z handlera zamknięcia overlaya
  (`requestClose`) i zamknięcie może się nie wykonać do końca.
- **Fokus po przywróceniu sesji z historii** — `DiscoveryExperience.tsx:213`:
  po powrocie na stronę (remount wyspy) `openerRef.current` jest `null`, więc po
  zamknięciu przywróconego overlaya fokus nie wraca na element otwierający. Degradacja
  jest łagodna (fokus zostaje na `body`), ale odbiega od zachowania w podstawowym
  scenariuszu, które pilnowane jest testem E2E.

### 6.2. Kruche miejsca i dług techniczny

- **Hack w słowniku terminów kategorii** — `src/domain/recipe-search.ts:23`:
  `grill: 'na grilla grill'` duplikuje słowo, żeby jednocześnie zasilić wyszukiwarkę
  frazą i sugestię pierwszym wyrazem (`split(' ')[0]` w `suggest`). Działa, ale to
  niejawna zależność między formatem słownika a dwoma konsumentami — łatwo zepsuć przy
  edycji. Warto rozdzielić „frazę do indeksu" i „etykietę sugestii" na osobne pola.
- **Pułapka fokusu z ograniczonym selektorem** — `DiscoveryExperience.tsx:320`:
  selektor obejmuje tylko `button`, `input` i `a[href]`. Dla obecnej zawartości overlaya
  to wystarcza, ale dodanie `select`, `textarea` czy elementu z `tabindex` po cichu
  wybije fokus z pułapki.
- **`<dialog open>` z ręczną pułapką zamiast `showModal()`** — świadomy kompromis
  (overlay żyje wewnątrz wyspy i współpracuje z historią), ale natywne `showModal()`
  dawałoby pułapkę fokusu i `Escape` za darmo. Jeśli to decyzja projektowa, warto ją
  odnotować w `docs/engineering/technical-decisions.md`.
- **Ranking neutralnego środka Mapy** — `recipe-search.ts:107-119`: `selected.includes()`
  w pętli daje złożoność O(n²). Przy 5 przepisach prototypu bez znaczenia; przy realnym
  katalogu (setki pozycji) do wymiany na `Set`.

### 6.3. Kwestie środowiskowe i CI

- **Niezgodność wersji Node** — `package.json` wymaga Node `>=24 <25`, a testowane
  środowisko miało Node 22.22 (pnpm zgłasza tylko ostrzeżenie). Cała weryfikacja mimo to
  przechodzi. Jeśli wymóg Node 24 jest twardy, warto dodać `engine-strict` albo
  dopasować `.node-version` do środowisk CI; jeśli nie — poluzować `engines`.
- **Przeglądarka Playwright w środowisku zdalnym** — przypięty `@playwright/test` 1.61.1
  oczekuje Chromium rev. 1228, a środowisko wykonawcze ma preinstalowane rev. 1194.
  Testy E2E udało się uruchomić dopiero po podlinkowaniu istniejącej przeglądarki pod
  oczekiwaną ścieżką. W lokalnym developmencie problem nie wystąpi (po
  `playwright install`), ale w środowiskach współdzielonych warto rozważyć hook
  instalacyjny lub `executablePath` sterowany zmienną środowiskową.
- **Stały port serwera testowego** — `scripts/run-e2e.mjs` i `playwright.config.ts`
  zakładają wolny port 4321; równolegle działający `astro dev` sprawi, że health-check
  trafi w cudzy serwer. Drobiazg, ale łatwy do utwardzenia (konfigurowalny port).

### 6.4. Optymalizacja (nice-to-have)

- **`zod` w bundlu klienta** — wyspa importuje `filterRecipesByCategories`
  z `src/domain/recipe.ts`, który na poziomie modułu definiuje schematy `zod`; w efekcie
  walidator trafia do bundla przeglądarki (`DiscoveryExperience.*.js` ≈ 96 KB raw),
  choć walidacja danych odbywa się wyłącznie podczas builda. Rozdzielenie modułu na
  „typy + czyste funkcje filtrów" i „schematy + parsowanie" odchudziłoby bundle bez
  zmiany zachowania.

## 7. Metryki

| Metryka | Wartość |
|---|---|
| Kod źródłowy (`src/` + `tests/` + `scripts/`) | ~2160 linii |
| Największe pliki | `DiscoveryExperience.tsx` (498), `DiscoveryExperience.css` (480) |
| Testy | 20 jednostkowych/komponentowych + 6 E2E |
| Strony statyczne po buildzie | 6 (strona główna + 5 przepisów) |
| Bundle klienta (raw) | React runtime ~184 KB, wyspa ~96 KB |
| Zależności produkcyjne | 6 (astro, @astrojs/react, react, react-dom, fuse.js, zod) |

## 8. Rekomendacje — priorytety

1. Poprawić odmianę „0 propozycji" w komunikacie `aria-live` (jednolinijkowa zmiana,
   najlepiej z użyciem istniejącego wzorca `pluralForm`).
2. Objąć `setItem` w `markSessionEnded` blokiem `try/catch`.
3. Rozdzielić frazę indeksu i etykietę sugestii w `categoryTerms`.
4. Zdecydować o polityce wersji Node (twardy wymóg vs. poluzowanie `engines`).
5. (Opcjonalnie) wydzielić schematy `zod` z modułu importowanego przez wyspę,
   aby odchudzić bundle klienta.

Żaden z punktów nie blokuje dalszego rozwoju — projekt stanowi solidną bazę do
kolejnych etapów MVP.
