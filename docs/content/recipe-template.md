# Szablon przepisu

> Status: pomoc redakcyjna do skopiowania i wypełnienia
>
> Model normatywny: [data-model.md](../engineering/data-model.md)
>
> Prezentacja i zachowanie strony: [recipe-page.md](../product/features/recipe-page.md)

Skopiuj treść od sekcji „Przepis” do osobnego pliku i zastąp tekst w nawiasach
kwadratowych. Nie usuwaj wymaganych sekcji. Sekcje oznaczone jako opcjonalne
można pominąć w całości.

---

# Przepis: [pełna nazwa dania]

## Dane podstawowe

- **ID:** `[stabilny unikalny identyfikator, np. recipe_001]`
- **Slug:** `[adresowa-nazwa-przepisu]`
- **Status:** `[draft | published | archived]`
- **Priorytet redakcyjny:** `[liczba; wyższa oznacza wcześniejsze miejsce przy podobnym dopasowaniu]`

## Tytuł i opis

- **Tytuł:** [krótka, naturalna nazwa dania]
- **Opis:** [jedno lub dwa zdania opisujące smak, charakter i najważniejsze cechy dania]
- **Czas przygotowania:** [dodatnia liczba minut]
- **Trudność:** `[easy | medium | hard]`
- **Bazowa liczba porcji:** `[liczba całkowita od 1 do 12]`

## Zdjęcie

Jeśli zdjęcie nie jest jeszcze dostępne, wpisz `null` i pomiń ścieżkę oraz tekst
alternatywny.

- **Ścieżka do zdjęcia:** `[np. /images/recipes/nazwa-przepisu.webp | null]`
- **Tekst alternatywny:** [krótki opis tego, co rzeczywiście widać na zdjęciu]

## Tagi

Wpisz tagi w kolejności ważności. Pierwsze z nich będą prezentowane jako
najważniejsze.

1. [tag]
2. [tag]
3. [tag]

## Składniki

Każdy składnik musi mieć kategorię zakupową, dodatnią ilość i jednostkę `g`,
`ml` albo `szt`. Dozwolone kategorie to `produce`, `meat`, `dairy`, `grains`,
`pantry` i `spices`; ich znaczenie definiuje
[data-model.md](../engineering/data-model.md).
`gramsPerCup` jest opcjonalne i oznacza masę jednej szklanki 250 ml; uzupełnij
je tylko wtedy, gdy masa składnika sypkiego ma być przeliczana na objętościowe
miary domowe. Dla produktu mającego naturalną miarę możesz podać opcjonalne
`household` w postaci `{ "unit": "slice", "metricAmount": 8 }`, co oznacza,
że jeden plaster odpowiada 8 jednostkom bazowym (tu: 8 g). Dozwolone wartości
`unit` to `cup`, `tablespoon`, `teaspoon`, `pinch`, `piece`, `slice`,
`bread_slice` i `handful`. `household` stosuj tylko przy bazowej jednostce `g`
albo `ml`; `szt` już jest miarą naturalną. Wszystkie ilości podaj dla bazowej
liczby porcji wskazanej wyżej.

Strona przepisu nie ma przełącznika jednostek — o formie miary decydujesz przy
każdym składniku osobno w opcjonalnym `measure`: `metric` (sama forma
metryczna), `household` (sama forma domowa) albo `both` (obie, pokazywane jako
`80 g / 10 plastrów`). Pominięcie pola daje formę metryczną. `household` i
`both` wybieraj tylko tam, gdzie forma domowa naprawdę pomaga i wychodzi
okrągła: pisz `4 kromki` albo `2 szczypty`, ale zostaw gramy, gdy przelicznik
dałby wynik w rodzaju `0,6 łyżeczki`. Obie formy wymagają przelicznika
(`household`, `gramsPerCup` albo jednostka `ml`).

| Kategoria zakupowa | Nazwa składnika | Ilość | Jednostka (`g` / `ml` / `szt`) | `gramsPerCup` (opcjonalne) | `household` (opcjonalne) | `measure` (opcjonalne) |
|---|---|---:|---|---:|---|---|
| [kategoria] | [składnik] | [ilość] | [jednostka] | [wartość lub pomiń] | [np. `{ "unit": "slice", "metricAmount": 8 }` lub pomiń] | [`metric` / `household` / `both` lub pomiń] |
| [kategoria] | [składnik] | [ilość] | [jednostka] | [wartość lub pomiń] | [wartość lub pomiń] | [wartość lub pomiń] |
| [kategoria] | [składnik] | [ilość] | [jednostka] | [wartość lub pomiń] | [wartość lub pomiń] | [wartość lub pomiń] |

## Zanim zaczniesz — opcjonalne

Dodaj jedną wspólną listę czynności wspierających gotowanie. Każdej przypisz
`timing`: `day_before`, gdy można ją bezpiecznie zakończyć nawet dzień wcześniej
i przechować zgodnie z opisem, albo `just_in_time`, gdy należy ją wykonać tuż
przed właściwym gotowaniem lub w jego trakcie. Nadaj jej unikalne `id`, zapisz
bezpośrednią instrukcję półkroku w `stepText` i wskaż w `beforeStep` numer kroku
`steps`, przed którym ma się pojawić, jeśli użytkownik nie odhaczy jej w panelu.

| `id` | Tekst w panelu (`text`) | Tekst półkroku (`stepText`) | `timing` | `beforeStep` |
|---|---|---|---|---:|
| [unikalny-identyfikator] | [co można przygotować i przechować wcześniej] | [co zrobić teraz, jeśli nie odhaczono] | `day_before` | [numer kroku] |
| [unikalny-identyfikator] | [co zrobić na świeżo] | [bezpośrednia instrukcja] | `just_in_time` | [numer kroku] |

## Kroki

Każdy punkt powinien opisywać jedną wyraźną czynność. Kolejność poniżej jest
kolejnością prezentowaną użytkownikowi. Pisz te kroki tak, jakby sekcja
„Zanim zaczniesz” była już wykonana — to wersja dla „Trybu
asystenta”, który pokazuje je obok kroków.

1. [pierwszy krok]
2. [drugi krok]
3. [kolejny krok]

## Kroki samodzielne — wymagane przy „Zanim zaczniesz”

Wypełnij tę sekcję dokładnie wtedy, gdy przepis ma sekcję „Zanim zaczniesz”.
W trybie „Tylko kroki” ta sekcja jest ukryta, więc poniższa
wersja MUSI sama nieść wszystko, co powyżej zostało z nich założone: krojenie,
namoczenie, odsączenie, przygotowanie sprzętu. Nie kopiuj listy powyżej —
przepisz ją, wplatając brakujące czynności. Wersja samodzielna może mieć inną
liczbę kroków. Przepis bez tych sekcji tej listy nie ma.

1. [pierwszy krok wersji samodzielnej]
2. [drugi krok wersji samodzielnej]
3. [kolejny krok wersji samodzielnej]

## Coś jeszcze — opcjonalne

Dodaj tę sekcję tylko dla krótkich porad uzupełniających kroki: wskazówek
dotyczących techniki, typowych błędów albo sposobu uzyskania lepszego efektu.

1. [porada]
2. [porada]

## Dopasowanie do sposobów odkrywania

Wybierz co najmniej jedną wartość w grupach Pora dnia i Tempo. Grupa Okazja
może pozostać pusta, jeśli danie nie ma dedykowanej okazji. Można zaznaczyć
kilka wartości.

### Pora dnia (`mealTimes`)

- [ ] `breakfast` — śniadanie
- [ ] `lunch` — obiad
- [ ] `dinner` — kolacja

### Tempo (`tempos`)

- [ ] `now` — na już
- [ ] `today` — na dziś
- [ ] `two_days` — na dwa dni

### Okazja (`occasions`)

- [ ] `kids` — dla dzieci
- [ ] `guests` — dla gości
- [ ] `grill` — na grilla

### Pozycja na Mapie (`mapPosition`)

Obie wartości mieszczą się w zakresie od `0` do `1`. Znaczenie osi i reguły
rankingu definiuje [data-model.md](../engineering/data-model.md#mapa).

- **Tempo (`pace`):** `[0 = szybko, 0.5 = neutralnie, 1 = bez pośpiechu]`
- **Charakter (`lightness`):** `[0 = konkretnie, 0.5 = neutralnie, 1 = lekko]`

## Kontrola przed przekazaniem

- [ ] ID i slug są unikalne.
- [ ] Tytuł i opis są naturalne oraz napisane po polsku.
- [ ] Czas jest dodatnią liczbą całkowitą.
- [ ] Trudność ma jedną z dozwolonych wartości, a bazowa liczba porcji mieści się w zakresie `1–12`.
- [ ] Każdy składnik ma kategorię zakupową, dodatnią ilość i dozwoloną jednostkę.
- [ ] Opcjonalny przelicznik `household` ma dozwoloną jednostkę, dodatnie `metricAmount` i występuje wyłącznie przy bazowej jednostce `g` albo `ml`.
- [ ] Opcjonalne `measure` ma wartość `metric`, `household` albo `both`, a formy z miarą domową mają przelicznik i dają czytelną ilość.
- [ ] Przepis ma co najmniej jeden tag i jeden krok.
- [ ] Każda czynność w „Zanim zaczniesz” ma unikalne `id`, właściwe `timing`, zwięzłe `stepText` oraz `beforeStep` wskazujące najlepszy moment przed istniejącym krokiem.
- [ ] Przepis z sekcją „Zanim zaczniesz” ma wypełnione kroki samodzielne, a przepis bez tej sekcji ich nie ma.
- [ ] Kroki samodzielne są innym tekstem niż kroki podstawowe i nie gubią żadnej czynności z „Zanim zaczniesz”.
- [ ] Opcjonalne porady są niepuste albo sekcja „Coś jeszcze” została pominięta.
- [ ] Grupy pora dnia (`mealTimes`) i tempo (`tempos`) mają co najmniej jedną wartość.
- [ ] Wartości Mapy mieszczą się w zakresie `0–1`.
- [ ] Zdjęcie ma opis alternatywny albo jest jawnie oznaczone jako `null`.
- [ ] Opcjonalne sekcje są całkowicie uzupełnione albo całkowicie pominięte.
- [ ] Status pozostaje `draft`, dopóki treść nie jest gotowa do publikacji.
