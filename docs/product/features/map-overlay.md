# Overlay Mapy

> Status: obowiązujący  
> Właściciel: właściciel produktu  
> Opisywany stan: docelowy dla MVP  
> Ostatnia aktualizacja: 2026-07-16

## Cel

Mapa pomaga użytkownikowi, który nie zna nazwy dania, ale potrafi określić oczekiwany charakter posiłku.

Użytkownik wskazuje preferencje na dwóch osiach, a Obiadologia pokazuje dopasowane propozycje.

## Materiał referencyjny

- [Overlay Mapy](../../assets/ui/map-overlay.png)

Makieta określa hierarchię, osie i kierunek wizualny. Położenie punktu oraz przykładowe wyniki przedstawiają jeden z możliwych stanów, a nie stan początkowy.

## Powiązane zachowanie

Wspólne zasady otwierania, zamykania, przełączania trybów i zarządzania fokusem określa [wspólny szkielet overlayu](./search-overlay.md#wspólny-szkielet-overlayu).

## W zakresie

- dwuwymiarowa mapa preferencji,
- jeden aktywny i przesuwany punkt,
- obsługa myszy, dotyku i klawiatury,
- tekstowe podsumowanie położenia,
- wyniki zależne od położenia,
- stany ładowania, braku wyników i błędu.

## Poza zakresem

- algorytm rankingu przepisów,
- model uczenia preferencji użytkownika,
- zapisywanie położenia pomiędzy wizytami,
- dodatkowe punkty reprezentujące innych użytkowników,
- szczegóły przepisu po kliknięciu karty.

## Treści

Mapa używa następujących treści:

- nagłówek: „Wskaż klimat na mapie”,
- podtytuł: „Przesuń talerz tam, gdzie dziś Ci pasuje.”,
- instrukcja: „Przeciągnij talerz”,
- nagłówek wyników: „Propozycje”.

## Osie

Mapa zawiera dwie osie:

| Kierunek | Znaczenie |
| --- | --- |
| lewo | szybko |
| prawo | bez pośpiechu |
| góra | lekko |
| dół | konkretnie |

Położenie jest reprezentowane przez dwie wartości od `0` do `100`:

- `tempo`: `0` oznacza „szybko”, `100` oznacza „bez pośpiechu”,
- `charakter`: `0` oznacza „lekko”, `100` oznacza „konkretnie”.

Wartości współrzędnych nie definiują samodzielnie rankingu przepisów. Mapowanie współrzędnych na wyniki jest osobną decyzją dotyczącą algorytmu dopasowania.

## Stan początkowy

Po otwarciu Mapy:

- aktywny punkt znajduje się na środku,
- `tempo` ma wartość `50`,
- `charakter` ma wartość `50`,
- podsumowanie opisuje oba wymiary jako neutralne,
- widoczne są ogólne propozycje,
- Mapa jest aktywną zakładką overlayu.

Stan początkowy nie sugeruje preferencji „szybko”, „bez pośpiechu”, „lekko” ani „konkretnie”.

## Przesuwanie punktu

Użytkownik może zmienić położenie przez:

- przeciągnięcie myszą,
- przeciągnięcie dotykiem,
- kliknięcie lub dotknięcie wybranego miejsca,
- użycie klawiszy strzałek po ustawieniu fokusu na punkcie.

Punkt:

- pozostaje wewnątrz granic mapy,
- jest zawsze jeden,
- jest wizualnie wyraźniejszy od tła i elementów pomocniczych,
- pokazuje widoczny focus podczas obsługi klawiaturą.

Podsumowanie aktualizuje się podczas przesuwania. Wyniki aktualizują się po zakończeniu ruchu albo po krótkim opóźnieniu, bez przeładowania strony.

Dokładne opóźnienie jest decyzją techniczną.

Starsza odpowiedź nie może nadpisać wyników dla nowszego położenia.

## Podsumowanie wyboru

Pod mapą widoczne jest podsumowanie zaczynające się od „Wybrano:”.

Dla punktu znajdującego się dokładnie na środku podsumowanie brzmi:

> Wybrano: tempo neutralne · charakter neutralny

Po przesunięciu podsumowanie pokazuje dominujący kierunek każdej osi i jego wartość procentową.

Przykład:

> Wybrano: szybko 72% · lekko 64%

Dla osi poziomej:

- wartość poniżej `50` używa etykiety „szybko”,
- wartość powyżej `50` używa etykiety „bez pośpiechu”,
- wartość `50` oznacza „tempo neutralne”.

Dla osi pionowej:

- wartość poniżej `50` używa etykiety „lekko”,
- wartość powyżej `50` używa etykiety „konkretnie”,
- wartość `50` oznacza „charakter neutralny”.

Procent dominującego kierunku jest liczony jako odległość od przeciwnego końca osi:

- dla wartości poniżej `50`: `100 - wartość`,
- dla wartości powyżej `50`: `wartość`.

Makieta nie jest źródłem dokładnych współrzędnych przykładowego punktu.

## Wyniki

Stan początkowy pokazuje ogólne propozycje odpowiadające neutralnemu położeniu.

Po zmianie punktu lista odświeża się zgodnie z aktualnymi wartościami obu osi.

Każda karta zawiera:

- zdjęcie potrawy,
- nazwę przepisu,
- krótki opis,
- czas przygotowania,
- od jednego do trzech tagów.

Kolor niebieski identyfikuje Mapę, aktywny punkt, aktywny tryb i wartości podsumowania. Karty wyników pozostają wizualnie neutralne.

Kliknięcie karty nie prowadzi do nieopisanej strony szczegółów.

## Ładowanie

Podczas pobierania wyników:

- punkt pozostaje widoczny i możliwy do przesunięcia,
- aktualne podsumowanie pozostaje widoczne,
- obszar wyników komunikuje ładowanie,
- kolejne przesunięcie może rozpocząć nowe wyszukiwanie.

## Brak wyników

Jeżeli położenie nie zwraca propozycji:

- pojawia się komunikat „Nie znaleźliśmy propozycji dla tego miejsca.”,
- punkt i podsumowanie pozostają widoczne,
- użytkownik może przesunąć punkt bez resetowania Mapy,
- brak wyników nie jest przedstawiany jako błąd systemu.

## Błąd

Jeżeli nie można pobrać wyników:

- położenie punktu pozostaje zachowane,
- pojawia się komunikat o problemie,
- użytkownik może ponowić pobranie,
- użytkownik nadal może przesunąć punkt.

## Przełączanie trybu

Przełączenie do Wyszukiwarki nie resetuje położenia Mapy w ramach otwartego overlayu.

Powrót do Mapy przywraca ostatnie położenie oraz związane z nim wyniki.

Zamknięcie overlayu resetuje Mapę. Ponowne otwarcie zaczyna od środka.

## Dostępność

- Punkt jest elementem fokusowalnym.
- Klawisze `←` i `→` zmieniają tempo.
- Klawisze `↑` i `↓` zmieniają charakter.
- Zmiana klawiaturą jest wykonywana w równych, przewidywalnych krokach.
- Dostępna nazwa punktu opisuje aktualne tempo i charakter.
- Zmiana podsumowania i wyników jest ogłaszana bez przenoszenia fokusu.
- Informacja o położeniu nie opiera się wyłącznie na kolorze lub pozycji.
- Widoczny focus nie może być zasłonięty przez efekt świetlny punktu.

Dokładny krok klawiatury jest decyzją techniczną, ale musi pozwalać osiągnąć oba końce i środek osi.

## Responsywność

- Mapa mieści się w szerokości overlayu bez poziomego przewijania.
- Zachowuje wystarczającą wysokość do wygodnego wskazania położenia.
- Etykiety osi pozostają czytelne i nie nachodzą na punkt.
- Punkt ma obszar dotykowy odpowiedni dla obsługi palcem.
- Na wąskim ekranie karty mogą układać zdjęcie nad treścią.
- Zmiana rozmiaru widoku nie zmienia logicznych wartości wybranego punktu.

## Kryteria akceptacji

| Kryterium | Weryfikacja |
| --- | --- |
| Mapa otwiera się z punktem na środku | test komponentu |
| Stan początkowy pokazuje neutralne podsumowanie | test komponentu |
| Stan początkowy pokazuje ogólne propozycje | test komponentu |
| Punkt można przesuwać myszą i dotykiem | kontrola w przeglądarce |
| Punkt można obsłużyć klawiaturą | test komponentu i kontrola ręczna |
| Punkt nie wychodzi poza granice Mapy | test komponentu |
| Podsumowanie odpowiada położeniu | test jednostkowy mapowania osi |
| Wyniki odświeżają się po zmianie położenia | test komponentu |
| Starsza odpowiedź nie nadpisuje nowszej | test asynchroniczny |
| Stan Mapy jest zachowany przy przełączeniu trybu | test komponentu |
| Zamknięcie resetuje Mapę do środka | test komponentu |
| Widok odpowiada zatwierdzonej makiecie | kontrola wizualna |
