# Overlay Wyszukiwarki

> Status: obowiązujący  
> Właściciel: właściciel produktu  
> Opisywany stan: docelowy dla MVP  
> Ostatnia aktualizacja: 2026-07-15

## Cel

Wyszukiwarka jest przeznaczona dla użytkownika, który ma już trop: składnik, nazwę dania, smak, kategorię albo tag.

Zapytanie nie musi być pełną ani dokładną nazwą przepisu.

## Materiał referencyjny

- [Overlay Wyszukiwarki](../../assets/ui/search-overlay.png)

Makieta określa hierarchię, treści i kierunek wizualny. Przykładowe zapytania i wyniki nie definiują algorytmu wyszukiwania.

## W zakresie

- otwieranie i zamykanie overlayu,
- przełączanie między Wyszukiwarką i Mapą,
- pole wyszukiwania,
- dynamiczne podpowiedzi,
- dynamiczna lista wyników,
- stany ładowania, braku wyników i błędu.

## Poza zakresem

- algorytm rankingu wyników,
- konkretna technologia wyszukiwania,
- szczegóły przepisu po kliknięciu karty,
- historia wyszukiwania,
- zapisywanie zapytań na koncie użytkownika,
- wyszukiwanie głosowe.

## Wspólny szkielet overlayu

Overlay:

- zajmuje cały dostępny ekran,
- zawiera logo i nazwę „Obiadologia”,
- zawiera przycisk zamknięcia,
- zawiera przełącznik „Wyszukiwarka” i „Mapa”,
- blokuje przewijanie strony znajdującej się pod nim,
- nie zmienia gwałtownie położenia wspólnych elementów podczas przełączania trybu.

Otwarcie przez przycisk „Szukaj” aktywuje Wyszukiwarkę.

Przełączenie na Mapę nie zamyka overlayu. Zapytanie i wyniki Wyszukiwarki pozostają zachowane do czasu zamknięcia overlayu.

Przycisk zamknięcia oraz klawisz `Escape` zamykają overlay. Po zamknięciu fokus wraca do elementu, który go otworzył.

## Treści

Wyszukiwarka używa następujących treści:

- nagłówek: „Masz trop? Wpisz go tutaj”,
- podtytuł: „Składnik, danie, smak albo tag.”,
- placeholder: „np. kurczak, curry, szybko, bez mięsa”,
- nagłówek wyników: „Propozycje”.

Widoczna etykieta lub dostępna nazwa pola brzmi „Szukaj przepisu”.

## Stan początkowy

Po otwarciu Wyszukiwarki:

- pole jest puste,
- fokus znajduje się w polu,
- podpowiedzi nie są widoczne,
- lista wyników nie jest widoczna,
- użytkownik widzi placeholder wyjaśniający obsługiwane zapytania.

Wyszukiwarka nie pokazuje przypadkowych wyników przed wpisaniem zapytania.

## Wpisywanie zapytania

Wyniki i podpowiedzi aktualizują się po zmianie zapytania, bez przeładowania strony i bez przycisku „Szukaj”.

Wartość opóźnienia mechanizmu debounce jest decyzją techniczną i nie jest określona w tym dokumencie.

Przed wyszukaniem usuwane są spacje z początku i końca zapytania.

Wyszukiwanie nie rozróżnia wielkości liter.

Starsza odpowiedź nie może nadpisać wyników dla nowszego zapytania.

Usunięcie całej treści przywraca stan początkowy.

## Podpowiedzi

Podpowiedzi:

- pojawiają się po rozpoczęciu wpisywania,
- są powiązane z aktualnym zapytaniem,
- mogą reprezentować danie, składnik, smak, kategorię albo tag,
- są prezentowane jako krótkie chipy,
- są dostępne z klawiatury.

Wybranie podpowiedzi ustawia jej wartość jako aktywne zapytanie i odświeża wyniki.

Chipy nie działają jako zestaw filtrów wielokrotnego wyboru. W danym momencie aktywne jest jedno zapytanie.

## Wyniki

Po otrzymaniu wyników pojawia się sekcja „Propozycje”.

Każda karta zawiera:

- zdjęcie potrawy,
- nazwę przepisu,
- krótki opis,
- czas przygotowania,
- od jednego do trzech tagów.

Kolor koralowy identyfikuje aktywną Wyszukiwarkę, fokus pola i aktywną podpowiedź. Lista wyników pozostaje wizualnie neutralna.

Kliknięcie karty nie prowadzi do nieopisanej strony szczegółów. Zachowanie karty zostanie określone osobną decyzją produktową.

## Ładowanie

Podczas pobierania:

- zapytanie pozostaje widoczne i możliwe do edycji,
- obszar wyników pokazuje stan ładowania,
- istniejące podpowiedzi nie są przedstawiane jako wynik nowego zapytania,
- interfejs nie blokuje możliwości wyczyszczenia lub zmiany zapytania.

## Brak wyników

Jeżeli zapytanie nie zwraca wyników:

- pojawia się komunikat „Nie znaleźliśmy pasujących propozycji.”,
- użytkownik może poprawić lub wyczyścić zapytanie,
- interfejs nie sugeruje, że brak wyników jest błędem systemu.

## Błąd

Jeżeli wyszukiwanie nie może zostać wykonane:

- pojawia się komunikat o problemie,
- wpisane zapytanie pozostaje zachowane,
- użytkownik może ponowić wyszukiwanie,
- błąd jest odróżniony od poprawnego stanu braku wyników.

## Dostępność i responsywność

- Fokus pozostaje wewnątrz otwartego overlayu.
- Przełącznik trybu, pole, podpowiedzi, karty i zamknięcie są dostępne z klawiatury.
- Aktywny tryb jest przekazywany technologiom asystującym.
- Zmiany stanu wyszukiwania i liczba wyników są ogłaszane bez przenoszenia fokusu.
- Widoczny focus nie może opierać się wyłącznie na zmianie koloru.
- Na wąskim ekranie karta może ułożyć zdjęcie nad treścią.
- Pole i przełącznik nie powodują poziomego przewijania.
- Overlay pozwala przewijać własną zawartość, gdy nie mieści się ona w widoku.

## Otwarta decyzja

Nie ustalono, czy zapytanie ma zostać zachowane po zamknięciu i ponownym otwarciu overlayu.

Wpływ:

- stan aplikacji,
- zachowanie po przypadkowym zamknięciu,
- ewentualne przechowywanie zapytania.

Właściciel decyzji: właściciel produktu.

Postępowanie do czasu rozstrzygnięcia: zamknięcie overlayu resetuje zapytanie. Przełączenie na Mapę bez zamykania zachowuje zapytanie.

## Kryteria akceptacji

| Kryterium | Weryfikacja |
| --- | --- |
| Przycisk „Szukaj” otwiera aktywną Wyszukiwarkę | kontrola w przeglądarce |
| Pole otrzymuje fokus po otwarciu | test komponentu i kontrola ręczna |
| Puste pole nie pokazuje wyników | test komponentu |
| Zmiana zapytania aktualizuje podpowiedzi i wyniki | test komponentu |
| Starsza odpowiedź nie nadpisuje nowszej | test asynchronicznego wyszukiwania |
| Wybranie podpowiedzi ustawia zapytanie | test komponentu |
| Brak wyników różni się od błędu | test komponentu |
| Overlay można obsłużyć i zamknąć klawiaturą | kontrola ręczna |
| Układ nie skacze przy przełączeniu na Mapę | kontrola wizualna |
| Widok odpowiada zatwierdzonej makiecie | kontrola wizualna |
