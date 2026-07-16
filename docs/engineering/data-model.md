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
| `image` | image reference | zdjęcie i tekst alternatywny |
| `preparationMinutes` | integer | dodatnia liczba minut |
| `ingredients` | string[] | nazwy składników do wyszukiwania |
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
MapPosition = { pace: 0..1, lightness: 0..1 }
```

- `pace: 0` oznacza „szybko”, a `pace: 1` — „bez pośpiechu”.
- `lightness: 0` oznacza „konkretnie”, a `lightness: 1` — „lekko”.
- Punkt `(0.5, 0.5)` jest neutralnym środkiem mapy.

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
  "ingredients": ["kurczak", "sałata", "pomidor"],
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
- `slug`, `id`, czas, słowniki i obecność co najmniej jednego tagu MUSZĄ być walidowane przed publikacją.
- Karta pokazuje od jednego do trzech pierwszych tagów zgodnie z kolejnością zapisaną w `tags`; pozostałe tagi nadal mogą uczestniczyć w wyszukiwaniu.
- Każdy przepis MUSI mieć komplet danych potrzebny co najmniej jednej ścieżce oraz kartę możliwą do wyrenderowania bez dodatkowych wyjątków.
- Nieznana wartość słownika jest błędem danych, a nie nową kategorią tworzoną automatycznie.
- Brak obrazu nie może blokować wyniku; UI używa wspólnego placeholdera.

## Weryfikacja i ukończenie

| Sprawdzenie | Kryterium |
|---|---|
| walidacja przykładu | dane spełniają wszystkie wymagane typy i zakresy |
| spójność ścieżek | ten sam przepis może być użyty w Kategoriach, Szukaj i Mapie |
| filtr kategorii | co najmniej jeden wybór pokazuje wyniki zawierające wszystkie aktualnie wybrane wartości; każda zmiana odświeża wyniki, a usunięcie ostatniego wyboru je ukrywa |
| wyszukiwanie na żywo | zmiana treści pola automatycznie przelicza wyniki |
| przeciąganie mapy | ruch punktu aktualizuje wartości i kolejność wyników bez zatwierdzania |
| neutralna mapa | środek zwraca od trzech do czterech unikalnych propozycji i, gdy pozwala na to katalog, reprezentuje wszystkie trzy wartości `MealTime` |
| błędne dane | rekord nie trafia do widoku użytkownika, a błąd jest raportowany |

Model jest gotowy do implementacji, gdy wybrany stos techniczny posiada jedną walidowaną reprezentację `Recipe`, współdzieloną przez wszystkie ścieżki.
