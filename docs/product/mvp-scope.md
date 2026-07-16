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

Nie ma domyślnych wyborów. Wyniki pojawiają się po uzupełnieniu wszystkich trzech grup.

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

Cała karta prowadzi do `/recipes/:slug`. Do czasu powstania właściwej strony przepisu trasa pokazuje prosty ekran zastępczy z możliwością powrotu.

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
- zaawansowane filtrowanie,
- wiele wersji językowych.

## Nierozstrzygnięte

Przed implementacją wymagają osobnej decyzji:

- źródło danych o daniach,
- liczba wszystkich dań w początkowym zbiorze,
- sposób działania przycisku „Pokaż więcej”,
- produkcyjne strojenie mechanizmu dopasowywania i kolejności wyników ponad reguły startowe z `data-model.md`.

Agent nie powinien samodzielnie rozstrzygać tych punktów.

## Kryteria ukończenia MVP

MVP jest kompletne, gdy:

- każda z trzech dróg prowadzi do propozycji,
- kategorie nie mają domyślnych wyborów,
- wyszukiwarka reaguje na zapytanie użytkownika,
- mapa startuje w neutralnym środku,
- przełączanie trybów zachowuje stan otwartego overlaya,
- zamknięcie overlaya resetuje jego sesję,
- wszystkie drogi korzystają ze wspólnego modelu danych,
- podstawowe stany pusty, ładowania i błędu są obsłużone, gdy odpowiadają rzeczywistemu źródłu danych; prototyp lokalny nie symuluje operacji asynchronicznych,
- wymagania jakościowe zostały sprawdzone.
