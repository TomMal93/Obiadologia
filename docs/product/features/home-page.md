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

Ikona menu widoczna na makiecie zapowiada późniejszą nawigację i nie należy do bieżącego przepływu MVP. Dopóki zakres oraz zawartość menu nie zostaną określone, implementacja nie renderuje jej jako pozornie działającego przycisku.

## Trzy drogi

### Mapa

Tekst:

- „Nie wiem, czego chcę”
- „nastrój · tempo · inspiracja”
- przycisk „Mapa”

Kliknięcie otwiera discovery overlay w trybie mapy.

### Wyszukiwarka

Tekst:

- „Wiem, czego szukam”
- „składnik · danie · smak”
- przycisk „Szukaj”

Kliknięcie otwiera discovery overlay w trybie wyszukiwarki.

### Kategorie

Tekst:

- „Chcę przeglądać”
- „kategoria · okazja · sytuacja”
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
- Układ spełnia wymagania responsywności i dostępności.
