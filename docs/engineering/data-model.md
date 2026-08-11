# Model danych MVP

> Status: obowiązujący model koncepcyjny  
> Aktualizacja: przy zmianie informacji o przepisie lub reguł dopasowania

## Cel

Jeden model `Recipe` zasila Kategorie, Szukaj i Mapę. Dzięki temu wszystkie ścieżki pokazują te same dania i używają wspólnej karty wyniku.

Dokument definiuje znaczenie danych, nie bazę danych, API ani język programowania.

## W zakresie

- pola przepisu i kontrolowane słowniki;
- reguły filtrowania oraz rankingu;
- wymagania integralności danych.

## Poza zakresem

- schemat bazy i migracje;
- protokół API, cache i autoryzacja;
- panel redakcyjny i import danych.

## Encja `Recipe`

| Pole | Typ koncepcyjny | Wymaganie |
|---|---|---|
| `id` | string | stabilny, unikalny identyfikator |
| `slug` | string | unikalny adresowy identyfikator |
| `title` | string | wymagany, po polsku |
| `description` | string | krótki opis dania |
| `image` | ImageReference \| null | zdjęcie i tekst alternatywny; `null` oznacza użycie wspólnego placeholdera |
| `preparationMinutes` | integer | dodatnia liczba minut |
| `difficulty` | Difficulty | kontrolowany poziom trudności |
| `servings` | integer | bazowa liczba porcji od `1` do `12` |
| `ingredients` | Ingredient[] | składniki z ilością metryczną dla bazowej liczby porcji i opcjonalnym przelicznikiem naturalnej miary domowej; `name` zasila wyszukiwanie |
| `preparation` | PreparationStep[] \| — | opcjonalna lista czynności z sekcji „Zanim zaczniesz”; każda wskazuje, czy można ją wykonać dzień wcześniej, czy tuż przed gotowaniem lub w trakcie |
| `steps` | string[] | co najmniej jeden krok właściwego gotowania, pisany tak, jakby etapy wspierające były już wykonane; kolejność określa numerację na stronie przepisu |
| `stepsOnly` | string[] \| — | samodzielna wersja kroków dla trybu „Tylko kroki”; wymagana dokładnie wtedy, gdy istnieje `preparation` |
| `tips` | string[] \| — | opcjonalne porady redakcyjne pokazywane po krokach; jeśli pole istnieje, ma co najmniej jedną poradę |
| `tags` | string[] | co najmniej jedna cecha smaku, diety lub sytuacji; kolejność określa priorytet prezentacji |
| `mealTimes` | MealTime[] | co najmniej jedna pora dnia |
| `tempos` | Tempo[] | co najmniej jedno tempo |
| `occasions` | Occasion[] | co najmniej jedna okazja |
| `mapPosition` | MapPosition | dwie znormalizowane wartości |
| `editorialPriority` | number | rozstrzyganie podobnych wyników |
| `status` | status | `draft`, `published` albo `archived` |

### Słowniki MVP

```text
MealTime = breakfast | lunch | dinner
Tempo = now | today | two_days
Occasion = kids | guests | grill
Difficulty = easy | medium | hard
MapPosition = { pace: 0..1, lightness: 0..1 }
ImageReference = { src: string, alt: string }
IngredientUnit = g | ml | szt
IngredientCategory = produce | meat | dairy | grains | pantry | spices
HouseholdUnit = cup | tablespoon | teaspoon | pinch | piece | slice | bread_slice | handful
HouseholdConversion = { unit: HouseholdUnit, metricAmount: number > 0 }
MeasureDisplay = metric | household | both
Ingredient = { category: IngredientCategory, name: string, amount: number > 0, unit: IngredientUnit, gramsPerCup?: number > 0, household?: HouseholdConversion, measure?: MeasureDisplay }
PreparationTiming = day_before | just_in_time
PreparationStep = { text: string, timing: PreparationTiming }
```

- `preparation` jest jedynym źródłem czynności wspierających gotowanie. `timing: day_before` oznacza czynność, którą można bezpiecznie zakończyć nawet dzień wcześniej i przechować zgodnie z opisem; `timing: just_in_time` oznacza czynność wykonywaną tuż przed właściwym gotowaniem albo w jego trakcie. Brak pola oznacza przepis bez sekcji „Zanim zaczniesz”. Pole obecne MUSI mieć co najmniej jeden element.
- `steps` i `stepsOnly` to dwie wersje tych samych kroków, a nie ta sama treść pokazana dwa razy. `steps` prowadzi przez gotowanie przy założeniu, że czynności z `preparation` zostały wykonane, więc może pomijać krojenie, namoczenie lub przygotowanie sprzętu. `stepsOnly` jest wersją samodzielną dla trybu „Tylko kroki”, w którym „Zanim zaczniesz” jest ukryte, więc MUSI nieść wszystko, co `steps` z tej sekcji założyło — także wtedy, gdy wymaga to innej liczby kroków.
- `stepsOnly` istnieje dokładnie wtedy, gdy istnieje `preparation`. Brak pola przy przygotowaniach jest błędem danych, bo tryb „Tylko kroki” gubiłby wtedy część pracy. Pole przy przepisie bez przygotowań jest błędem danych, bo taki przepis nie ma przełącznika trybu, a druga lista rozjechałaby się z `steps` bez możliwości zauważenia tego w UI.
- `tips` jest opcjonalną listą krótkich porad uzupełniających właściwe kroki. Brak pola oznacza brak sekcji „Coś jeszcze”; pusta tablica jest błędem danych.

- `pace: 0` oznacza „szybko”, a `pace: 1` — „bez pośpiechu”.
- `lightness: 0` oznacza „konkretnie”, a `lightness: 1` — „lekko”.
- Punkt `(0.5, 0.5)` jest neutralnym środkiem mapy.
- Miarą bazową składnika jest zawsze wartość metryczna (`g`, `ml` albo `szt`). Formę domową (szklanki/łyżki/łyżeczki/szczypta) wyliczamy z miary metrycznej — nie jest osobno przechowywana, aby obie prezentacje nie mogły się rozjechać.
- `category` przypisuje składnik do kontrolowanej grupy zakupowej: warzywa i owoce (`produce`), mięso i wędliny (`meat`), nabiał i jajka (`dairy`), pieczywo i produkty zbożowe (`grains`), produkty spiżarniane (`pantry`) albo przyprawy (`spices`). Strona przepisu prezentuje wyłącznie grupy obecne w danym przepisie, zawsze w tej kolejności.
- `gramsPerCup` (gramy na szklankę 250 ml) jest opcjonalną gęstością składnika sypkiego; pozwala przeliczyć masę na miarę domową. Bez niej masa (`g`) pozostaje w gramach, bo dla wielu produktów miara domowa nie ma sensu.
- `household` opisuje naturalną miarę produktu ważonego lub odmierzanego objętościowo, np. plaster, kromkę albo garść. `metricAmount` oznacza ilość bazowej jednostki `g`/`ml` przypadającą na jedną taką miarę. Ilość domowa jest zawsze wyliczana jako `amount / metricAmount`, więc skaluje się razem z porcjami i nie stanowi drugiego niezależnego źródła ilości.
- Jeżeli składnik ma `household`, ta naturalna miara ma pierwszeństwo przy wyliczaniu formy domowej. Dla pozostałych składników obowiązuje dotychczasowe przeliczenie `ml` oraz `gramsPerCup`; masa bez żadnego bezpiecznego przelicznika pozostaje w gramach. `household` nie jest dozwolone dla `unit: szt`, które już jest naturalną miarą.
- `measure` to redakcyjny wybór formy miary pokazywanej przy składniku: `metric` (sama forma metryczna), `household` (sama forma domowa) albo `both` (obie, rozdzielone ukośnikiem, w kolejności `metryczna / domowa`). Pominięcie pola oznacza `metric`. Lista składników jest więc celowo mieszana — o formie decyduje pojedynczy składnik, a nie ustawienie całej strony.
- `measure` inne niż `metric` wymaga przelicznika, z którego da się wyliczyć formę domową: pola `household`, `gramsPerCup` albo jednostki `ml`. Dla `unit: szt` i dla masy bez przelicznika obie formy byłyby identyczne, więc taki wybór jest błędem danych.
- Ilości w `ingredients` odpowiadają liczbie `servings`. Zmiana liczby porcji na stronie skaluje każdą ilość przez iloraz `wybrane porcje / servings`; nie zmienia danych przepisu ani nie jest zapisywana między wizytami.

## Przykład

```json
{
  "id": "recipe_001",
  "slug": "kurczak-z-grilla-z-salatka",
  "title": "Kurczak z grilla z sałatką",
  "description": "Soczysty kurczak z grilla i świeża sałatka.",
  "image": {
    "src": "/images/recipes/kurczak-z-grilla.webp",
    "alt": "Grillowany kurczak podany na zielonej sałatce"
  },
  "preparationMinutes": 25,
  "difficulty": "easy",
  "servings": 2,
  "ingredients": [
    { "category": "meat", "name": "kurczak", "amount": 400, "unit": "g" },
    { "category": "produce", "name": "sałata", "amount": 1, "unit": "szt" },
    { "category": "pantry", "name": "oliwa", "amount": 30, "unit": "ml" }
  ],
  "preparation": [
    { "text": "Kurczaka natrzyj oliwą, solą i przyprawami i zamarynuj w lodówce.", "timing": "day_before" },
    { "text": "Sałatę i pomidory umyj oraz osusz.", "timing": "just_in_time" },
    { "text": "Przygotuj deskę, nóż i szczypce do grilla.", "timing": "just_in_time" }
  ],
  "steps": [
    "Grilluj kurczaka po 6–7 minut z każdej strony.",
    "Podawaj na świeżej sałatce."
  ],
  "stepsOnly": [
    "Kurczaka natrzyj oliwą, solą i przyprawami i odstaw na co najmniej 2 godziny do zamarynowania.",
    "Sałatę i pomidory umyj oraz osusz, a następnie przygotuj deskę, nóż i szczypce do grilla.",
    "Grilluj kurczaka po 6–7 minut z każdej strony.",
    "Podawaj na świeżej sałatce."
  ],
  "tips": [
    "Po grillowaniu odstaw mięso na kilka minut przed pokrojeniem."
  ],
  "tags": ["grill", "lekko"],
  "mealTimes": ["lunch"],
  "tempos": ["now", "today"],
  "occasions": ["guests", "grill"],
  "mapPosition": { "pace": 0.25, "lightness": 0.75 },
  "editorialPriority": 80,
  "status": "published"
}
```

## Reguły dopasowania

### Kategorie

- Użytkownik może wybrać maksymalnie po jednej wartości z `MealTime`, `Tempo` i `Occasion`.
- Interfejs Kategorii pokazuje wyniki po wybraniu co najmniej jednej wartości w dowolnej grupie.
- Od pierwszego wyboru każda zmiana natychmiast przelicza wyniki. Usunięcie ostatniego wyboru przywraca stan początkowy i ukrywa listę wyników.
- Przepis pasuje do wszystkich aktualnie wybranych wartości — operator AND pomiędzy uzupełnionymi grupami.
- Brak wyboru w danej grupie nie ogranicza filtrowania. Dopiero brak wyborów we wszystkich grupach pokazuje stan początkowy bez wyników i bez udawanych preferencji.
- Wyniki sortujemy najpierw według jakości dopasowania, następnie `editorialPriority`.
- Nie ma domyślnych wyborów. Zaznaczenia widoczne na makiecie są przykładowym stanem po interakcji.

### Szukaj

- Zapytanie jest normalizowane: małe litery, obcięte spacje i tolerancja polskich znaków.
- Ranking startowy: tytuł > składniki > tagi > opis.
- Dopasowanie nie może wymagać znajomości fachowego nazewnictwa.
- Puste zapytanie nie uruchamia wyszukiwania; krótkie sugestie mogą prowadzić do gotowego zapytania.
- Wyniki są przeliczane po każdej zmianie treści. Implementacja może zastosować opóźnienie około `200ms`, jeżeli nie zmienia to odczucia wyszukiwania na żywo.

### Mapa

- Pozycja kursora jest parą `pace` i `lightness` w zakresie `0..1`.
- Podstawowy ranking wynika z odległości euklidesowej od `mapPosition` przepisu.
- W środku `(0.5, 0.5)` zwracane są od trzech do czterech unikalnych propozycji bez preferowania skrajności. Wyniki są wybierane według `editorialPriority`, z warunkiem różnorodności: jeżeli katalog pozwala utworzyć listę tej samej długości obejmującą wszystkie trzy wartości `MealTime`, lista MUSI je reprezentować.
- `editorialPriority` rozstrzyga wyniki o podobnej odległości; lista nie powinna zawierać prawie identycznych dań.
- Wyniki i wartości procentowe są aktualizowane podczas przeciągania punktu, bez dodatkowego zatwierdzania.

## Integralność danych

- Tylko `published` może pojawić się użytkownikowi.
- `slug`, `id`, czas, trudność, bazowa liczba porcji, słowniki i obecność co najmniej jednego tagu MUSZĄ być walidowane przed publikacją.
- Karta pokazuje od jednego do trzech pierwszych tagów zgodnie z kolejnością zapisaną w `tags`; pozostałe tagi nadal mogą uczestniczyć w wyszukiwaniu.
- Każdy przepis MUSI mieć komplet danych potrzebny co najmniej jednej ścieżce oraz kartę możliwą do wyrenderowania bez dodatkowych wyjątków.
- Nieznana wartość słownika jest błędem danych, a nie nową kategorią tworzoną automatycznie.
- Opcjonalne `household` MUSI mieć znaną wartość `HouseholdUnit` i dodatnie `metricAmount`; może wystąpić tylko przy bazowej jednostce `g` albo `ml`.
- Opcjonalne `measure` MUSI mieć wartość `metric`, `household` albo `both`; formy `household` i `both` są dozwolone wyłącznie przy dostępnym przeliczniku formy domowej.
- `image` może mieć wartość `null`; brak obrazu nie może blokować wyniku, a UI używa wtedy wspólnego placeholdera.
- `preparation` jest opcjonalne; gdy występuje, każdy element ma niepusty `text` i znane `timing` (`day_before` albo `just_in_time`). Pusta tablica jest błędem danych — brak sekcji wyrażamy pominięciem pola.
- `stepsOnly` jest opcjonalne, ale związane z przygotowaniami: MUSI wystąpić, gdy istnieje `preparation`, i NIE MOŻE wystąpić w przeciwnym przypadku. Gdy występuje, każdy krok jest niepusty; pusta tablica jest błędem danych.
- `tips` jest opcjonalne; gdy występuje, każda porada jest niepusta. Pusta tablica jest błędem danych — brak porad wyrażamy pominięciem pola.
- Jeżeli `image` istnieje, `src` i opisujący danie `alt` MUSZĄ być niepustymi wartościami. Placeholder dla `image: null` jest dekoracyjny i nie powiela dostępnej nazwy przepisu.

## Weryfikacja i ukończenie

| Sprawdzenie | Kryterium |
|---|---|
| walidacja przykładu | dane spełniają wszystkie wymagane typy i zakresy |
| obraz przepisu | poprawny `ImageReference` jest akceptowany, `null` uruchamia placeholder, a niepełny `ImageReference` jest odrzucany |
| naturalne miary domowe | `household` przelicza skalowaną ilość metryczną na kontrolowaną miarę; nieznana miara, niedodatnie `metricAmount` i użycie przy `szt` są odrzucane |
| forma miary składnika | `measure` decyduje o pokazanej formie (metryczna, domowa albo obie z ukośnikiem); brak pola daje formę metryczną, a forma domowa bez przelicznika jest odrzucana |
| przygotowanie do gotowania | `preparation` przyjmuje wyłącznie niepuste czynności przypisane do `day_before` albo `just_in_time` |
| samodzielna wersja kroków | `stepsOnly` jest wymagane przy `preparation`, odrzucane bez niego i odrzucane jako pusta tablica |
| spójność ścieżek | ten sam przepis może być użyty w Kategoriach, Szukaj i Mapie |
| filtr kategorii | co najmniej jeden wybór pokazuje wyniki zawierające wszystkie aktualnie wybrane wartości; każda zmiana odświeża wyniki, a usunięcie ostatniego wyboru je ukrywa |
| wyszukiwanie na żywo | zmiana treści pola automatycznie przelicza wyniki |
| przeciąganie mapy | ruch punktu aktualizuje wartości i kolejność wyników bez zatwierdzania |
| neutralna mapa | środek zwraca od trzech do czterech unikalnych propozycji i, gdy pozwala na to katalog, reprezentuje wszystkie trzy wartości `MealTime` |
| błędne dane | rekord nie trafia do widoku użytkownika, a błąd jest raportowany |

Model jest gotowy do implementacji, gdy wybrany stos techniczny posiada jedną walidowaną reprezentację `Recipe`, współdzieloną przez wszystkie ścieżki.
