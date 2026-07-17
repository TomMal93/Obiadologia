# System UI

> Status: obowiązujący dla MVP  
> Źródło: makiety w `../assets/ui/`  
> Aktualizacja: przy zmianie wspólnego wyglądu lub zachowania komponentów

## Cel

Ten dokument jest jednym źródłem prawdy dla reguł wizualnych wspólnych dla całej aplikacji. Specyfikacje funkcji opisują zachowanie ekranów i odwołują się tutaj zamiast powtarzać kolory, odstępy i stany komponentów.

Wartości zostały odczytane z makiet rastrowych, dlatego pozostałe tokeny są początkowymi wartościami implementacyjnymi. Po uzyskaniu projektu źródłowego można je jednorazowo skalibrować, zachowując nazwy semantyczne.

Wyjątkiem są **kolory przewodnie dróg** (Mapa, Szukaj, Kategorie) opisane niżej — to wartości **docelowe**, potwierdzone jako tożsamość trzech ścieżek odkrywania. Nie podlegają już kalibracji „na później”; ich zmiana jest decyzją projektową, nie technicznym przybliżeniem.

## W zakresie

- kolory, typografia, odstępy, promienie i cienie;
- wspólne komponenty i stany interakcji bieżącego etapu;
- zasada pełnoekranowych sekcji (jedna sekcja = jeden ekran);
- reguły responsywności, dostępności i ruchu.

## Poza zakresem

- logika wyszukiwania, mapy i kategorii;
- dokładny układ poszczególnych ekranów;
- wybór biblioteki komponentów.

## Tokeny

### Kolory

| Token | Wartość startowa | Zastosowanie |
|---|---:|---|
| `color-bg` | `#FDF8F2` | kremowe tło strony |
| `color-surface` | `#FFFFFF` | karty i overlay |
| `color-text` | `#1F1A17` | tekst główny |
| `color-text-muted` | `#6E6863` | opisy i metadane |
| `color-border` | `#E9DDD3` | neutralne obramowania |
| `color-coral` | `#FF4F2E` | odcień bazowy koralu (marka, CTA i Szukaj przez tokeny ról) |
| `color-coral-soft` | `#FFF1EC` | delikatne tło stanu coral |
| `color-blue` | `#1768D2` | odcień bazowy niebieskiego (Mapa, pierścień fokusu) |
| `color-blue-soft` | `#EAF3FF` | delikatne tło stanu mapy |
| `color-green` | `#159447` | odcień bazowy zieleni (Kategorie) |
| `color-green-soft` | `#ECF8EF` | delikatne tło stanu zielonego |
| `color-heading-accent` | `#FF4F2E` | akcent nagłówków (h1, eyebrow) — osobny byt od CTA |
| `color-cta` | `#FF4F2E` | kolor akcji CTA (np. linki-akcje) — osobny byt od nagłówków |
| `color-daypart` | `#F2AA00` | akcent grupy „pora dnia” |
| `color-daypart-soft` | `#FDF1D8` | tło wybranej opcji „pora dnia” |
| `color-tempo` | `#4F9B60` | akcent grupy „tempo” |
| `color-tempo-soft` | `#E9F4EC` | tło wybranej opcji „tempo” |
| `color-occasion` | `#FF6B4D` | akcent grupy „okazja” |
| `color-occasion-soft` | `#FFE9E2` | tło wybranej opcji „okazja” |

Gradient marki: `linear-gradient(135deg, #FF3A24, #FF633F)`.

Role tekstu marki są rozdzielone na osobne tokeny: `--color-heading-accent` (nagłówki — h1 i etykiety typu eyebrow) oraz `--color-cta` (akcje CTA). Mają dziś wspólny odcień bazowy (koral), ale są osobnymi bytami — zmiana koloru CTA nie zmienia koloru nagłówków ani odwrotnie. Kolor nagłówka, kolor CTA i kolor wyboru w Kategoriach są trzema niezależnymi rolami i MUSZĄ pozostać osobnymi tokenami.

#### Kolory przewodnie dróg (docelowe)

Trzy drogi odkrywania mają stały kolor tożsamości. Ten sam kolor identyfikuje daną drogę na Hero (drzewko i kafle wyboru), a dla Mapy i Szukaj — docelowo w trybie overlaya. Wewnętrzne akcenty grup w sekcji Kategorii są osobne (zob. „Akcenty grup Kategorii” niżej). Są to wartości docelowe, nie przybliżenia do kalibracji.

| Droga | Token bazowy | Wartość | `-strong` (tekst na jasnym tle) | `-soft` (tło stanu) |
|---|---|---:|---:|---:|
| Mapa | `--color-map` | `#1768D2` | `--color-map-strong` `#1768D2` | `--color-map-soft` `#EAF3FF` |
| Szukaj | `--color-search` | `#FF4F2E` | `--color-search-strong` `#A82D18` | `--color-search-soft` `#FFF1EC` |
| Kategorie | `--color-categories` | `#159447` | `--color-categories-strong` `#0B7133` | `--color-categories-soft` `#ECF8EF` |

- Wariant bazowy to akcent (linie, ikony, obramowania, kropki drzewka).
- Wariant `-strong` jest przeznaczony do tekstu i etykiet na jasnym tle i MUSI spełniać kontrast WCAG 2.2 AA. Dla Mapy kolor bazowy spełnia próg samodzielnie, więc `-strong` jest mu równy.
- Wariant `-soft` to delikatne tło stanu aktywnego lub kafla.
- Kolory przewodnie są aliasami odcieni bazowych (`--color-blue`/`--color-coral`/`--color-green`); te odcienie mogą nadal służyć innym rolom (np. koral marki, niebieski pierścienia fokusu). W kodzie tożsamość drogi zawsze używa tokenu przewodniego, nie odcienia bazowego.

#### Akcenty grup Kategorii (docelowe)

W sekcji Kategorii każda z trzech grup wyboru ma własny kolor tożsamości zgodny z makietą `home-browse-mode.png`:

| Grupa | Token akcentu | Wartość | Tło wybranej opcji (`-soft`) |
|---|---|---:|---:|
| Pora dnia | `--color-daypart` | `#F2AA00` | `--color-daypart-soft` `#FDF1D8` |
| Tempo | `--color-tempo` | `#4F9B60` | `--color-tempo-soft` `#E9F4EC` |
| Okazja | `--color-occasion` | `#FF6B4D` | `--color-occasion-soft` `#FFE9E2` |

- Wybrana opcja niesie kolor grupy na obramowaniu i delikatnym tle; tekst pozostaje ciemny (`--color-text`), aby zawsze spełniać kontrast WCAG 2.2 AA niezależnie od jasności akcentu (istotne dla żółtego).
- Stan wybrania jest też sygnalizowany pogrubieniem, znacznikiem i `aria-pressed` — kolor nie jest jedynym nośnikiem znaczenia.
- Akcenty grup są niezależne od kolorów przewodnich dróg: zielony (`--color-categories`) identyfikuje drogę Kategorie na Hero, a wewnątrz sekcji poszczególne grupy wyboru używają własnych akcentów.

Kolor nie może być jedynym nośnikiem znaczenia. Stan aktywny MUSI mieć także minimum obramowanie, zmianę grubości tekstu, ikonę lub atrybut semantyczny.

### Typografia

- Krój startowy: `Inter`, a następnie systemowy `sans-serif`. Wybór jest przybliżeniem na podstawie makiet.
- Nagłówki: zwarte, pogrubione `700–800`, z małą wysokością linii.
- Tekst podstawowy: `400–500`; etykiety aktywne i CTA: `600–700`.
- Minimalny tekst interfejsu: `16px`; drobne metadane mogą mieć `14px`, jeśli zachowują kontrast.
- Skala startowa: `14, 16, 20, 24, 32, 48, 64px`; wartości duże mają być płynne przez `clamp()`.

### Geometria

- Siatka odstępów: `4, 8, 12, 16, 24, 32, 48, 64px`. Wartości wyrażają rytm i proporcje skalowane spójnie w zakresie mobilnym, a nie sztywne stałe niezależne od viewportu — zob. „Spójność i proporcje na telefonach”.
- Promienie: `12px` dla tagów i pól, `20px` dla kart, `28px` dla dużych paneli.
- Minimalny obszar kliknięcia: `44 × 44px`.
- Cień powierzchni: miękki i jasny, np. `0 12px 32px rgb(89 55 29 / 8%)`.
- Obramowania są subtelne; kolorowe obramowanie oznacza aktywną ścieżkę lub wybór.

## Komponenty wspólne

### Przycisk i kafel wyboru

- MUSI obsługiwać: `default`, `hover`, `focus-visible`, `active/selected`, `disabled` i `loading`.
- Fokus MUSI być wyraźnym pierścieniem o kontraście co najmniej 3:1.
- Stan wyłączony nie może wyglądać jak dostępna akcja i MUSI mieć `disabled` lub `aria-disabled`.
- Akcja główna używa gradientu marki; akcje ścieżek używają odpowiednio coral, blue albo green.

### Pole wyszukiwania

- MUSI mieć widoczną etykietę lub poprawne `aria-label`.
- Błąd i instrukcja nie mogą opierać się wyłącznie na placeholderze.
- Edycja i czyszczenie pola muszą być dostępne z klawiatury.

### Przełącznik trybu

- Search i Mapa tworzą jeden przełącznik w overlayu.
- Aktywny tryb ma kolor ścieżki, obramowanie i pogrubioną etykietę.
- Zachowanie przełącznika i stan sesji definiuje [discovery-overlay.md](../product/features/discovery-overlay.md).

### Karta przepisu

- Wspólny wzorzec dla wszystkich ścieżek: zdjęcie, tytuł, opcjonalny opis, czas i od 1 do 3 tagów.
- Karta ma jeden wyraźny obszar interakcji; nie wolno zagnieżdżać w nim konkurujących elementów interaktywnych bez wyraźnej potrzeby.
- Zachowanie nawigacyjne i bieżący zakres trasy przepisu definiuje [mvp-scope.md](../product/mvp-scope.md).
- Zdjęcie używa `object-fit: cover`, stałych proporcji i tekstu alternatywnego opisującego danie.
- Brak zdjęcia MUSI mieć neutralny placeholder bez zmiany wymiarów karty.

### Overlay

- Jest pełnoekranowym dialogiem z jednym wspólnym nagłówkiem, przełącznikiem Search/Mapa i przyciskiem zamknięcia.
- Powierzchnia wypełnia mobilny viewport. Na ekranie szerszym niż `480px` pozostaje częścią wyśrodkowanego kontenera mobilnego.
- Zachowanie dialogu, nawigacji i fokusu definiuje [discovery-overlay.md](../product/features/discovery-overlay.md), a wymagania przekrojowe — [quality-requirements.md](../engineering/quality-requirements.md).

## Stany danych — kolejny etap

Poniższa tabela jest kierunkiem kolejnego etapu i nie stanowi kryterium ukończenia obecnego prototypu interakcji.

| Stan | Docelowe zachowanie |
|---|---|
| początkowy | instrukcja i wyniki zgodne ze specyfikacją funkcji, bez udawania kryteriów podanych przez użytkownika |
| ładowanie | zachowany układ; skeleton lub wskaźnik z etykietą dla czytnika |
| sukces | krótka, uporządkowana lista dopasowań |
| pusty | informacja „Brak dopasowań” i łatwa droga zmiany kryteriów |
| błąd | zrozumiały komunikat i akcja „Spróbuj ponownie” |
| walidacja | komunikat przy właściwym polu lub grupie |

## Sekcje pełnoekranowe

Aplikacja jest zbudowana z sekcji, z których każda odpowiada jednemu ekranowi. Zasada „jedna sekcja = jeden ekran” jest podstawowym założeniem układu i ma pierwszeństwo przy projektowaniu zawartości każdej sekcji.

- Każda główna sekcja MUSI wypełniać jeden ekran, tj. wysokość widocznego obszaru (`100dvh`) z uwzględnieniem bezpiecznych obszarów urządzenia i klawiatury ekranowej.
- Sekcja przy bazowych ustawieniach nie może być wyższa niż ekran. Treść projektujemy tak, aby mieściła się w jednym ekranie; jeśli się nie mieści, ograniczamy lub upraszczamy treść, zamiast rozciągać sekcję albo wprowadzać przewijanie wewnątrz sekcji.
- Przewijanie między sekcjami jest swobodne. Na tym etapie nie wprowadzamy wymuszonego zatrzaskiwania (`scroll-snap`); ewentualne dodanie snapu jest osobną decyzją produktową.
- Reguła nie może łamać dostępności. Przy powiększeniu tekstu, bardzo niskim ekranie lub otwartej klawiaturze treść MUSI pozostać w pełni osiągalna (bez przycięcia), nawet jeśli wymaga to przewinięcia — zgodnie z wymaganiem reflow WCAG 2.2 AA.
- Fokus i kolejność czytania MUSZĄ pozostać poprawne mimo pełnoekranowego układu; granica ekranu nie może ukrywać treści ani kontrolek przed czytnikiem i klawiaturą.
- Podział strony głównej na sekcje definiuje [home-page.md](../product/features/home-page.md). Overlay jest z natury pełnoekranowy i spełnia tę regułę bez dodatkowych zabiegów.

## Responsywność

- Projekt ma jeden układ mobilny działający od `320px` do `480px` szerokości.
- Na ekranie szerszym niż `480px` cały widok jest wyśrodkowany w kontenerze `max-width: 480px`; nie powstaje osobny układ tabletowy ani desktopowy.
- Trzy ścieżki strony głównej zachowują kolejność i hierarchię z makiety. Przy mniejszych szerokościach mogą zwężać kafle lub przechodzić w układ pionowy tylko wtedy, gdy jest to konieczne do uniknięcia przepełnienia.
- Karty wyników na telefonie mogą ustawić zdjęcie nad treścią; metadane nie mogą wypadać poza kartę.
- Overlay uwzględnia `100dvh`, bezpieczne obszary urządzenia i klawiaturę ekranową.
- Nie tworzymy dolnej nawigacji mobilnej, jeśli nie wynika to z nowej decyzji produktowej.

## Spójność i proporcje na telefonach

W całym zakresie mobilnym (`320–480px` szerokości i przy różnych wysokościach ekranu) sekcja zachowuje tę samą kompozycję. Widok na mniejszym telefonie jest proporcjonalnie przeskalowaną wersją widoku na większym, a nie osobnym układem.

- Kolejność, hierarchia, wyrównanie i rytm odstępów między elementami sekcji MUSZĄ być takie same na wszystkich obsługiwanych telefonach. Dopuszczalne różnice między urządzeniami są proporcjonalne (skala), a nie strukturalne (zmiana układu, przestawianie ani ukrywanie elementów).
- Odstępy między elementami oraz rozmiary elementów skalują się płynnie względem viewportu (szerokości i wysokości), tak aby sekcja wypełniała jeden ekran spójnie od najmniejszego do największego telefonu — bez dużych pustych obszarów i bez przepełnienia. Reguła pełnoekranowych sekcji ma tu pierwszeństwo.
- Skalowanie proporcjonalne jest ograniczone progami dostępności: tekst interfejsu nie schodzi poniżej `16px`, obszar kliknięcia poniżej `44 × 44px`, a kontrast poniżej WCAG 2.2 AA. Gdy wartość proporcjonalna osiągnęłaby próg, zostaje przy progu.
- Żaden element ani kontrolka nie może być ucięty na krawędzi sekcji lub ekranu; treść nie tworzy poziomego przewijania, elementy nie nachodzą na siebie ani nie „rozjeżdżają się” między rozmiarami telefonów.
- Zdjęcia skalują się ze stałymi proporcjami (`object-fit: cover`), bez zniekształcenia i bez zmiany geometrii karty; brak zdjęcia zachowuje wymiary (zob. „Karta przepisu”).
- Zmiana strukturalna układu jest ostatecznością dopuszczoną tylko wtedy, gdy proporcjonalne skalowanie nie usuwa przepełnienia. Jeśli jest konieczna, MUSI zachodzić spójnie w całym zakresie, a nie różnicować pojedynczych rozmiarów telefonów.
- Siatka odstępów i skala typografii z sekcji „Geometria” i „Typografia” wyrażają proporcje (rytm i relacje), które to skalowanie utrzymuje spójnie w zakresie mobilnym, z zachowaniem powyższych progów dostępności.

## Ruch i dostępność

- Animacje powinny trwać około `150–250ms` i wspierać orientację, nie dekorację.
- `prefers-reduced-motion: reduce` MUSI usuwać ruch niekonieczny.
- Tekst i kontrolki MUSZĄ spełniać WCAG 2.2 AA.
- Kolejność fokusu MUSI odpowiadać kolejności wizualnej i logicznej.
- Nagłówki zachowują poprawną hierarchię; ikony dekoracyjne są ukryte przed czytnikiem.

## Weryfikacja i ukończenie

| Sprawdzenie | Kryterium |
|---|---|
| porównanie z makietami | charakter, hierarchia i kolory ścieżek są zachowane |
| klawiatura | wszystkie akcje działają bez myszy, a fokus jest widoczny |
| kontrast | tekst, kontrolki i fokus spełniają WCAG 2.2 AA |
| viewporty | brak przepełnień przy 320, 375, 390, 430 i 480px; przy 768px układ pozostaje mobilny i wyśrodkowany |
| sekcje pełnoekranowe | każda główna sekcja wypełnia jeden ekran i przy bazowych ustawieniach go nie przekracza, a treść nie jest przycięta |
| spójność między telefonami | ta sama kompozycja, hierarchia i rytm odstępów na 320, 375, 390, 430 i 480px oraz przy niskiej i wysokiej wysokości ekranu; różnice są proporcjonalne, nie strukturalne |
| brak ucięć i rozjazdów | żaden element nie jest ucięty ani nie przepełnia sekcji, brak poziomego przewijania, elementy nie nachodzą na siebie ani się nie rozjeżdżają |
| interakcje | wyniki reagują na każdą zmianę kryteriów, a karta otwiera trasę przepisu |

System UI jest gotowy do implementacji, gdy tokeny są wdrożone centralnie, a komponenty nie zawierają lokalnych kopii wspólnych wartości bez uzasadnienia.
