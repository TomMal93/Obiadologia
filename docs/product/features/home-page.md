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

W układzie mobilnym pozycje nagłówka głównego i górnej krawędzi panelu wyboru dróg są stałymi kotwicami pionowymi, skalibrowanymi dla viewportu iPhone 12 Pro (`390 × 844px`). Stałe są również odstępy między dolną krawędzią notatki a ramką panelu oraz między ramką panelu a końcem pierwszej sekcji. Grupa strzałki i kafla ma lokalny górny margines `2px`. Odstęp między drzewem a siatką trzech dróg jest stały i zgodny z referencją Pixel 7 (`412 × 839px` viewportu przeglądarki). Zmiana wysokości telefonu nie przesuwa stałych kotwic; na ekranach zbyt niskich, by pomieścić całą kompozycję, zawartość pozostaje dostępna przez naturalne przewijanie dokumentu.

Ikona menu widoczna na makiecie zapowiada późniejszą nawigację i nie należy do bieżącego przepływu MVP. Dopóki zakres oraz zawartość menu nie zostaną określone, implementacja nie renderuje jej jako pozornie działającego przycisku.

## Trzy drogi

### Mapa

Tekst:

- „Szukam inspiracji”
- przycisk „Mapa”

Kliknięcie otwiera discovery overlay w trybie mapy.

### Wyszukiwarka

Tekst:

- „Znajdź konkret”
- przycisk „Szukaj”

Kliknięcie otwiera discovery overlay w trybie wyszukiwarki.

### Kategorie

Tekst:

- „Pokaż kategorie”
- przycisk „Kategorie”

Kliknięcie prowadzi do sekcji kategorii na stronie głównej.

## Sekcja kategorii

Nagłówek:

- „Wybierz tryb”
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

## Reguły wyboru

- Początkowo żadna opcja nie jest wybrana.
- W każdej grupie można wybrać maksymalnie jedną opcję.
- Wybranie innej opcji zastępuje poprzednią w tej samej grupie.
- Ponowne użycie aktywnej opcji usuwa wybór.
- Wyniki pojawiają się po wyborze co najmniej jednej opcji w dowolnej grupie.
- Od pierwszego wyboru zmiana dowolnej opcji aktualizuje wyniki.
- Usunięcie ostatniego wyboru ukrywa wyniki i przywraca stan początkowy.

Aktywny stan musi być widoczny nie tylko przez zmianę koloru.

## Wyniki

Po wykonaniu co najmniej jednego wyboru strona pokazuje:

- podsumowanie wybranych opcji,
- od trzech do czterech początkowych propozycji,
- w drugiej fazie: przycisk „Pokaż więcej”, jeżeli istnieją kolejne wyniki.

„Pokaż więcej” nie należy do bieżącego MVP. W drugiej fazie prowadzi do podstrony Kategorii z filtrem odpowiadającym wyborom ze strony głównej. Dokładna trasa, zachowanie filtra i zakres wyników zostaną opisane w specyfikacji tej podstrony. Do tego czasu prototyp pokazuje wyłącznie początkowe propozycje i nie renderuje nieaktywnego przycisku. Makieta przedstawia kierunek docelowego stanu z większym zbiorem danych.

Karty korzystają ze wspólnego modelu opisanego w [data-model.md](../../engineering/data-model.md).

## Kryteria akceptacji

- Wszystkie trzy drogi są widoczne jako równorzędne.
- Mapa i Szukaj otwierają właściwy tryb wspólnego overlaya.
- Kategorie prowadzą do odpowiedniej sekcji.
- Żadna kategoria nie jest zaznaczona domyślnie.
- Co najmniej jeden wybór generuje filtrowane wyniki; niewybrane grupy nie ograniczają filtrowania.
- Użytkownik może usunąć aktywny wybór.
- Wyniki aktualizują się po każdej zmianie, a usunięcie ostatniego wyboru je ukrywa.
- Każda główna sekcja wypełnia jeden ekran i nie jest wyższa niż ekran, zgodnie z regułą pełnoekranowych sekcji w [ui-system.md](../../design/ui-system.md).
- Nagłówek główny i panel wyboru dróg zachowują te same kotwice pionowe w mobilnych viewportach; punktem odniesienia jest iPhone 12 Pro (`390 × 844px`).
- Strzałka i kafel każdej drogi tworzą jedną grupę z górnym marginesem `2px`.
- Odstęp między drzewem a siatką dróg jest stały w mobilnych viewportach i zgodny z referencją Pixel 7 (`412 × 839px`).
- Odległość dolnej krawędzi notatki od ramki panelu jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Odległość dolnej ramki panelu wyboru dróg od końca pierwszej sekcji jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Układ spełnia wymagania responsywności i dostępności.
