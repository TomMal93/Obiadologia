# Raport audytu dokumentacji — słabe punkty

> Data: 2026-07-17
> Zakres: `docs/` (12 plików), `AGENTS.md`, `README.md` + weryfikacja względem kodu (`src/`, `package.json`, historia git)
> Charakter: materiał roboczy audytu; nie jest specyfikacją

## Podsumowanie

Dokumentacja jest ponadprzeciętnie dojrzała jak na etap projektu: ma jawny system źródeł prawdy, statusy dokumentów, słowa normatywne (MUSI/POWINIEN/MOŻE), rejestr decyzji z ADR-em i kryteria akceptacji. Zweryfikowane kontrakty (mapowanie `pace`/`lightness`, tokeny kolorów w `global.css`, polecenia weryfikacyjne vs `package.json`, tabela stanu implementacji w `AGENTS.md`) są zgodne z kodem.

Słabe punkty koncentrują się w czterech obszarach:

1. **niedodefiniowane kontrakty danych i rankingu** — kod już dziś musiał „zgadywać” (sortowanie Kategorii, `editorialPriority`, `description`, komunikaty pustych stanów);
2. **jedna realna sprzeczność i jedno naruszenie własnych zasad** (kolor fokusu; TD-011 jako specyfikacja zachowania w rejestrze decyzji);
3. **niespójna terminologia** („drogi” / „ścieżki” / „tryby”);
4. **ręcznie utrzymywane indeksy**, które już zaczęły się rozjeżdżać.

---

## 1. Sprzeczności i konflikty między dokumentami

### 1.1. Kolor fokusu pola Wyszukiwarki — WYSOKI

- `ui-system.md` (tabela tokenów): `color-blue` — „odcień bazowy niebieskiego (Mapa, **pierścień fokusu**)”.
- `discovery-overlay.md` (Tryb Wyszukiwarki): „Kolor koralowy identyfikuje aktywną Wyszukiwarkę, **fokus pola** i aktywną sugestię”.

Przy implementacji overlaya nie wiadomo, czy pierścień fokusu pola wyszukiwania jest niebieski (reguła globalna) czy koralowy (reguła trybu). Wg tabeli źródeł prawdy reguły wizualne należą do `ui-system.md`, ale zdanie w specyfikacji overlaya wygląda na świadomą decyzję trybu. Do rozstrzygnięcia zanim powstanie overlay.

### 1.2. TD-011 narusza własną zasadę rejestru decyzji — ŚREDNI

`docs/README.md`: „Rejestr decyzji opisuje przyjęty kierunek techniczny (…), ale **nie zastępuje specyfikacji zachowania**”. Reguła 2 w `AGENTS.md`: streszczenie „nie może dodawać własnych szczegółów kontraktu”.

Tymczasem TD-011 to pełny, wieloakapitowy kontrakt zachowania historii przeglądarki, który **dodaje szczegóły nieobecne w specyfikacji**: „identyfikator sesji”, „serializowalny snapshot” zapisywany we wpisie historii. Specyfikacja overlaya mówi natomiast: „Stan potrzebny do odtworzenia zawieszonej sesji **pozostaje lokalny**” — snapshot w `history.state` a stan lokalny to różne mechanizmy. Dwa dokumenty opisują ten sam kontrakt na różnym poziomie szczegółu → gwarantowany drift. TD-011 powinien zostać skrócony do decyzji + uzasadnienia, a szczegóły przeniesione do `discovery-overlay.md` (albo do ADR-a, skoro to decyzja kosztowna do odwrócenia).

### 1.3. „Nierozstrzygnięte” w `mvp-scope.md` bez powiązania z OPEN-* — NISKI

`mvp-scope.md` wymienia „źródło danych o daniach” i „produkcyjne strojenie dopasowania” jako nierozstrzygnięte, ale nie linkuje do `OPEN-003` / `OPEN-007` w `technical-decisions.md`. Te same decyzje żyją w dwóch miejscach bez odsyłacza — zamknięcie OPEN-a nie wymusi aktualizacji `mvp-scope.md`.

### 1.4. Minimalny rozmiar tekstu: 16px vs wyjątek 14px — NISKI

`ui-system.md` (Typografia): „Minimalny tekst interfejsu: 16px; drobne metadane mogą mieć 14px”. Ale sekcja „Spójność i proporcje” tego samego dokumentu oraz `quality-requirements.md` mówią bez wyjątku: „tekst interfejsu nie schodzi poniżej 16px”. Nie wiadomo, czy metadane (14px, token `--font-size-14` już istnieje w kodzie) są „tekstem interfejsu” w rozumieniu progu. Warto powtórzyć wyjątek przy każdym wystąpieniu progu.

---

## 2. Niedodefiniowane kontrakty (kod już musiał zgadywać)

### 2.1. Sortowanie wyników Kategorii — WYSOKI (rozjazd dokument–kod)

`data-model.md`: „Wyniki sortujemy najpierw według **jakości dopasowania**, następnie `editorialPriority`”.

Problem podwójny:

- „Jakość dopasowania” nie jest nigdzie zdefiniowana. Przy filtrze AND każdy wynik spełnia *wszystkie* wybrane kryteria, więc pierwszy klucz sortowania jest pusty albo znaczy coś, czego dokument nie mówi (np. liczbę dopasowanych grup przy częściowym wyborze — ale to przeczy AND).
- Kod (`src/domain/recipe.ts:80`) sortuje **wyłącznie** po `editorialPriority` malejąco. Implementacja jest więc niezgodna z literalnym brzmieniem dokumentu — albo dokument opisuje regułę martwą.

Rekomendacja: usunąć „jakość dopasowania” z reguły Kategorii albo ją zdefiniować.

### 2.2. `editorialPriority` bez kierunku i zakresu — WYSOKI

`data-model.md` typuje pole jako `number` i mówi tylko „rozstrzyganie podobnych wyników”. Nie definiuje:

- kierunku (czy wyższa wartość = wyższa pozycja?) — kod przyjął malejąco, dokument tego nie potwierdza;
- zakresu ani konwencji nadawania (przykład ma `80`, ale 0–100 to tylko domysł);
- zachowania przy remisie.

Dla pola, które jest jedynym realnym kluczem sortowania Kategorii i kluczem wyboru propozycji neutralnej Mapy, to za mało.

### 2.3. Wymagalność `description` — ŚREDNI

Trzy niespójne sygnały: tabela w `data-model.md` nie określa wymagania („krótki opis dania”), karta wyniku w `discovery-overlay.md` mówi „**opcjonalny** krótki opis”, a kod (`recipe.ts:23`) wymaga niepustego stringa. Jeśli opis jest obowiązkowy w danych, a opcjonalny tylko na karcie — trzeba to napisać wprost; jeśli ma być opcjonalny w danych, kod jest błędny.

### 2.4. Pusty stan Kategorii bez specyfikacji — ŚREDNI

`discovery-overlay.md` podaje dokładne komunikaty braku wyników dla obu trybów („Nie znaleźliśmy pasujących propozycji.” / „…dla tego miejsca.”). `home-page.md` nie definiuje **żadnego** komunikatu braku wyników dla Kategorii, mimo że `mvp-scope.md` wymaga odporności na brak wyników. Kod wymyślił własną treść: „Brak dopasowań. Zmień lub usuń wybrane kryterium.” (`DiscoveryExperience.tsx:235`). Analogicznie nagłówek sekcji wyników: kod używa „Propozycje dla Ciebie”, overlay specyfikuje „Propozycje”, `home-page.md` milczy. Treści widoczne dla użytkownika powstały poza źródłem prawdy.

### 2.5. „Od trzech do czterech propozycji” a mniejsza liczba dopasowań — ŚREDNI

`home-page.md` i `discovery-overlay.md` mówią o „od trzech do czterech” propozycjach, ale nie określają zachowania, gdy dopasowań jest 1–2 (kod pokazuje wtedy 1–2 bez komentarza) ani kto/co decyduje między 3 a 4. Reguła różnorodności neutralnej Mapy zakłada listę „tej samej długości” — której długości?

### 2.6. Granica trybu „neutralnego środka” Mapy — ŚREDNI

`data-model.md`: w środku `(0.5, 0.5)` obowiązuje wybór wg `editorialPriority` + różnorodność `MealTime`; poza środkiem — ranking odległości euklidesowej. Nie zdefiniowano, czy reguła neutralna dotyczy **wyłącznie dokładnego punktu** (0.5, 0.5), czy otoczenia. Przy przeciąganiu ciągłym minimalne drgnięcie punktu przełącza algorytm skokowo — użytkownik zobaczy nagłą podmianę listy przy 1px ruchu. Do doprecyzowania przed implementacją Mapy.

### 2.7. Mapowanie polskich etykiet na słowniki EN — ŚREDNI

UI używa polskich etykiet („Śniadanie”, „Na już”, „Dla gości”), model — angielskich enumów (`breakfast`, `now`, `guests`). Mapowanie jest oczywiste, ale **nigdzie nie jest jawnie zapisane** — to typowe miejsce cichego rozjazdu (np. „Na dziś” vs `today` vs przyszłe „na jutro”). Poważniejsza konsekwencja: `discovery-overlay.md` mówi, że sugestie „mogą reprezentować (…) **kategorię**”, a ranking wyszukiwania to „tytuł > składniki > tagi > opis” — model `Recipe` nie ma żadnego wyszukiwalnego polskiego pola dla pór dnia/tempa/okazji. Wyszukanie „śniadanie” nie znajdzie niczego, chyba że redakcja zdubluje kategorię w `tags`. Ta zależność nie jest opisana.

### 2.8. „Tolerancja polskich znaków” — NISKI

Normalizacja zapytania: „tolerancja polskich znaków” nie mówi, czy chodzi o folding jednostronny (zapytanie „zolty” znajduje „żółty”), dwustronny, czy także o typowe literówki. Dla testów jednostkowych normalizacji (wymaganych w `quality-requirements.md`) potrzebna jest definicja operacyjna.

### 2.9. Wsparcie przeglądarek nieweryfikowalne — NISKI

`quality-requirements.md`: „dwie najnowsze stabilne wersje Chrome, Edge, Firefox i Safari **w momencie wydania**” — wydania czego (aplikacji? każdej zmiany?) i jak to sprawdzać, skoro E2E biegnie tylko w mobilnym Chromium? Kryterium nie ma ścieżki weryfikacji.

---

## 3. Terminologia

### 3.1. „Drogi” vs „ścieżki” vs „tryby” — ŚREDNI

- `product-vision.md`, `mvp-scope.md`, `home-page.md`: „trzy **drogi**”;
- `ui-system.md`, `code-conventions.md`, ADR: „**ścieżki**” („kolory przewodnie dróg” i „akcje ścieżek” w jednym dokumencie);
- „**tryby**” oznaczają Wyszukiwarkę/Mapę w overlayu — ale nagłówek sekcji Kategorii w `home-page.md` (i w kodzie) brzmi „**Wybierz tryb**”, choć użytkownik wybiera tam opcje kategorii, nie tryb.

„Tryb” jest przeciążony (tryb overlaya ≠ „Wybierz tryb” w Kategoriach), a synonimy drogi/ścieżki utrudniają grep i precyzyjne odsyłacze. Brakuje krótkiego słowniczka terminów w `docs/README.md` i decyzji, czy nagłówek „Wybierz tryb” to celowa treść produktowa.

### 3.2. Parowanie kolorów grup Kategorii bez uzasadnienia — NISKI

`ui-system.md` przypisuje: Pora dnia ↔ kolor Szukaj, Tempo ↔ kolor Kategorii, Okazja ↔ kolor Mapy. Dokument mówi *że* tak jest i że świadomie odchodzi od makiety, ale nie *dlaczego akurat takie* parowanie (np. czemu „Tempo” nie dziedziczy koloru Mapy, skoro Mapa ma oś tempa). Przy przyszłej zmianie palety nikt nie będzie wiedział, co wolno przestawić.

---

## 4. Utrzymanie i struktura

### 4.1. `analiza-biznesowa.md` poza systemem dokumentacji — ŚREDNI

Plik jest niezacommitowany i **niewidoczny w indeksie**: drzewo struktury i routing w `docs/README.md` go nie znają. Sam `docs/README.md` deklaruje pełną strukturę katalogu, więc każdy nowy plik unieważnia drzewo. Do decyzji: dopisać do indeksu (np. sekcja „materiały robocze”), przenieść poza `docs/`, albo zrezygnować z pełnego drzewa na rzecz opisu katalogów.

### 4.2. Ręcznie synchronizowane indeksy — ŚREDNI

Trzy miejsca wymagają ręcznej synchronizacji przy każdej zmianie: drzewo + routing w `docs/README.md`, „Mapa kodu” i „Stan implementacji” w `AGENTS.md`. Obecnie są zgodne z kodem (zweryfikowano), ale to dyscyplina, nie mechanizm — a historia repo pokazuje, że drift już się zdarzał (commit „poprawki znalezione przy audycie dokumentacji”). Minimalnie: dodać do Definition of Done jawny punkt „indeksy zaktualizowane”.

### 4.3. Brak dat aktualizacji dokumentów — NISKI

Poza ADR-em i analizą biznesową żaden dokument nie ma daty ostatniej istotnej zmiany. Pole „Aktualizacja:” opisuje *kiedy należy* aktualizować, nie *kiedy zaktualizowano*. Przy 12 plikach czytelnik nie odróżni świeżego kontraktu od zeszłorocznego bez archeologii w gicie.

### 4.4. „Porównania wizualne” bez ścieżki wykonania — NISKI

TD-012 i `quality-requirements.md` wymagają porównań wizualnych (Playwright) na 5 szerokościach + 2 wysokościach + 768px, ale: w repo nie ma żadnej konfiguracji wizualnych snapshotów, a sekcja „Polecenia weryfikacyjne” nie zawiera komendy do ich uruchomienia. Wymaganie istnieje tylko deklaratywnie — nie wiadomo, czy to zaległość, czy świadome odroczenie (jeśli odroczenie, powinno być nazwane jak inne odroczenia).

---

## 5. Uwagi do `analiza-biznesowa.md` (merytoryczne)

- **Niepodparte liczby i twierdzenia**: prowizje e-grocery „3–8%”, „nikt na polskim rynku nie ma”, teza o progach płacenia za aplikacje — bez źródeł. Jako materiał roboczy dopuszczalne, ale dokument nie odróżnia hipotez od faktów; jedno zdanie zastrzeżenia by wystarczyło.
- **Pomysł 4 (mapa ciąży ku sezonowi/pogodzie) koliduje z obowiązującymi zasadami**: TD-005 i `product-vision.md` mówią „system nie udaje preferencji użytkownika”, „mapa startuje w neutralnym środku”. Domyślne przesunięcie mapy to dokładnie udawanie preferencji. Pomysł może być wart rozważenia, ale analiza powinna flagować, że wymaga **zmiany przyjętej decyzji produktowej**, nie tylko implementacji.
- **Pomysł 3 (localStorage: ulubione, „ukryj danie”)** wchodzi w obszar „trwała personalizacja”, jawnie wykluczony z MVP — analogicznie warto oznaczyć jako wymagający decyzji o granicach etapu.
- Dokument nie jest podpięty pod filtr nowych funkcji z `product-vision.md` — wizja definiuje 5 pytań kwalifikacyjnych, a żaden z 17 pomysłów nie został przez nie przepuszczony, choć to gotowe narzędzie oceny właśnie takich list.

---

## 6. Priorytety naprawcze

| # | Działanie | Punkty | Waga |
|---|---|---|---|
| 1 | Zdefiniować sortowanie Kategorii (usunąć/zdefiniować „jakość dopasowania”) i kierunek + konwencję `editorialPriority` | 2.1, 2.2 | wysoka |
| 2 | Rozstrzygnąć kolor fokusu pola Wyszukiwarki przed implementacją overlaya | 1.1 | wysoka |
| 3 | Uzupełnić `home-page.md` o komunikat pustego stanu i nagłówek wyników (zalegalizować lub poprawić treści z kodu) | 2.4 | średnia |
| 4 | Określić wymagalność `description` i zsynchronizować kod/kartę | 2.3 | średnia |
| 5 | Zapisać mapowanie etykiet PL ↔ słowniki EN i wyszukiwalność kategorii | 2.7 | średnia |
| 6 | Odchudzić TD-011 do decyzji, szczegóły przenieść do specyfikacji/ADR | 1.2 | średnia |
| 7 | Zdecydować los `analiza-biznesowa.md` w indeksie; dodać flagi konfliktów z wizją | 4.1, 5 | średnia |
| 8 | Ujednolicić terminologię (drogi/ścieżki/tryby) + mini-słowniczek | 3.1 | średnia |
| 9 | Doprecyzować granicę neutralnego środka Mapy i zachowanie przy <3 wynikach | 2.5, 2.6 | średnia (przed implementacją Mapy) |
| 10 | Drobne: linki OPEN-* z `mvp-scope.md`, wyjątek 14px, definicja tolerancji znaków, daty aktualizacji, ścieżka porównań wizualnych | 1.3, 1.4, 2.8, 2.9, 4.3, 4.4 | niska |

## Co działa dobrze (dla równowagi)

- Jawny system źródeł prawdy z zasadą rozstrzygania konfliktów i zakazem „wyboru wygodniejszej wersji”.
- Statusy dokumentów i słowa normatywne konsekwentnie stosowane.
- Rozdzielenie decyzji przyjętych/otwartych z właścicielami i regułami tymczasowymi; wycofany numer TD-014 obsłużony wzorcowo.
- Zweryfikowane kontrakty zgodne z kodem: mapowanie osi Mapy (`pace`/`lightness`), tokeny w `global.css`, polecenia weryfikacyjne vs `package.json`, tabela stanu implementacji w `AGENTS.md`.
- Specyfikacja overlaya myśli o rzadkich przypadkach (wyścigi odpowiedzi, historia przeglądarki, „Dalej” po zamknięciu, klawiatura ekranowa).
