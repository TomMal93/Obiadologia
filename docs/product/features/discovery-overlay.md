# Overlay Wyszukiwarki i Mapy

> Status: obowiązujący
>
> Opisywany stan: docelowy dla MVP
>
> Makiety: `search-overlay.png`, `map-overlay.png`
>
> Aktualizacja: przy zmianie wspólnej powłoki albo mechanizmu Wyszukiwarki lub Mapy

## Cel i odpowiedzialność

Discovery overlay łączy Wyszukiwarkę i Mapę preferencji w jednym komponencie z dwoma przełączanymi trybami. Tryby współdzielą powłokę, cykl życia, prezentację wyników i stany danych. Różnią się mechanizmem podawania kryteriów i sposobem dopasowania propozycji.

Ten dokument jest źródłem prawdy dla zachowania całego discovery overlayu. Wspólne reguły wizualne i komponenty opisuje [ui-system.md](../../design/ui-system.md), model wyników oraz reguły dopasowania — [data-model.md](../../engineering/data-model.md), a wymagania przekrojowe — [quality-requirements.md](../../engineering/quality-requirements.md).

Makiety określają hierarchię, treści i kierunek wizualny. Przykładowe zapytania, położenie punktu oraz widoczne wyniki przedstawiają stany po interakcji i nie definiują stanu początkowego ani algorytmu.

## W zakresie

- otwieranie, zamykanie i przełączanie trybów;
- stan sesji otwartego overlayu;
- pole wyszukiwania i dynamiczne sugestie;
- dwuwymiarowa Mapa preferencji;
- wspólna lista propozycji;
- podstawowe stany początkowy, sukcesu i braku wyników oraz — wyłącznie po podłączeniu rzeczywistej operacji asynchronicznej — ładowania i błędu;
- obsługa klawiatury, dotyku i technologii asystujących.

## Poza zakresem

- wybór silnika wyszukiwania lub zewnętrznego API;
- produkcyjne strojenie rankingu;
- trwałe zapisywanie zapytania albo położenia Mapy;
- historia wyszukiwania i personalizacja;
- właściwa treść strony przepisu;
- wyszukiwanie głosowe;
- dodatkowe punkty na Mapie.

## Wspólna powłoka

Overlay:

- jest pełnoekranowym dialogiem w granicach mobilnego kontenera aplikacji;
- zawiera logo i nazwę „Obiadologia”;
- zawiera przycisk zamknięcia;
- zawiera jeden przełącznik „Wyszukiwarka / Mapa”;
- zawiera obszar właściwy dla aktywnego trybu;
- zawiera wspólną listę propozycji;
- blokuje przewijanie i interakcję ze stroną pod spodem;
- pozwala przewijać własną zawartość, gdy nie mieści się ona w viewporcie;
- nie powoduje gwałtownego skoku wspólnych elementów podczas przełączania trybu.

Przycisk zamknięcia, klawisz `Escape` i akcja „Wstecz” przy otwartym overlayu uruchamiają jeden wspólny kontrakt zamknięcia opisany poniżej. „Wstecz” najpierw zamyka overlay, zamiast opuszczać poprzedni widok strony.

Po otwarciu fokus przechodzi do logicznego pierwszego elementu aktywnego trybu. W trybie Wyszukiwarki fokus trafia na sam dialog, a nie na pole tekstowe, aby klawiatura ekranowa nie otwierała się automatycznie na starcie. Fokus pozostaje wewnątrz dialogu, a po zamknięciu wraca do elementu, który otworzył overlay.

## Otwieranie i cykl życia stanu

- Przycisk „Szukaj” otwiera overlay w trybie Wyszukiwarki.
- Przycisk „Mapa” otwiera overlay w trybie Mapy.
- Wyszukiwarka i Mapa posiadają oddzielny stan w ramach jednej sesji overlayu.
- Przełączenie trybu nie zamyka overlayu i zachowuje stan obu trybów wraz z ich ostatnimi wynikami.
- Jawne zamknięcie przez przycisk, `Escape` albo akcję „Wstecz” kończy sesję oraz resetuje zapytanie, sugestie, wyniki i położenie Mapy.
- Ponowne otwarcie rozpoczyna nową sesję w trybie wskazanym przez akcję użytkownika.

### Historia przeglądarki i powrót z przepisu

- Otwarcie overlayu tworzy dokładnie jeden lokalny wpis historii oznaczający sesję discovery. Adres URL nie zawiera trybu ani kryteriów.
- Przełączanie trybu i zmiany kryteriów aktualizują bieżącą sesję, ale nie tworzą kolejnych wpisów historii.
- Przycisk zamknięcia i `Escape` cofają wpis historii. Overlay zamyka się dopiero w reakcji na tę samą zmianę historii, która obsługuje przeglądarkową akcję „Wstecz”; obsługa „Wstecz” nie wykonuje dodatkowego cofnięcia.
- Jawnie zamknięta sesja jest zakończona. Jeżeli użytkownik wybierze później „Dalej” i wróci do jej wpisu, overlay rozpoczyna nową, zresetowaną sesję w trybie wskazanym przy pierwotnym otwarciu.
- Przejście z karty do `/recipes/:slug` nie jest jawnym zamknięciem, lecz zawiesza bieżącą sesję. Powrót z przepisu przywraca overlay w aktywnym wcześniej trybie, z poprzednim zapytaniem, położeniem Mapy i wynikami.
- Stan potrzebny do odtworzenia zawieszonej sesji pozostaje lokalny i nie ustanawia udostępnialnego kontraktu URL.

## Wspólna lista wyników

Oba tryby korzystają z jednego modelu `Recipe` i wspólnego komponentu karty.

Sekcja wyników używa nagłówka „Propozycje”. Każda karta zawiera:

- zdjęcie potrawy albo wspólny placeholder;
- nazwę przepisu;
- opcjonalny krótki opis;
- czas przygotowania;
- od jednego do trzech tagów.

Cała karta jest linkiem do `/recipes/:slug` — strony przepisu opisanej w [recipe-page.md](./recipe-page.md).

Kolejność wyników odpowiada aktualnym kryteriom aktywnego trybu. Starsza odpowiedź asynchroniczna nie może nadpisać wyników dla nowszego zapytania albo położenia Mapy.

Zmiana wyników i ich liczby jest ogłaszana technologiom asystującym bez przenoszenia fokusu. Komunikaty nie mogą być emitowane tak często, aby utrudniały obsługę pola lub Mapy.

## Wspólne stany danych

### Stan początkowy

Każdy tryb pokazuje własną instrukcję i nie udaje kryteriów podanych przez użytkownika. Wyszukiwarka nie pokazuje wyników przed wpisaniem zapytania. Neutralny środek Mapy pokazuje od trzech do czterech ogólnych, zróżnicowanych propozycji zgodnie z regułą opisaną w `data-model.md`.

### Ładowanie

Podczas operacji asynchronicznej kryteria pozostają widoczne i możliwe do zmiany. Obszar wyników komunikuje ładowanie bez blokowania pola, Mapy, przełącznika ani zamknięcia. Kolejna zmiana kryteriów może zastąpić trwające wyszukiwanie.

### Brak wyników

Brak dopasowań jest poprawnym stanem, odróżnionym od błędu. Użytkownik zachowuje kryteria i może je od razu zmienić.

### Błąd

Błąd nie usuwa aktualnego zapytania ani położenia Mapy. Interfejs pokazuje zrozumiały komunikat i, jeżeli operację można powtórzyć, akcję ponowienia.

W prototypie opartym wyłącznie na lokalnych danych nie należy sztucznie symulować ładowania ani błędu. Pełny projekt wizualny stanów danych należy do kolejnego etapu, ale implementacja rzeczywistego źródła asynchronicznego MUSI obsłużyć powyższe zachowania.

## Tryb Wyszukiwarki

### Cel i treści

Wyszukiwarka jest przeznaczona dla użytkownika, który ma już trop: składnik, nazwę dania, smak, kategorię albo tag. Zapytanie nie musi być pełną ani dokładną nazwą przepisu.

- nagłówek: „Masz trop? Wpisz go tutaj”;
- opis: „Składnik, danie, smak albo tag.”;
- etykieta lub dostępna nazwa pola: „Szukaj przepisu”;
- placeholder: „np. kurczak, curry, szybko, bez mięsa”.

### Stan początkowy

Po rozpoczęciu nowej sesji w trybie Wyszukiwarki:

- pole jest puste; fokus trafia na dialog, więc klawiatura ekranowa nie otwiera się na starcie;
- sugestie powiązane z zapytaniem nie są widoczne;
- lista wyników nie jest widoczna;
- placeholder wyjaśnia obsługiwane rodzaje zapytań;
- pod polem widoczny jest blok „Popularne tropy” — klikalne podpowiedzi wywiedzione z najczęstszych tagów katalogu, które zapełniają pusty stan i podpowiadają kierunek. W stanie pustym mają formę siatki bento (dominujący kafel „hero” 2×2 w rogu i mniejsze kafle wokół niego); nie są to wyniki użytkownika ani zestaw filtrów. Wybranie tropu ustawia go jako jedno aktywne zapytanie.

Usunięcie całej treści przywraca ten stan.

### Zapytanie i sugestie

- Wyniki i sugestie aktualizują się po każdej zmianie zapytania, bez przeładowania strony i bez przycisku zatwierdzającego.
- Zapytanie jest normalizowane zgodnie z regułami w `data-model.md`, w tym bez rozróżniania wielkości liter i z tolerancją polskich znaków.
- Implementacja może zastosować krótkie opóźnienie około `200ms`, jeżeli zachowuje odczucie wyszukiwania na żywo.
- Sugestie są powiązane z aktualnym zapytaniem i mogą reprezentować danie, składnik, smak, kategorię albo tag.
- Sugestie są dostępne z klawiatury.
- Wybranie sugestii ustawia ją jako jedno aktywne zapytanie i odświeża wyniki.
- Sugestie nie są zestawem filtrów wielokrotnego wyboru.

Kolor koralowy identyfikuje aktywną Wyszukiwarkę, fokus pola i aktywną sugestię, ale nie jest jedynym nośnikiem ich stanu.

Komunikat braku wyników: „Nie znaleźliśmy pasujących propozycji.” Pod komunikatem powtarza się blok „Popularne tropy” (etykieta „Spróbuj popularnych tropów:”), aby brak trafień nie był ślepym zaułkiem — wybranie tropu od razu ustawia nowe zapytanie z wynikami.

## Tryb Mapy

### Cel i treści

Mapa pomaga użytkownikowi, który nie zna nazwy dania, ale potrafi określić oczekiwany charakter posiłku.

- nagłówek: „Wskaż klimat na mapie”;
- opis: „Przesuń talerz tam, gdzie dziś Ci pasuje.”.

### Osie i reprezentacja danych

Współrzędne interfejsu mają zakres od `0` do `100`:

| Kierunek | Współrzędna UI | Znaczenie |
|---|---:|---|
| lewo | `x = 0` | szybko |
| środek poziomy | `x = 50` | tempo neutralne |
| prawo | `x = 100` | bez pośpiechu |
| góra | `y = 0` | lekko |
| środek pionowy | `y = 50` | charakter neutralny |
| dół | `y = 100` | konkretnie |

Model `Recipe` używa pól `pace` i `lightness` w zakresie `0..1`. Mapowanie jest jawne:

```text
pace = x / 100
lightness = 1 - (y / 100)
```

Dzięki temu górna część Mapy odpowiada większej wartości `lightness`, a dolna — mniejszej.

### Stan początkowy

Po rozpoczęciu nowej sesji w trybie Mapy:

- aktywny punkt znajduje się na środku: `x = 50`, `y = 50`;
- dostępna nazwa punktu opisuje oba wymiary jako neutralne;
- widoczne są od trzech do czterech ogólnych, zróżnicowanych propozycji zgodnie z regułą neutralnej Mapy z `data-model.md`;
- stan nie sugeruje żadnej ze skrajnych preferencji.

Dostępna nazwa punktu w środku brzmi:

> Talerz na mapie: tempo neutralne · charakter neutralny

### Przesuwanie punktu

Użytkownik może zmienić położenie przez:

- przeciągnięcie myszą;
- przeciągnięcie dotykiem;
- kliknięcie lub dotknięcie miejsca na Mapie;
- klawisze strzałek po ustawieniu fokusu na punkcie.

Punkt jest jeden, pozostaje wewnątrz granic Mapy i ma widoczny fokus. Klawisze `←` i `→` zmieniają tempo, a `↑` i `↓` zmieniają charakter. Krok klawiatury jest decyzją lokalnej implementacji, ale musi być równy, przewidywalny i pozwalać osiągnąć oba końce oraz środek osi.

Położenie wizualne i podsumowanie aktualizują się natychmiast podczas ruchu. Wyniki również są przeliczane podczas przeciągania, bez przycisku zatwierdzającego. Implementacja może ograniczyć częstotliwość kosztownych obliczeń, jeżeli nie opóźnia ruchu punktu ani nie zmienia końcowego wyniku.

Zmiana rozmiaru viewportu nie zmienia logicznych współrzędnych punktu.

### Podsumowanie wyboru

Aktualne położenie jest przekazywane przez dostępną nazwę punktu Mapy (`aria-label`); nie ma osobnego widocznego paska podsumowania. Nazwa pokazuje dominujący kierunek każdej osi i procent jego nasilenia, na przykład:

> Talerz na mapie: szybko 72% · lekko 64%

Dla osi poziomej:

- `x < 50`: „szybko”, procent `100 - x`;
- `x = 50`: „tempo neutralne”;
- `x > 50`: „bez pośpiechu”, procent `x`.

Dla osi pionowej:

- `y < 50`: „lekko”, procent `100 - y`;
- `y = 50`: „charakter neutralny”;
- `y > 50`: „konkretnie”, procent `y`.

Makieta nie jest źródłem dokładnych współrzędnych przykładowego punktu.

Kolor niebieski identyfikuje Mapę, aktywny punkt i aktywny tryb, ale położenie i stan są także przekazane dostępną nazwą punktu, geometrią oraz semantyką.

Komunikat braku wyników: „Nie znaleźliśmy propozycji dla tego miejsca.”

## Dostępność specyficzna dla discovery overlayu

- Przełącznik przekazuje aktywny tryb technologiom asystującym.
- Pole, sugestie, punkt Mapy, karty, przełącznik i zamknięcie są dostępne z klawiatury.
- Punkt Mapy jest elementem fokusowalnym, a jego dostępna nazwa opisuje aktualne tempo i charakter.
- Informacja o stanie nie opiera się wyłącznie na kolorze, położeniu albo efekcie świetlnym.
- Otwarta klawiatura ekranowa nie może zasłaniać pola ani uniemożliwiać przewijania do wyników.
- Mapa mieści się w szerokości overlayu bez poziomego przewijania i zachowuje obszar dotykowy odpowiedni do obsługi palcem.

## Kryteria akceptacji

### Wspólna powłoka

- „Szukaj” i „Mapa” otwierają odpowiedni tryb jednego overlayu.
- Przełączenie trybu nie zamyka overlayu ani nie resetuje stanu obu trybów.
- Zamknięcie kończy sesję i resetuje oba tryby.
- Otwarcie tworzy jeden wpis historii; przełączanie trybu i zmiany kryteriów nie tworzą następnych.
- Przycisk zamknięcia, `Escape` i akcja „Wstecz” zamykają overlay przez jedną zmianę historii, bez pozostawienia dodatkowego kroku „Wstecz”.
- „Dalej” po jawnym zamknięciu otwiera nową, zresetowaną sesję w trybie pierwotnego otwarcia.
- Powrót z trasy przepisu przywraca zawieszoną sesję wraz z aktywnym trybem, kryteriami i wynikami.
- Fokus pozostaje w dialogu i po zamknięciu wraca do elementu otwierającego.
- Tło jest zablokowane, a własna zawartość overlayu pozostaje przewijalna.
- Zmiana trybu nie powoduje gwałtownego skoku wspólnych elementów.
- Starsza odpowiedź nie nadpisuje wyników nowszych kryteriów.
- Brak wyników jest odróżniony od błędu.
- Prototyp z lokalnymi danymi obsługuje stan początkowy, sukces i brak wyników, ale nie symuluje ładowania ani błędu; te stany stają się obowiązkowe wraz z rzeczywistą operacją asynchroniczną.
- Każda karta korzysta z `Recipe` i prowadzi do `/recipes/:slug`.

### Wyszukiwarka

- Po otwarciu pole jest puste i nie pokazuje przypadkowych wyników; fokus trafia na dialog, więc klawiatura ekranowa nie otwiera się automatycznie.
- Zmiana zapytania automatycznie aktualizuje sugestie i wyniki.
- Wybranie sugestii ustawia jedno aktywne zapytanie.
- Wyczyszczenie pola przywraca stan początkowy.
- Pole i sugestie są w pełni obsługiwalne klawiaturą.

### Mapa

- Mapa rozpoczyna w neutralnym środku i pokazuje od trzech do czterech propozycji spełniających regułę różnorodności z `data-model.md`.
- Punkt można przesuwać myszą, dotykiem i klawiaturą, bez wyjścia poza granice.
- Dostępna nazwa punktu odpowiada współrzędnym i jest aktualizowana podczas ruchu.
- Wyniki są aktualizowane podczas przeciągania, bez zatwierdzania.
- Mapowanie współrzędnych UI na `pace` i `lightness` jest zgodne z opisanym wzorem.
- Przełączenie trybu zachowuje położenie, a zamknięcie resetuje je do środka.

### Jakość widoku

- Widoki zachowują hierarchię i charakter właściwej makiety.
- Overlay spełnia wymagania dostępności, responsywności i viewportów opisane w dokumentach przekrojowych.
