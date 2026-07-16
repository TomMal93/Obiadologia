# Strona główna i Kategorie

> Status: obowiązujący  
> Makiety: `home-hero.png`, `home-browse-mode.png`

## Cel

Strona główna pomaga użytkownikowi rozpoznać swój aktualny stan i wybrać jedną z trzech dróg odkrywania dań.

Wspólne reguły wizualne opisuje [ui-system.md](../../design/ui-system.md).

## Struktura

Strona zawiera:

1. nagłówek z logo i menu,
2. główny komunikat „Co dziś jemy?”,
3. kartę wyboru jednej z trzech dróg,
4. sekcję kategorii,
5. listę propozycji wynikających z wyboru kategorii.

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
- „Połącz 3 wybory: pora dnia, tempo i okazja.”

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
- Wyniki pojawiają się dopiero po wyborze jednej opcji z każdej grupy.
- Zmiana dowolnego wyboru aktualizuje wyniki.

Aktywny stan musi być widoczny nie tylko przez zmianę koloru.

## Wyniki

Po wykonaniu trzech wyborów strona pokazuje:

- podsumowanie wybranych opcji,
- od trzech do czterech początkowych propozycji,
- przycisk „Pokaż więcej”, jeżeli istnieją kolejne wyniki.

Karty korzystają ze wspólnego modelu opisanego w [data-model.md](../../engineering/data-model.md).

## Kryteria akceptacji

- Wszystkie trzy drogi są widoczne jako równorzędne.
- Mapa i Szukaj otwierają właściwy tryb wspólnego overlaya.
- Kategorie prowadzą do odpowiedniej sekcji.
- Żadna kategoria nie jest zaznaczona domyślnie.
- Niekompletny wybór nie generuje filtrowanych wyników.
- Użytkownik może usunąć aktywny wybór.
- Wyniki aktualizują się po zmianie kompletu wyborów.
- Układ spełnia wymagania responsywności i dostępności.
