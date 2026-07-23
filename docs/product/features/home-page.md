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

W układzie mobilnym środek komunikatu głównego znajduje się w połowie odległości między dolną krawędzią wspólnego nagłówka a górną krawędzią panelu wyboru dróg. Wysokość panelu wynika z responsywnie skalowanej zawartości, a odstęp między grupami akcji a notatką wynosi `22px`; krótsza ramka jest dosuwana do dolnej kotwicy pierwszej sekcji. Stałe są odstępy między dolną krawędzią notatki a ramką panelu oraz między dolną ramką panelu a końcem sekcji. Kafel każdej drogi znajduje się pod jej tytułem i kolorową kreską, z lokalnym górnym marginesem `6px`; osobne strzałki nie są renderowane. Centralną ikonę drzewka otacza okrągły pierścień o średnicy dawnej poświaty: od godziny 12, zgodnie z ruchem wskazówek zegara, biegną kolejno jednolite wycinki Szukaj (koral), Mapa (niebieski) i Kategorie (zieleń), połączone wyłącznie wąskimi przejściami na stykach. Kolor zaczyna się od krycia `0.8`, utrzymuje je przez większość promienia, po czym dopiero blisko obrzeża zanika do pełnej przezroczystości na zewnętrznej krawędzi. Odstęp między drzewem a siatką trzech dróg jest stały i zgodny z referencją Pixel 7 (`412 × 839px` viewportu przeglądarki). Na ekranach zbyt niskich, by pomieścić całą kompozycję, zawartość pozostaje dostępna przez naturalne przewijanie dokumentu.

Ikona menu we wspólnym nagłówku otwiera mobilne menu nawigacyjne (hamburger). Menu jest wysuwanym panelem z przyciemnionym tłem i zawiera cztery pozycje: „Strona główna”, „Kategorie”, „Szukaj” i „Mapa”. „Strona główna” prowadzi do `/`, „Kategorie” do sekcji kategorii (`/#kategorie`), a „Szukaj” i „Mapa” otwierają właściwy tryb wspólnego overlaya — na stronie głównej bezpośrednio, a z pozostałych stron przez powrót na `/` i otwarcie trybu po wejściu. Menu jest obsługiwalne klawiaturą i czytnikiem ekranu: przycisk niesie stan `aria-expanded`, otwarcie przenosi fokus do panelu, `Escape` oraz klik w tło zamykają menu i przywracają fokus na przycisk, a tło jest zablokowane na czas otwarcia. Zamknięte menu pozostaje poza kolejnością tabulacji i drzewem dostępności.

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
- Ikona menu w nagłówku otwiera i zamyka mobilne menu nawigacyjne z pozycjami „Strona główna”, „Kategorie”, „Szukaj” i „Mapa”.
- Pozycje „Szukaj” i „Mapa” w menu otwierają właściwy tryb wspólnego overlaya, także wtedy, gdy wybór następuje z innej strony niż główna.
- Po otwarciu overlaya z menu (Szukaj lub Mapa) jego zamknięcie — przyciskiem, klawiszem `Escape` albo „Wstecz” — zawsze pozostawia użytkownika na stronie głównej, niezależnie od strony, z której nastąpił wybór.
- Menu jest obsługiwalne klawiaturą: `aria-expanded` odzwierciedla stan, otwarcie przenosi fokus do panelu, a `Escape` oraz klik w tło zamykają je i przywracają fokus na przycisk.
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
- Centralną ikonę drzewka otacza pierścień o średnicy dawnej poświaty. Kolor ma
  krycie `0.8` w centrum i przez większość promienia, a dopiero blisko obrzeża
  zanika do pełnej przezroczystości. Pierścień tworzą trzy
  równe, jednolite wycinki: koralowy od godziny 12, następnie niebieski i zielony
  zgodnie z ruchem wskazówek zegara; tylko styki kolorów mają wąskie przejścia.
- Wysokość panelu dopasowuje się do responsywnej zawartości, a pionowy odstęp
  między każdą grupą akcji a notatką wynosi `22px`.
- Odstęp między drzewem a siatką dróg jest stały w mobilnych viewportach i zgodny z referencją Pixel 7 (`412 × 839px`).
- Odległość dolnej krawędzi notatki od ramki panelu jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Odległość dolnej ramki panelu wyboru dróg od końca pierwszej sekcji jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Układ spełnia wymagania responsywności i dostępności.
