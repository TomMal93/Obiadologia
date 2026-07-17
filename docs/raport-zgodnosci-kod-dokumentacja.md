# Raport zgodności kodu z dokumentacją

> Zakres: cały `src/` względem `docs/` (specyfikacje, `ui-system.md`, `data-model.md`,
> `code-conventions.md`, `quality-requirements.md`, rejestr decyzji) oraz makiet
> `home-hero.png` i `home-browse-mode.png`.
> Charakter: audyt jednorazowy (nie jest dokumentem-źródłem prawdy ani dziennikiem prac).
> Źródłem prawdy dla kolorów pozostaje `docs/design/ui-system.md`.

## Ocena ogólna

Kod jest **wiernie zgodny z warstwą zaimplementowaną i uczciwie opisuje dług**. Model
`Recipe` (jedno źródło, walidacja `zod`), filtr Kategorii, stany wyników i pełnoekranowy
hero odpowiadają kontraktom i makiecie `home-hero.png`. Tabele „Stan implementacji” i „Mapa
kodu” w `AGENTS.md` trafnie oddają, co istnieje.

System kolorów oraz tokenizacja skal (promienie, odstępy, typografia, tło) zostały uporządkowane
(niżej „Zrealizowane”). Do poprawy zostaje przede wszystkim **discovery overlay** (główny zakres
MVP) oraz drobne doprecyzowania dokumentacji.

---

## Zrealizowane w tej gałęzi

### System kolorów — jedna paleta trójbarwna marki (docelowa)

Przyciski dróg (CTA) i wybór w Kategoriach korzystają z **tego samego zestawu trzech kolorów**,
sparowanego. Kolory dróg na Hero pozostają bez zmian; grupa wyboru dziedziczy kolor swojej drogi.

| Przycisk drogi (CTA) | Grupa Kategorii | Kolor | Token |
|---|---|---|---|
| Mapa | Okazja | niebieski `#1768D2` | `--color-map` (+ `-strong`/`-soft`) |
| Kategorie | Tempo | zielony `#159447` | `--color-categories` (+ `-strong`/`-soft`) |
| Szukaj | Pora dnia | koral `#FF4F2E` | `--color-search` (+ `-strong`/`-soft`) |

- Nie ma osobnych tokenów kolorów grup — wybór używa tych samych tokenów co CTA dróg.
- Role tekstu są rozdzielone: `--color-heading-accent` (nagłówki, eyebrow) osobno od
  `--color-cta` (akcje). Kolor nagłówka, CTA i wyboru w Kategoriach to trzy niezależne role.
- Zaszyte heksy `#a82d18`/`#0b7133` wróciły do definicji tokenów (`-strong`).
- Świadome odejście od kolorów grup z makiety `home-browse-mode.png` (żółty/koral) na rzecz
  jednej palety marki. Pełny opis: `ui-system.md` › „Kolory przewodnie dróg” i „Akcenty grup Kategorii”.

Domyka to dawne punkty audytu o kolorystyce Kategorii i o zaszytych heksach.

### Tokenizacja skal (promienie, odstępy, typografia) i tło

Zamyka dawne punkty audytu A, B i C.

- **Promienie:** `--radius-field/card/panel/pill` — wszystkie `border-radius` przełączone na
  tokeny; naprawiono wartości poza skalą (karta `14→20`, znak marki `14→12`, notka dróg `16→12`).
- **Tło poza kontenerem:** token `--color-bg-shell` (`#F3EEE8`) zamiast zaszytego heksa
  w `:root` i `body`; dodany do tabeli kolorów `ui-system.md`.
- **Odstępy i typografia:** tokeny `--space-4…32` oraz `--font-size-14/20/24/32`; stałe,
  on-gridowe wartości (`gap`, `padding`, `margin`, `font-size`) przełączone na tokeny.
- **Świadoma granica:** płynne `clamp()` (rytm sekcji, rozmiary ikon/kafli) oraz nieliczne
  wartości poza siatką (np. `6/20/40px`, drobne rozmiary `11/12/15/18/26px`) pozostają
  literalne — ich zmiana to decyzja projektowa, nie mechaniczna. Opisane w `ui-system.md`
  „Geometria”/„Typografia”.

---

## Do poprawy — otwarte

### D. Discovery overlay (Wyszukiwarka + Mapa) niezaimplementowany
- **Stan:** kafle „Mapa” i „Szukaj” to jawne, nieinteraktywne placeholdery z etykietą
  „Wkrótce” — **uczciwie opisane** w `AGENTS.md`, więc znany dług, nie ukryta rozbieżność.
- **Niespełnione kontrakty:** kryteria akceptacji `home-page.md`, cały `discovery-overlay.md`,
  granica `RecipeSearch` (`TD-013`), reguły Szukaj/Mapa w `data-model.md`, testy z
  `quality-requirements.md` › „Strategia testów”. To **główny pozostały zakres MVP**.

### E. Brak ikon Kategorii z makiety
- Makieta `home-browse-mode.png` ma ikony w nagłówkach grup i przy opcjach. Kod używa `○`/`✓`
  + etykiety. Dostępność jest spełniona bez nich (obramowanie, pogrubienie, `✓`, `aria-pressed`),
  ale „charakter i hierarchia makiety” jest słabsza.

### F. Nagłówek wyników: „Propozycje” vs „Propozycje dla Ciebie”
- `discovery-overlay.md` normatywnie: **„Propozycje”**. Makieta strony głównej i kod:
  **„Propozycje dla Ciebie”**. Wyniki mają być wspólnym komponentem — do ujednolicenia
  w specyfikacji (jedna nazwa albo jawne rozróżnienie Kategorie vs overlay).

### G. „Jedna sekcja = jeden ekran” a makieta `home-hero.png`
- `home-page.md` wymienia komunikat „Co dziś jemy?” i kartę wyboru dróg jako osobne bloki
  pełnoekranowe. Makieta i kod (`.intro-screen`) łączą nagłówek + hero + kartę dróg w jeden
  ekran. **Do doprecyzowania w `home-page.md`**, że pierwszy ekran obejmuje te elementy razem.

### H. Weryfikacja bramek — nie potwierdzona w tym audycie
- Nie uruchomiono `corepack pnpm verify` (środowisko audytu: brak `node_modules`, Node v22
  wobec wymaganego ≥24). Skrypty (`lint`, `typecheck`, `test`, `test:e2e`, `build`) istnieją.
  Zieloność bramek należy potwierdzić w środowisku docelowym.

### Informacyjnie (bez akcji)
- Badge „Wkrótce” na kaflach Mapa/Szukaj to świadomy, jawny placeholder (`AGENTS.md`, reguła 9).

---

## Tabela zbiorcza

| # | Obszar | Źródło prawdy | Priorytet | Stan / akcja |
|---|---|---|---|---|
| — | System kolorów (paleta dróg + wybór Kategorii + role tekstu) | `ui-system.md` | P1 | ✅ zrobione |
| A | Tokeny promieni/odstępów/typografii | `code-conventions.md` | P1 | ✅ zrobione (klampy fluidowe świadomie literalne) |
| B | Tło `#f3eee8` spoza palety | `code-conventions.md`, `ui-system.md` | P1 | ✅ zrobione: `--color-bg-shell` |
| C | Promienie 14/16px poza skalą | `ui-system.md` | P1 | ✅ zrobione: 14→20/12, 16→12 |
| D | Discovery overlay niezaimplementowany | `discovery-overlay.md`, `mvp-scope.md` | P2 | zaimplementować (główny zakres) |
| E | Brak ikon Kategorii | makieta, `ui-system.md` | P2 | dodać ikony grup/opcji |
| F | „Propozycje” vs „Propozycje dla Ciebie” | `discovery-overlay.md` | P3 | ujednolicić w specyfikacji |
| G | Sekcje pełnoekranowe vs makieta hero | `home-page.md` | P3 | doprecyzować `home-page.md` |
| H | Weryfikacja bramek | `quality-requirements.md` | — | potwierdzić w środowisku docelowym |

## Rekomendowana kolejność

1. ~~Tokenizacja skal (A–C)~~ — ✅ zrobione.
2. **Discovery overlay** (D, potem E) — właściwy zakres MVP: powłoka, przełącznik, granica
   `RecipeSearch`, tryby Szukaj i Mapa, testy komponentów i E2E historii.
3. **Doprecyzowania dokumentacji** (F–G) — zamknąć rozjazdy litery specyfikacji.
