# Zakres MVP

> Status: obowiązujący  
> Aktualizacja: przy zmianie granic etapu

## Cel MVP

MVP ma sprawdzić, czy trzy różne sposoby odkrywania dań pomagają użytkownikowi szybciej zdecydować, co zjeść.

Wizję produktu opisuje [product-vision.md](./product-vision.md).

## W zakresie

### Strona główna

- komunikat „Co dziś jemy?”,
- trzy równorzędne drogi: Mapa, Szukaj i Kategorie,
- sekcja wyboru kategorii,
- prezentacja kilku propozycji dań.

Szczegóły: [home-page.md](./features/home-page.md).

### Kategorie

Użytkownik wybiera po jednej opcji z trzech grup:

- pora dnia,
- tempo,
- okazja.

Nie ma domyślnych wyborów. Wyniki pojawiają się po wybraniu co najmniej jednej opcji w dowolnej grupie, a niewybrane grupy nie ograniczają filtrowania.

### Discovery overlay

Jeden wspólny overlay zawierający dwa przełączane tryby:

- wyszukiwarkę,
- mapę preferencji.

Szczegóły: [discovery-overlay.md](./features/discovery-overlay.md).

### Wyniki

Każda droga korzysta ze wspólnego modelu propozycji dania.

Karta wyniku zawiera co najmniej:

- zdjęcie,
- nazwę,
- czas przygotowania,
- od jednego do trzech tagów.

Opis modelu danych: [data-model.md](../engineering/data-model.md).

Cała karta prowadzi do `/recipes/:slug` — prerenderowanej strony przepisu prezentującej pola modelu `Recipe`. Zachowanie strony opisuje [recipe-page.md](./features/recipe-page.md).

### Jakość podstawowa

MVP musi być:

- responsywne,
- dostępne z klawiatury,
- czytelne bez polegania wyłącznie na kolorze,
- odporne na brak wyników i błędy danych.

Wymagania przekrojowe: [quality-requirements.md](../engineering/quality-requirements.md).

## Poza zakresem MVP

- konta użytkowników,
- logowanie,
- zapisywanie ulubionych,
- historia wyszukiwania,
- trwała personalizacja,
- komentarze i oceny,
- planowanie posiłków,
- lista zakupów,
- panel administracyjny,
- portal z artykułami,
- podstrona wyników Kategorii otwierana przez „Pokaż więcej”,
- zaawansowane filtrowanie,
- docelowy zestaw przykładowych przepisów i pełna treść redakcyjna przepisów (porcje, zdjęcia; prototypowe kroki są już w modelu),
- wiele wersji językowych.

W drugiej fazie „Pokaż więcej” prowadzi do podstrony Kategorii z filtrem odpowiadającym wyborom ze strony głównej. Dokładna trasa, zachowanie filtra i zakres wyników zostaną opisane razem z tą podstroną.

Bieżący prototyp może prowadzić z przycisku „Szczegółowe wyszukiwanie” do
jawnego, statycznego ekranu zastępczego. Nie oznacza to włączenia zaawansowanego
filtrowania do MVP ani ustalenia jego docelowego kontraktu.

Dobór reprezentatywnego zestawu przepisów pozostaje odłożony do rozstrzygnięcia źródła danych o daniach. Do tego czasu strona przepisu i pozostałe ścieżki korzystają wyłącznie z jawnie zastępczych danych prototypowych potrzebnych do sprawdzenia bieżących przepływów.

## Nierozstrzygnięte

Przed implementacją wymagają osobnej decyzji:

- źródło danych o daniach,
- produkcyjne strojenie mechanizmu dopasowywania i kolejności wyników ponad reguły startowe z `data-model.md`.

Agent nie powinien samodzielnie rozstrzygać tych punktów.

## Kryteria ukończenia MVP

MVP jest kompletne, gdy:

- każda z trzech dróg prowadzi do propozycji,
- kategorie nie mają domyślnych wyborów,
- co najmniej jeden wybór Kategorii pokazuje wyniki, a niewybrane grupy ich nie ograniczają,
- wyszukiwarka reaguje na zapytanie użytkownika,
- mapa startuje w neutralnym środku,
- przełączanie trybów zachowuje stan otwartego overlaya,
- zamknięcie overlaya resetuje jego sesję,
- wszystkie drogi korzystają ze wspólnego modelu danych,
- podstawowe stany pusty, ładowania i błędu są obsłużone, gdy odpowiadają rzeczywistemu źródłu danych; prototyp lokalny nie symuluje operacji asynchronicznych,
- wymagania jakościowe zostały sprawdzone.
