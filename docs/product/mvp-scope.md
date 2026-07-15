# Zakres MVP Obiadologii

> Status: obowiązujący  
> Właściciel: właściciel produktu  
> Opisywany stan: docelowy dla MVP
> Ostatnia aktualizacja: 2026-07-15

## Cel etapu

Bieżący etap obejmuje stworzenie głównego doświadczenia Obiadologii: przejścia od pytania „co dziś zjemy?” do kilku dopasowanych propozycji przepisów.

Użytkownik może rozpocząć na trzy sposoby:

1. wskazać preferencje na mapie,
2. wpisać posiadany trop w wyszukiwarce,
3. przeglądać propozycje przez wybór pory dnia, tempa i okazji.

## W zakresie

### Strona główna

- nagłówek i identyfikacja Obiadologii,
- sekcja hero przedstawiająca trzy równorzędne drogi,
- przejście do Mapy,
- przejście do Wyszukiwarki,
- przejście do sekcji przeglądania,
- sekcja „Wybierz tryb”,
- lista dopasowanych propozycji.

### Wybór trybu

Użytkownik wybiera dokładnie jedną opcję z każdej grupy:

- pora dnia: Śniadanie, Obiad albo Kolacja,
- tempo: Na już, Na dziś albo Na dwa dni,
- okazja: Dla dzieci, Dla gości albo Na grilla.

Widok pokazuje podsumowanie aktywnych wyborów oraz 3–4 dopasowane propozycje. Użytkownik może poprosić o kolejne wyniki przez przycisk „Pokaż więcej”.

### Wyszukiwarka

- pełnoekranowy overlay,
- pole wyszukiwania,
- wyszukiwanie po składniku, nazwie dania, smaku, kategorii lub tagu,
- dynamiczne podpowiedzi,
- lista wyników odpowiadających zapytaniu,
- możliwość przełączenia do Mapy,
- możliwość zamknięcia overlayu.

### Mapa

- pełnoekranowy overlay,
- osie „szybko — bez pośpiechu” oraz „lekko — konkretnie”,
- jeden aktywny, przesuwany punkt,
- tekstowe podsumowanie położenia punktu,
- wyniki zależne od wskazanego położenia,
- możliwość przełączenia do Wyszukiwarki,
- możliwość zamknięcia overlayu.

### Wyniki

Każda karta wyniku zawiera:

- zdjęcie potrawy,
- nazwę przepisu,
- krótki opis,
- czas przygotowania,
- od jednego do trzech tagów.

## Poza zakresem

Bieżący etap nie obejmuje:

- rejestracji i logowania,
- profili użytkowników,
- zapisywania ulubionych przepisów,
- list zakupów,
- planera posiłków,
- ocen i komentarzy,
- funkcji społecznościowych,
- płatności i subskrypcji,
- panelu administracyjnego,
- aplikacji mobilnej instalowanej ze sklepu.

Dodanie któregoś z tych elementów wymaga jawnego rozszerzenia zakresu.

## Ograniczenia

- Trzy drogi dojścia do przepisu są równorzędne.
- Interfejs nie może wymagać od użytkownika znajomości nazw kulinarnych.
- Pierwszy widok nie może prezentować rozbudowanego panelu filtrów.
- Wyniki mają zawężać wybór, a nie prezentować pełny katalog.
- Agent nie dodaje funkcji spoza bieżącego zakresu.
- Makiety określają intencję wizualną, ale nie definiują algorytmu dopasowania ani kontraktów danych.

## Kryteria ukończenia etapu

- użytkownik może rozpocząć każdą z trzech dróg,
- każda droga prowadzi do listy dopasowanych propozycji,
- aktywne wybory są widoczne i zrozumiałe,
- Wyszukiwarka i Mapa działają w jednym wspólnym overlayu,
- przełączanie między Wyszukiwarką i Mapą nie powoduje widocznego skakania układu,
- wyniki używają wspólnej struktury karty,
- funkcje spoza zakresu nie zostały dodane.

Szczegółowe stany, zachowanie i sposób weryfikacji określają specyfikacje poszczególnych funkcji.

## Otwarte decyzje

### Przejście do szczegółów przepisu

Nie ustalono, co dzieje się po wybraniu karty wyniku.

Wpływ:

- routing aplikacji,
- zakres strony szczegółów,
- wymagany model danych,
- zachowanie przycisku Wstecz.

Właściciel decyzji: właściciel produktu.

Postępowanie do czasu rozstrzygnięcia: karta może być zaprojektowana jako element interaktywny, ale agent nie implementuje nieopisanej strony szczegółów.

### Źródło danych

Nie ustalono, czy przepisy pochodzą z lokalnych danych, własnego backendu czy zewnętrznego API.

Wpływ:

- architektura aplikacji,
- model danych,
- obsługa błędów,
- sposób wyszukiwania i filtrowania.

Właściciel decyzji: maintainer repozytorium wraz z właścicielem produktu.

Postępowanie do czasu rozstrzygnięcia: dokumentacja funkcji opisuje zachowanie użytkownika bez zakładania konkretnego źródła danych.

### Algorytm dopasowania

Nie ustalono sposobu wyliczania kolejności i trafności wyników.

Wpływ:

- działanie Mapy,
- filtrowanie,
- procenty dopasowania,
- kolejność propozycji.

Właściciel decyzji: właściciel produktu.

Postępowanie do czasu rozstrzygnięcia: nie należy przedstawiać przykładowych wyników z makiet jako formalnej reguły dopasowania.
