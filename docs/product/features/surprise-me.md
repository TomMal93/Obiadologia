# Sekcja „Zaskocz mnie”

> Status: roboczy — propozycja do akceptacji
> Dotyczy: strona główna, sekcja domykająca pod Kategoriami

Ten dokument jest propozycją nowej sekcji strony głównej. Nie jest jeszcze
obowiązujący. Do czasu akceptacji nie należy go wdrażać, a normatywne kontrakty
(`mvp-scope.md`, `home-page.md`) pozostają bez zmian. Sekcja „[Wpływ na inne
źródła prawdy](#wpływ-na-inne-źródła-prawdy)” opisuje, co trzeba w nich zmienić,
jeżeli propozycja zostanie przyjęta.

## Cel

„Zaskocz mnie” to droga dla użytkownika, który przewinął całą stronę główną i
nadal nie chce niczego wybierać. Zamiast kolejnego pola do wypełnienia
przedstawia **jedną kuratorską propozycję dania na jedno tapnięcie** i pozwala
wylosować następną. Jest to najkrótsza możliwa droga od pytania „Co dziś jemy?”
do konkretnej odpowiedzi.

## Uzasadnienie

Wizja produktu ([product-vision.md](../product-vision.md)) obiecuje: „Nie musisz
wiedzieć, czego chcesz.” Dziś każda z trzech dróg wymaga jednak jakiegoś wejścia:
Mapa — ustawienia punktu, Wyszukiwarka — zapytania, Kategorie — wyboru opcji.
Brakuje drogi o zerowym wysiłku decyzyjnym.

Sekcja przechodzi „Filtr dla nowych funkcji” z wizji:

1. Pomaga szybciej zdecydować? Tak — daje wynik bez żadnego wejścia.
2. Zmniejsza liczbę decyzji? Tak — redukuje je do zera.
3. Działa w którejś z trzech dróg? Tak — jest odnogą stanu „nie wiem, czego
   chcę”, dziś obsługiwanego przez Mapę, ale bez wysiłku ustawiania punktu.
4. Prosty język? Tak.
5. Nie powiela istniejącego odkrywania? Tak — żadna droga nie zwraca wyniku bez
   wejścia użytkownika.

## Umiejscowienie

Sekcja jest ostatnią pełnoekranową sekcją strony głównej, pod sekcją Kategorii i
nad stopką. Obowiązuje ją reguła „jedna sekcja = jeden ekran” z
[ui-system.md](../../design/ui-system.md).

Kolejność sekcji strony głównej po zmianie:

1. Hero „Co dziś jemy?”
2. Trzy drogi (Mapa · Szukaj · Kategorie)
3. Kategorie (wybór i „Propozycje dla Ciebie”)
4. **„Zaskocz mnie”** (ta sekcja)

Umiejscowienie na końcu jest celowe: sekcja domyka narrację strony klamrą —
strona zaczyna się pytaniem, a kończy gotową odpowiedzią dla kogoś, kto nie
zdecydował samodzielnie.

## Struktura

Sekcja zawiera:

- nagłówek „Nie wiem, co wybrać?”,
- krótkie zdanie wprowadzające, np. „Zdaj się na los — podrzucimy jeden pomysł.”,
- jedną kartę propozycji dania,
- przycisk „Zaskocz mnie”, który losuje kolejną propozycję.

Karta korzysta ze wspólnego modelu propozycji dania opisanego w
[data-model.md](../../engineering/data-model.md) i jest wizualnie spójna z
kartami wyników pozostałych dróg. Cała karta prowadzi do `/recipes/:slug`, tak
samo jak w pozostałych drogach; zachowanie strony przepisu opisuje
[recipe-page.md](recipe-page.md).

## Reguły

- Przy wejściu na stronę sekcja pokazuje jedną wstępnie wybraną propozycję, aby
  nigdy nie była pusta.
- Losowany jest wyłącznie przepis o statusie `published`.
- Losowanie jest **ważone** polem `editorialPriority` z modelu (wyższy priorytet
  = większa szansa), aby propozycja pozostawała kuratorska, a nie czysto
  przypadkowa. Reguła wagi należy do dopasowania i jest opisana w
  [data-model.md](../../engineering/data-model.md).
- Każde użycie „Zaskocz mnie” zastępuje bieżącą propozycję nową. Kolejne
  losowanie POWINNO unikać natychmiastowego powtórzenia tej samej pozycji, jeśli
  pula dostępnych przepisów jest większa niż jeden.
- Sekcja nie przyjmuje ani nie zapamiętuje żadnych kryteriów użytkownika i jest
  niezależna od wyborów w Kategoriach oraz od stanu overlaya.
- Sekcja nie wymaga kont, historii ani trwałej personalizacji — mieści się w
  granicach danych prototypowych.

## Stany brzegowe

- **Jeden dostępny przepis:** karta pokazuje tę pozycję; przycisk pozostaje
  aktywny, ale losowanie nie zmienia wyniku. Dopuszczalne jest wizualne
  potwierdzenie akcji bez zmiany karty.
- **Brak przepisów `published`:** sekcja pokazuje spokojny komunikat zastępczy
  (np. „Chwilowo nie mamy propozycji.”) zamiast pustej karty; przycisk nie
  renderuje się jako pozornie działający.
- Sekcja jest odporna na błędy danych zgodnie z
  [quality-requirements.md](../../engineering/quality-requirements.md).

## Dostępność

- Karta i przycisk są dostępne z klawiatury i mają widoczny stan fokusu.
- Zmiana propozycji po losowaniu jest ogłaszana użytkownikom czytników ekranu
  (np. przez obszar `aria-live`), aby wynik nie był rozpoznawalny wyłącznie
  wzrokowo.
- Informacja nie może polegać wyłącznie na kolorze; obowiązują wspólne reguły z
  [ui-system.md](../../design/ui-system.md) i
  [quality-requirements.md](../../engineering/quality-requirements.md).

## Poza zakresem tej sekcji

- Wykluczanie lub filtrowanie propozycji według kryteriów (to rola Kategorii,
  Wyszukiwarki i Mapy).
- Zapamiętywanie historii wylosowanych propozycji między sesjami.
- Zapisywanie ulubionych i ocenianie propozycji (poza kierunkiem produktu).

## Otwarte decyzje

- Czy sekcja jest osobnym pełnoekranowym ekranem (rekomendowane, spójne z regułą
  „jedna sekcja = jeden ekran”), czy raczej wariantem pustego stanu ramki
  „Propozycje dla Ciebie” w Kategoriach (tańsze, ale słabiej wyróżnione).
- Dokładny kształt wagi losowania na bazie `editorialPriority` (np. proporcjonalna
  do wartości albo progowa) — do ustalenia w [data-model.md](../../engineering/data-model.md).
- Ostateczne brzmienie tekstów interfejsu (nagłówek, zdanie wprowadzające,
  etykieta przycisku, komunikaty zastępcze) po stronie słownika UI.

## Wpływ na inne źródła prawdy

Przy akceptacji propozycji należy:

- w [mvp-scope.md](../mvp-scope.md) rozstrzygnąć, czy sekcja wchodzi do MVP, i
  dopisać ją w odpowiedniej części zakresu;
- w [home-page.md](home-page.md) dodać sekcję do struktury strony głównej oraz do
  kryteriów akceptacji;
- w [data-model.md](../../engineering/data-model.md) opisać regułę ważonego
  losowania na podstawie `editorialPriority`;
- w słowniku UI (`src/i18n/locales/pl.ts`) dodać teksty sekcji.

## Kryteria akceptacji

- Sekcja jest ostatnią pełnoekranową sekcją strony głównej i nie jest wyższa niż
  ekran.
- Przy wejściu na stronę widoczna jest jedna propozycja; sekcja nigdy nie jest
  pusta, gdy istnieje co najmniej jeden przepis `published`.
- „Zaskocz mnie” zastępuje bieżącą propozycję inną pozycją, gdy pula liczy więcej
  niż jeden przepis.
- Losowane są wyłącznie przepisy `published`, z uwzględnieniem wagi
  `editorialPriority`.
- Cała karta prowadzi do `/recipes/:slug`.
- Sekcja działa niezależnie od wyborów w Kategoriach i od stanu overlaya.
- Przy braku przepisów `published` sekcja pokazuje komunikat zastępczy zamiast
  pustej karty i nie renderuje pozornie działającego przycisku.
- Sekcja jest dostępna z klawiatury, ogłasza zmianę propozycji czytnikom ekranu i
  nie polega wyłącznie na kolorze.
