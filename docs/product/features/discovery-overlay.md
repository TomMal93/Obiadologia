# Overlay Wyszukiwarki i Mapy

> Status: obowiązujący  
> Makiety: `search-overlay.png`, `map-overlay.png`

# Discovery overlay

## Cel

Discovery overlay łączy wyszukiwarkę i mapę preferencji w jednym komponencie z dwoma przełączanymi trybami.

Wspólne reguły wizualne opisuje [ui-system.md](../../design/ui-system.md).

## Wspólna powłoka

Overlay zawiera:

- logo,
- przycisk zamknięcia,
- przełącznik „Wyszukiwarka / Mapa”,
- obszar właściwy dla aktywnego trybu,
- listę propozycji.

Zmiana trybu nie zamyka overlaya i nie powinna powodować skoku całego układu.

## Cykl życia stanu

- Overlay otwiera się w trybie wskazanym przez akcję użytkownika.
- Wyszukiwarka i mapa posiadają oddzielny stan.
- Przełączenie trybu zachowuje stan obu trybów.
- Zamknięcie overlaya kończy sesję i resetuje jego stan.
- Ponowne otwarcie rozpoczyna nową sesję.

## Tryb wyszukiwarki

### Cel

Użytkownik wpisuje składnik, nazwę dania, smak lub tag.

### Elementy

- nagłówek „Masz trop? Wpisz go tutaj”,
- opis „Składnik, danie, smak albo tag.”,
- pole wyszukiwania,
- dynamiczne sugestie,
- lista propozycji.

### Zachowanie

- Zapytanie jest kontrolowane przez użytkownika.
- Sugestia może uzupełnić lub zmienić zapytanie.
- Wyniki odpowiadają aktualnemu zapytaniu.
- Puste zapytanie nie może udawać wyników wyszukiwania.
- Brak dopasowań pokazuje czytelny stan pusty.
- Próg rozpoczęcia wyszukiwania i sposób rankingowania wymagają decyzji implementacyjnej.

## Tryb mapy

### Cel

Użytkownik wskazuje preferencję na mapie dwóch osi.

### Osie

Oś pozioma:

- `x = 0`: szybko,
- `x = 50`: neutralnie,
- `x = 100`: bez pośpiechu.

Oś pionowa:

- `y = 0`: lekko,
- `y = 50`: neutralnie,
- `y = 100`: konkretnie.

### Stan początkowy

Mapa rozpoczyna w punkcie:

```text
x = 50
y = 50