# System UI

> Status: obowiązujący dla MVP  
> Źródło: makiety w `../assets/ui/`  
> Aktualizacja: przy zmianie wspólnego wyglądu lub zachowania komponentów

## Cel

Ten dokument jest jednym źródłem prawdy dla reguł wizualnych wspólnych dla całej aplikacji. Specyfikacje funkcji opisują zachowanie ekranów i odwołują się tutaj zamiast powtarzać kolory, odstępy i stany komponentów.

Wartości zostały odczytane z makiet rastrowych, dlatego są początkowymi tokenami implementacyjnymi. Po uzyskaniu projektu źródłowego należy je jednorazowo skalibrować, zachowując nazwy semantyczne.

## W zakresie

- kolory, typografia, odstępy, promienie i cienie;
- wspólne komponenty i stany interakcji bieżącego etapu;
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
| `color-coral` | `#FF4F2E` | marka, Szukaj, główne CTA |
| `color-coral-soft` | `#FFF1EC` | delikatne tło stanu coral |
| `color-blue` | `#1768D2` | Mapa |
| `color-blue-soft` | `#EAF3FF` | delikatne tło stanu mapy |
| `color-green` | `#159447` | Kategorie |
| `color-green-soft` | `#ECF8EF` | delikatne tło stanu zielonego |
| `color-yellow` | `#F2AA00` | pora dnia |
| `color-tempo` | `#4F9B60` | tempo |
| `color-occasion` | `#FF6B4D` | okazja |

Gradient marki: `linear-gradient(135deg, #FF3A24, #FF633F)`.

Kolor nie może być jedynym nośnikiem znaczenia. Stan aktywny MUSI mieć także minimum obramowanie, zmianę grubości tekstu, ikonę lub atrybut semantyczny.

### Typografia

- Krój startowy: `Inter`, a następnie systemowy `sans-serif`. Wybór jest przybliżeniem na podstawie makiet.
- Nagłówki: zwarte, pogrubione `700–800`, z małą wysokością linii.
- Tekst podstawowy: `400–500`; etykiety aktywne i CTA: `600–700`.
- Minimalny tekst interfejsu: `16px`; drobne metadane mogą mieć `14px`, jeśli zachowują kontrast.
- Skala startowa: `14, 16, 20, 24, 32, 48, 64px`; wartości duże mają być płynne przez `clamp()`.

### Geometria

- Siatka odstępów: `4, 8, 12, 16, 24, 32, 48, 64px`.
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
- Czyszczenie pola i wysłanie zapytania muszą być dostępne z klawiatury.

### Przełącznik trybu

- Search i Mapa tworzą jeden przełącznik w overlayu.
- Aktywny tryb ma kolor ścieżki, obramowanie i pogrubioną etykietę.
- Przełączenie nie zamyka overlayu i nie usuwa stanu drugiego trybu w bieżącej sesji.

### Karta przepisu

- Wspólny wzorzec dla wszystkich ścieżek: zdjęcie, tytuł, opcjonalny opis, czas i od 1 do 3 tagów.
- Cała karta MUSI być linkiem do `/recipes/:slug`; nie wolno zagnieżdżać w niej konkurujących elementów interaktywnych bez wyraźnej potrzeby.
- Do czasu powstania strony przepisu link prowadzi do prostego ekranu zastępczego zachowującego możliwość powrotu.
- Zdjęcie używa `object-fit: cover`, stałych proporcji i tekstu alternatywnego opisującego danie.
- Brak zdjęcia MUSI mieć neutralny placeholder bez zmiany wymiarów karty.

### Overlay

- Jest pełnoekranowym dialogiem z jednym wspólnym nagłówkiem, przełącznikiem Search/Mapa i przyciskiem zamknięcia.
- MUSI blokować przewijanie tła, przenieść fokus do środka i przywrócić go elementowi otwierającemu.
- `Escape` zamyka overlay; fokus pozostaje uwięziony w dialogu.
- Akcja „Wstecz” przy otwartym overlayu zamyka go zamiast opuszczać poprzedni widok strony.
- Powierzchnia wypełnia mobilny viewport. Na ekranie szerszym niż `480px` pozostaje częścią wyśrodkowanego kontenera mobilnego.

## Stany danych — kolejny etap

Poniższa tabela jest kierunkiem kolejnego etapu i nie stanowi kryterium ukończenia obecnego prototypu interakcji.

| Stan | Docelowe zachowanie |
|---|---|
| początkowy | spokojna instrukcja, bez udawanych wyników |
| ładowanie | zachowany układ; skeleton lub wskaźnik z etykietą dla czytnika |
| sukces | krótka, uporządkowana lista dopasowań |
| pusty | informacja „Brak dopasowań” i łatwa droga zmiany kryteriów |
| błąd | zrozumiały komunikat i akcja „Spróbuj ponownie” |
| walidacja | komunikat przy właściwym polu lub grupie |

## Responsywność

- Projekt ma jeden układ mobilny działający od `320px` do `480px` szerokości.
- Na ekranie szerszym niż `480px` cały widok jest wyśrodkowany w kontenerze `max-width: 480px`; nie powstaje osobny układ tabletowy ani desktopowy.
- Trzy ścieżki strony głównej zachowują kolejność i hierarchię z makiety. Przy mniejszych szerokościach mogą zwężać kafle lub przechodzić w układ pionowy tylko wtedy, gdy jest to konieczne do uniknięcia przepełnienia.
- Karty wyników na telefonie mogą ustawić zdjęcie nad treścią; metadane nie mogą wypadać poza kartę.
- Overlay uwzględnia `100dvh`, bezpieczne obszary urządzenia i klawiaturę ekranową.
- Nie tworzymy dolnej nawigacji mobilnej, jeśli nie wynika to z nowej decyzji produktowej.

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
| interakcje | wyniki reagują na każdą zmianę kryteriów, a karta otwiera trasę przepisu |

System UI jest gotowy do implementacji, gdy tokeny są wdrożone centralnie, a komponenty nie zawierają lokalnych kopii wspólnych wartości bez uzasadnienia.
