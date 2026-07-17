# Raport zgodności kodu z dokumentacją

> Zakres: cały `src/` względem `docs/` (specyfikacje, `ui-system.md`, `data-model.md`,
> `code-conventions.md`, `quality-requirements.md`, rejestr decyzji) oraz makiet
> `home-hero.png` i `home-browse-mode.png`.
> Charakter: audyt jednorazowy (nie jest dokumentem-źródłem prawdy ani dziennikiem prac).

> **Aktualizacja (decyzja właściciela):** przyjęto docelowo trzy niezależne warstwy koloru:
> (a) **kolory przewodnie dróg** — Mapa = niebieski, Szukaj = koral, Kategorie = zielony
> (`--color-map` / `--color-search` / `--color-categories` + `-strong`/`-soft`); (b) **akcenty
> grup Kategorii** — pora dnia = żółty, tempo = zielony, okazja = koral
> (`--color-daypart` / `--color-tempo` / `--color-occasion` + `-soft`), użyte w wyborze w drugiej
> sekcji zgodnie z makietą; (c) **rozdzielone role tekstu** — `--color-heading-accent` (nagłówki)
> osobno od `--color-cta` (akcje). Rozwiązuje to punkty **#1** i **#3**, a zaszyte heksy wróciły do
> definicji tokenów. Szczegóły w `docs/design/ui-system.md` › „Kolory przewodnie dróg” i „Akcenty
> grup Kategorii”.

## Ocena ogólna

Kod jest **wiernie zgodny z warstwą zaimplementowaną i uczciwie opisuje dług**. Model
`Recipe` (jedno źródło, walidacja `zod`), filtr Kategorii, stany wyników i pełnoekranowy
hero odpowiadają kontraktom i makiecie `home-hero.png`. Tabele „Stan implementacji" i „Mapa
kodu" w `AGENTS.md` trafnie oddają, co istnieje.

Do poprawy zostają trzy klasy rzeczy: **(1) systemowe naruszenia konwencji o tokenach**,
**(2) rozjazd kolorystyki Kategorii z `ui-system.md` i makietą**, oraz **(3) niezrealizowany,
choć udokumentowany, zakres discovery overlayu**. Poniżej priorytetowo.

---

## P1 — Rozbieżności kontraktu / konwencji (realne, do naprawy)

### 1. Kolory grup Kategorii niezgodne z `ui-system.md` i makietą
- **Kontrakt:** `ui-system.md` definiuje tokeny semantyczne `--color-yellow` = „pora dnia",
  `--color-tempo` = „tempo", `--color-occasion` = „okazja". Makieta `home-browse-mode.png`
  pokazuje wybraną opcję w kolorze **jej grupy**: Obiad → żółty, Na już → zielony,
  Na grilla → koralowy.
- **Kod:** `DiscoveryExperience.css` `.category-option.is-selected` renderuje **każdą**
  wybraną opcję na zielono (`--color-green` + zaszyty `#0b7133`), niezależnie od grupy.
- **Skutek:** tokeny `--color-yellow`, `--color-tempo`, `--color-occasion` są zdefiniowane
  w `global.css`, ale **nigdzie nieużywane** (martwe tokeny), a widok nie zachowuje
  kolorystyki makiety wymaganej w weryfikacji `ui-system.md` („charakter, hierarchia i kolory").
- **Poprawka:** kolor stanu wybranego zależny od grupy (żółty/tempo/okazja), np. przez
  `--group-accent` ustawiany na `fieldset` i użycie go w `.is-selected`.

### 2. Brak tokenów promieni, skali odstępów i typografii (naruszenie `code-conventions.md`)
- **Kontrakt:** `code-conventions.md` › „Style i CSS": „kolory, odstępy, promienie, cienie
  i skala typografii **MUSZĄ** używać `var(--token)`; zaszyte wartości liczbowe i szesnastkowe
  kolory są niedozwolone poza definicją tokenu". `ui-system.md` podaje skale (promienie
  12/20/28; odstępy 4…64; typografia 14…64).
- **Kod:** w `:root` istnieją tylko kolory, `--brand-gradient`, jeden `--shadow-surface`
  i cztery tokeny płynne (`--gutter`, `--screen-pad-y`, `--stack-gap`, `--header-block`).
  Promienie, skala odstępów i skala typografii **nie mają tokenów** — komponenty niosą
  dziesiątki zaszytych wartości (`gap: 8px`, `padding: 16px`, `font-size: 20/24/32px`,
  `border-radius: 12/20/28px` itd.).
- **Skutek:** systemowe, powtarzalne odstępstwo od konwencji; ryzyko cichego rozjazdu wartości.
- **Poprawka:** dodać tokeny `--radius-*`, `--space-*`, `--font-size-*` w `:root` i przełączyć
  komponenty na `var(--token)`. Warto zrobić to jednym przejściem, żeby nie utrwalać wzorca.

### 3. Zaszyte kolory heksadecymalne w komponentach (i duplikacja)
- **Kontrakt:** jak wyżej — heks tylko w definicji tokenu.
- **Kod:**
  - `index.astro:347` `--col-strong: #a82d18` (ciemny koral),
  - `index.astro:353` `--col-strong: #0b7133` (ciemna zieleń),
  - `DiscoveryExperience.css:79` `color: #0b7133` — **ten sam `#0b7133` w dwóch plikach**.
- **Skutek:** ten sam „wzmocniony" kolor kontrastowy żyje w dwóch miejscach bez wspólnego
  źródła — dokładnie sytuacja, której konwencja zakazuje.
- **Poprawka:** tokeny np. `--color-green-strong`, `--color-coral-strong` i użycie ich w obu
  miejscach.

### 4. Tło poza paletą tokenów
- **Kod:** `global.css` ustawia `background: #f3eee8` w `:root` **i** w `body` — inny kremowy
  niż `--color-bg` (`#fdf8f2`) i spoza tabeli kolorów `ui-system.md`.
- **Poprawka:** użyć istniejącego tokenu tła albo dodać token na tło poza kontenerem;
  nie zostawiać zaszytego heksa.

### 5. Promienie poza skalą `ui-system.md`
- **Kontrakt:** skala promieni 12 (tagi/pola) / 20 (karty) / 28 (duże panele).
- **Kod:** `.recipe-card` `border-radius: 14px` (powinno 20 — to karta), `.brand-mark` 14px,
  `.path-note` 16px — obie wartości spoza skali.
- **Poprawka:** dopasować do skali (karta → 20) lub świadomie rozszerzyć skalę w `ui-system.md`,
  jeśli 14/16 są celowe.

---

## P2 — Luki wobec zakresu / makiety (częściowo udokumentowane)

### 6. Discovery overlay (Wyszukiwarka + Mapa) niezaimplementowany
- **Stan:** kafle „Mapa" i „Szukaj" to jawne, nieinteraktywne placeholdery z etykietą
  „Wkrótce". Jest to **uczciwie opisane** w `AGENTS.md` (Discovery overlay: „niezaimplementowane",
  Wybór ścieżki: „częściowo"), więc to **znany dług, nie ukryta rozbieżność**.
- **Niespełnione kontrakty:** kryteria akceptacji `home-page.md` („Mapa i Szukaj otwierają
  właściwy tryb wspólnego overlaya"), cały `discovery-overlay.md`, granica `RecipeSearch`
  (`TD-013`), reguły dopasowania Szukaj/Mapa w `data-model.md`, oraz testy z
  `quality-requirements.md` › „Strategia testów" (komponenty dialogu/przełącznika, E2E historii,
  fokus, `Escape`, „Wstecz"). To **główny pozostały zakres MVP**.

### 7. Brak ikon Kategorii z makiety
- Makieta `home-browse-mode.png` ma ikony w nagłówkach grup (słońce/zegar/konfetti) i przy
  opcjach. Kod używa tylko `○`/`✓` + etykiety. Dostępność jest spełniona bez nich (obramowanie,
  pogrubienie, `✓`, `aria-pressed`), ale „charakter i hierarchia makiety" (weryfikacja
  `ui-system.md`) jest słabsza. Do rozważenia wraz z punktem 1.

---

## P3 — Spójność dokumentacji i drobne

### 8. Nagłówek wyników: „Propozycje" vs „Propozycje dla Ciebie"
- `discovery-overlay.md` normatywnie: sekcja wyników używa nagłówka **„Propozycje"**.
- Makieta strony głównej i kod: **„Propozycje dla Ciebie"**.
- Ponieważ wyniki mają być **wspólnym komponentem** (jeden model `Recipe`, jedna karta),
  oba konteksty użyją różnych nagłówków. Do ujednolicenia w specyfikacji (jedna nazwa
  albo jawne rozróżnienie Kategorie vs overlay).

### 9. „Jedna sekcja = jeden ekran" a makieta `home-hero.png`
- `home-page.md` wymienia komunikat „Co dziś jemy?" i kartę wyboru dróg jako osobne bloki
  „prezentowane jako sekcje pełnoekranowe".
- Makieta `home-hero.png` i kod (`.intro-screen`) łączą nagłówek + hero + kartę dróg
  w **jeden** ekran.
- Kod idzie za makietą; `AGENTS.md` częściowo to odnotowuje. **Do doprecyzowania w
  `home-page.md`**, że pierwszy ekran obejmuje nagłówek + hero + kartę dróg — inaczej litera
  specyfikacji i implementacja się rozjeżdżają.

### 10. Etykieta „Wkrótce" — świadome odstępstwo od makiety
- Makieta nie pokazuje badge'y „Wkrótce"; kod dodaje je na kaflach Mapa/Szukaj jako jawny
  placeholder (reguła 9 `AGENTS.md`). Odstępstwo jest **celowe i udokumentowane** — tylko
  do odnotowania, bez akcji.

### 11. Weryfikacja bramek — nie potwierdzona w tym audycie
- Nie uruchomiono `corepack pnpm verify` (środowisko audytu: brak `node_modules`, Node v22
  wobec wymaganego ≥24 w `package.json`). Skrypty (`lint`, `typecheck` = `astro check`,
  `test`, `test:e2e`, `build`) istnieją i są zgodne z `quality-requirements.md`. Zieloność
  bramek należy potwierdzić w środowisku docelowym — nie jest częścią ustaleń tego raportu.

---

## Tabela zbiorcza

| # | Obszar | Źródło prawdy | Priorytet | Akcja |
|---|---|---|---|---|
| 1 | Kolory dróg (przewodnie) — Mapa/Szukaj/Kategorie | `ui-system.md`, makieta | P1 | ✅ zrobione: tokeny `--color-map/search/categories` |
| 2 | Brak tokenów promieni/odstępów/typografii | `code-conventions.md` | P1 | dodać tokeny, przełączyć komponenty na `var()` |
| 3 | Zaszyte heksy `#0b7133`/`#a82d18` (duplikacja) | `code-conventions.md` | P1 | ✅ zrobione: tokeny `--color-*-strong` |
| 4 | Tło `#f3eee8` spoza palety | `code-conventions.md`, `ui-system.md` | P1 | użyć/utworzyć token tła |
| 5 | Promienie 14/16px poza skalą | `ui-system.md` | P1 | karta → 20; reszta do skali |
| 6 | Discovery overlay niezaimplementowany | `discovery-overlay.md`, `mvp-scope.md` | P2 | zaimplementować (główny zakres) |
| 7 | Brak ikon Kategorii | makieta, `ui-system.md` | P2 | dodać ikony grup/opcji |
| 8 | „Propozycje" vs „Propozycje dla Ciebie" | `discovery-overlay.md` | P3 | ujednolicić w specyfikacji |
| 9 | Sekcje pełnoekranowe vs makieta hero | `home-page.md` | P3 | doprecyzować `home-page.md` |
| 10 | Badge „Wkrótce" | `AGENTS.md` reguła 9 | — | świadome, bez akcji |
| 11 | Weryfikacja bramek | `quality-requirements.md` | — | potwierdzić w środowisku docelowym |

## Rekomendowana kolejność

1. **P1 jako jeden przebieg „tokenizacja + kolory Kategorii"** (punkty 1–5) — czysto wizualne
   i konwencyjne, tanie, usuwa martwe tokeny i duplikaty, domyka zgodność z makietą przeglądania.
2. **P2 discovery overlay** (punkt 6, potem 7) — właściwy zakres MVP: powłoka, przełącznik,
   granica `RecipeSearch`, tryby Szukaj i Mapa, testy komponentów i E2E historii.
3. **P3 doprecyzowania dokumentacji** (8–9) — zamknąć rozjazdy litery specyfikacji, żeby
   kolejne zadania nie odziedziczyły niejasności.
