# Strona główna i Kategorie

> Status: obowiązujący  
> Makiety: `home-hero.png`, `home-browse-mode.png`

## Cel

Strona główna pomaga użytkownikowi rozpoznać swój aktualny stan i wybrać jedną z trzech dróg odkrywania dań.

Wspólne reguły wizualne opisuje [ui-system.md](../../design/ui-system.md).

## Struktura

Strona zawiera:

1. nagłówek z logo,
2. główny komunikat „Co dziś jemy?”,
3. kartę wyboru jednej z trzech dróg,
4. sekcję kategorii,
5. listę propozycji wynikających z wyboru kategorii.

Poszczególne bloki tej struktury są prezentowane jako sekcje pełnoekranowe zgodnie z zasadą „jedna sekcja = jeden ekran” z [ui-system.md](../../design/ui-system.md). Nagłówek z logo należy do pierwszego ekranu, a nie stanowi osobnej sekcji.

W układzie mobilnym środek komunikatu głównego znajduje się w połowie odległości między dolną krawędzią wspólnego nagłówka a górną krawędzią panelu wyboru dróg. Wysokość panelu wynika z responsywnie skalowanej zawartości, a odstęp między grupami akcji a notatką wynosi `22px`; krótsza ramka jest dosuwana do dolnej kotwicy pierwszej sekcji. Stałe są odstępy między dolną krawędzią notatki a ramką panelu oraz między dolną ramką panelu a końcem sekcji. Kafel każdej drogi znajduje się pod jej tytułem i kolorową kreską, z lokalnym górnym marginesem `6px`; osobne strzałki nie są renderowane. Odstęp między drzewem a siatką trzech dróg jest stały i zgodny z referencją Pixel 7 (`412 × 839px` viewportu przeglądarki). Na ekranach zbyt niskich, by pomieścić całą kompozycję, zawartość pozostaje dostępna przez naturalne przewijanie dokumentu.

Ikona menu widoczna na makiecie zapowiada późniejszą nawigację i nie należy do bieżącego przepływu MVP. Dopóki zakres oraz zawartość menu nie zostaną określone, implementacja nie renderuje jej jako pozornie działającego przycisku.

## Trzy drogi

Wprowadzenie do panelu:

- pigułka „Apetyt nie zawsze mówi pełnym zdaniem”,
- nagłówek „Rzuć pierwszą myśl na stół”.

### Mapa

Tekst:

- „Obierz kierunek”
- przycisk „Mapa”

Kliknięcie otwiera discovery overlay w trybie mapy.

### Wyszukiwarka

Tekst:

- „Znajdź konkret”
- przycisk „Szukaj”

Kliknięcie otwiera discovery overlay w trybie wyszukiwarki.

### Kategorie

Tekst:

- „Ustal kryteria”
- przycisk „Kategorie”

Kliknięcie prowadzi do sekcji kategorii na stronie głównej.

Notatka pod trzema drogami:

- „Ciekawość to najlepsza przyprawa.”
- „Daj się jej poprowadzić i wybierz coś dla siebie.”

## Sekcja kategorii

Zawartość sekcji rozpoczyna się przy jej górnej krawędzi z odstępem `20px`;
nagłówek i opis nie są centrowane pionowo razem z panelami znajdującymi się poniżej.

Nagłówek:

- „Kategorie”
- „Wybierz co najmniej jedną opcję: porę dnia, tempo lub okazję.”

### Pora dnia

- Śniadanie
- Obiad
- Kolacja

### Tempo

- Na już
- Na dziś
- Na dwa dni

### Okazja

- Dla dzieci
- Dla gości
- Na grilla

### Szczegółowe wyszukiwanie

Pod grupami wyboru znajduje się przycisk „Szczegółowe wyszukiwanie”. Prowadzi
do statycznego ekranu zastępczego `/categories`, który jasno informuje, że
zaawansowane filtrowanie jest w przygotowaniu, oraz pozwala wrócić bezpośrednio
do sekcji Kategorii. Ekran zastępczy nie implementuje filtrów i nie przenosi
aktualnych wyborów.

## Reguły wyboru

- Początkowo żadna opcja nie jest wybrana.
- W każdej grupie można wybrać maksymalnie jedną opcję.
- Wybranie innej opcji zastępuje poprzednią w tej samej grupie.
- Ponowne użycie aktywnej opcji usuwa wybór.
- Pasek w ramce „Propozycje dla Ciebie”, bezpośrednio pod jej nagłówkiem, jest zawsze widoczny: przed wyborem przypomina „Wybierz co najmniej jedną opcję.”, a po wyborze pokazuje podsumowanie „Wybrano: …” w jednym wierszu.
- Wyniki pojawiają się po wyborze co najmniej jednej opcji w dowolnej grupie.
- Od pierwszego wyboru zmiana dowolnej opcji aktualizuje wyniki.
- Usunięcie ostatniego wyboru ukrywa wyniki i przywraca stan początkowy.

Aktywny stan musi być widoczny nie tylko przez zmianę koloru.

## Wyniki

Pod panelem wyboru zawsze znajduje się ramka „Propozycje dla Ciebie”, która
rozciąga się do dolnej krawędzi obszaru treści sekcji i zachowuje stałą wysokość
w danym viewporcie. Bezpośrednio pod jej nagłówkiem znajduje się pasek
podsumowania wyboru. Zmiana kryteriów nie przesuwa panelu ani nagłówka ramki;
zmienia się wyłącznie jej wnętrze:

- bez wyboru ramka pokazuje instrukcję „Tutaj pojawią się dopasowane przepisy.”,
- po dopasowaniu pokazuje od trzech do czterech początkowych propozycji,
- bez dopasowania pokazuje komunikat „Brak dopasowań. Zmień lub usuń wybrane kryterium.”,
- lista dłuższa niż dostępne wnętrze ramki przewija się pionowo, bez zmiany wysokości ramki,
- w drugiej fazie: przycisk „Pokaż więcej”, jeżeli istnieją kolejne wyniki.

„Pokaż więcej” nie należy do bieżącego MVP. W drugiej fazie prowadzi do podstrony Kategorii z filtrem odpowiadającym wyborom ze strony głównej. Dokładna trasa, zachowanie filtra i zakres wyników zostaną opisane w specyfikacji tej podstrony. Do tego czasu prototyp pokazuje wyłącznie początkowe propozycje i nie renderuje nieaktywnego przycisku. Makieta przedstawia kierunek docelowego stanu z większym zbiorem danych.

Karty korzystają ze wspólnego modelu opisanego w [data-model.md](../../engineering/data-model.md).

## Kryteria akceptacji

- Wszystkie trzy drogi są widoczne jako równorzędne.
- Mapa i Szukaj otwierają właściwy tryb wspólnego overlaya.
- Kategorie prowadzą do odpowiedniej sekcji.
- Żadna kategoria nie jest zaznaczona domyślnie.
- „Szczegółowe wyszukiwanie” prowadzi do jawnego ekranu zastępczego, z którego można wrócić do sekcji Kategorii.
- Nagłówek sekcji Kategorii wraz z opisem rozpoczyna się `20px` od jej górnej krawędzi.
- Ramka „Propozycje dla Ciebie” sięga dolnej krawędzi obszaru treści sekcji.
- Pasek pod grupami zawsze pokazuje przypomnienie albo jednoliniowe podsumowanie wyboru.
- Ramka wyników jest widoczna w każdym stanie i nie zmienia wysokości po wyborze, odznaczeniu ani braku dopasowań.
- Co najmniej jeden wybór generuje filtrowane wyniki; niewybrane grupy nie ograniczają filtrowania.
- Użytkownik może usunąć aktywny wybór.
- Wyniki aktualizują się po każdej zmianie, a usunięcie ostatniego wyboru je ukrywa.
- Każda główna sekcja wypełnia jeden ekran i nie jest wyższa niż ekran, zgodnie z regułą pełnoekranowych sekcji w [ui-system.md](../../design/ui-system.md).
- Środek komunikatu głównego znajduje się w połowie odległości między dolną
  krawędzią wspólnego nagłówka a górną krawędzią panelu wyboru dróg.
- Panel jest dosuwany do dolnej kotwicy pierwszej sekcji.
- Kafel każdej drogi znajduje się bezpośrednio pod tytułem i kolorową kreską,
  ma górny margines `6px`, a osobna strzałka nie jest renderowana.
- Wysokość panelu dopasowuje się do responsywnej zawartości, a pionowy odstęp
  między każdą grupą akcji a notatką wynosi `22px`.
- Odstęp między drzewem a siatką dróg jest stały w mobilnych viewportach i zgodny z referencją Pixel 7 (`412 × 839px`).
- Odległość dolnej krawędzi notatki od ramki panelu jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Odległość dolnej ramki panelu wyboru dróg od końca pierwszej sekcji jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Układ spełnia wymagania responsywności i dostępności.
