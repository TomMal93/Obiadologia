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

W układzie mobilnym środek komunikatu głównego znajduje się w połowie odległości między dolną krawędzią wspólnego nagłówka a górną krawędzią panelu wyboru dróg. Wysokość panelu wynika z responsywnie skalowanej zawartości, a odstęp między grupami akcji a notatką wynosi `22px`; krótsza ramka jest dosuwana do dolnej kotwicy pierwszej sekcji. Odstęp między dolną krawędzią notatki a ramką panelu jest stały, natomiast dolna kotwica panelu skaluje się płynnie od `16px` do `24px` zależnie od wysokości mobilnego viewportu. Kafel każdej drogi znajduje się pod jej tytułem i kolorową kreską, z lokalnym górnym marginesem `6px`; osobne strzałki nie są renderowane. Centralną ikonę drzewka otacza okrągły pierścień o średnicy dawnej poświaty: od godziny 12, zgodnie z ruchem wskazówek zegara, biegną kolejno jednolite wycinki Szukaj (koral), Mapa (niebieski) i Kategorie (zieleń), połączone wyłącznie wąskimi przejściami na stykach. Kolor zaczyna się od krycia `0.8`, utrzymuje je przez większość promienia, po czym dopiero blisko obrzeża zanika do pełnej przezroczystości na zewnętrznej krawędzi. Odstęp między drzewem a siatką trzech dróg jest stały i zgodny z referencją Pixel 7 (`412 × 839px` viewportu przeglądarki). Na ekranach zbyt niskich, by pomieścić całą kompozycję, zawartość pozostaje dostępna przez naturalne przewijanie dokumentu.

Każdy kafel drogi ma delikatne, półprzezroczyste obramowanie w kolorze swojej
ścieżki, wizualnie lżejsze od zewnętrznego obramowania panoramicznych kart
przepisów. Wszystkie trzy obszary akcji są kwadratami o identycznych wymiarach
i są subtelnie odsunięte od bocznych krawędzi swoich kolumn. Ikony i etykiety
skalują się proporcjonalnie wewnątrz kafli także przy najmniejszym obsługiwanym
viewporcie `320px`.

Ikona menu we wspólnym nagłówku otwiera mobilne menu nawigacyjne (hamburger). Menu jest wysuwanym panelem z przyciemnionym tłem i zawiera cztery pozycje: „Strona główna”, „Kategorie”, „Szukaj” i „Mapa”. „Strona główna” prowadzi do `/`, „Kategorie” do sekcji kategorii (`/#kategorie`), a „Szukaj” i „Mapa” otwierają właściwy tryb wspólnego overlaya — na stronie głównej bezpośrednio, a z pozostałych stron przez powrót na `/` i otwarcie trybu po wejściu. Logo i nazwa „Obiadologia” w nagłówku otwartego panelu prowadzą na stronę główną, tak samo jak brand wspólnego nagłówka strony: z innej strony przez przejście na `/`, a na samej stronie głównej przez domknięcie panelu i powrót na górę strony bez przeładowania. Menu jest obsługiwalne klawiaturą i czytnikiem ekranu: przycisk niesie stan `aria-expanded`, otwarcie przenosi fokus do panelu, brand i wszystkie pozycje pozostają w pętli fokusu, `Escape` oraz klik w tło zamykają menu i przywracają fokus na przycisk, a tło jest zablokowane na czas otwarcia. Zamknięte menu pozostaje poza kolejnością tabulacji i drzewem dostępności.

## Trzy drogi

Wprowadzenie do panelu:

- pigułka „Apetyt nie zawsze mówi pełnym zdaniem”,
- nagłówek „Rzuć pierwszą myśl na stół”.

Akcent komunikatu głównego, obramowanie panelu oraz pigułka przechodzą wspólnie
przez kolory trzech dróg. Jest to wyłącznie powolna zmiana koloru, bez ruchu i
zmiany geometrii, dlatego pozostaje aktywna także przy `prefers-reduced-motion`.

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
rozciąga się do dolnej krawędzi sekcji i zachowuje stałą wysokość
w danym viewporcie. Bezpośrednio pod jej nagłówkiem znajduje się pasek
podsumowania wyboru. Zmiana kryteriów nie przesuwa panelu ani nagłówka ramki;
zmienia się wyłącznie jej wnętrze:

- bez wyboru ramka pokazuje instrukcję „Tutaj pojawią się dopasowane przepisy.”,
- po dopasowaniu pokazuje od trzech do czterech początkowych propozycji,
- bez dopasowania pokazuje komunikat „Brak dopasowań. Zmień lub usuń wybrane kryterium.”,
- lista wypełnia dostępne wnętrze ramki, a gdy jest dłuższa, przewija się
  pionowo bez zmiany wysokości ramki; przewijalny obszar ma cienki scrollbar
  w kolorystyce Kategorii,
- w drugiej fazie: przycisk „Pokaż więcej”, jeżeli istnieją kolejne wyniki.

„Pokaż więcej” nie należy do bieżącego MVP. W drugiej fazie prowadzi do podstrony Kategorii z filtrem odpowiadającym wyborom ze strony głównej. Dokładna trasa, zachowanie filtra i zakres wyników zostaną opisane w specyfikacji tej podstrony. Do tego czasu prototyp pokazuje wyłącznie początkowe propozycje i nie renderuje nieaktywnego przycisku. Makieta przedstawia kierunek docelowego stanu z większym zbiorem danych.

Karty korzystają ze wspólnego modelu opisanego w [data-model.md](../../engineering/data-model.md)
i z tego samego panoramicznego wariantu prezentacyjnego co lista w discovery
overlayu: zdjęcie wypełnia kartę, a tytuł i czas są nałożone przy dolnej
krawędzi. Zgodnie ze wspólnym wzorcem z [ui-system.md](../../design/ui-system.md)
ramka karty oraz obrys liter tytułu i czasu używają zielonego koloru Kategorii. Brak
zdjęcia zachowuje tę samą geometrię i wspólny ciemny placeholder.

## Kryteria akceptacji

- Wszystkie trzy drogi są widoczne jako równorzędne.
- Akcent komunikatu głównego, obramowanie panelu i pigułka zmieniają kolor w tym
  samym rytmie także przy aktywnym `prefers-reduced-motion`.
- Ikona menu w nagłówku otwiera i zamyka mobilne menu nawigacyjne z pozycjami „Strona główna”, „Kategorie”, „Szukaj” i „Mapa”.
- Pozycje „Szukaj” i „Mapa” w menu otwierają właściwy tryb wspólnego overlaya, także wtedy, gdy wybór następuje z innej strony niż główna.
- Po otwarciu overlaya z menu (Szukaj lub Mapa) jego zamknięcie — przyciskiem, klawiszem `Escape` albo „Wstecz” — zawsze pozostawia użytkownika na stronie głównej, niezależnie od strony, z której nastąpił wybór.
- Logo i nazwa w nagłówku otwartego menu prowadzą na stronę główną: z innej strony przez nawigację na `/`, a na stronie głównej przez domknięcie panelu i powrót na górę strony.
- Menu jest obsługiwalne klawiaturą: `aria-expanded` odzwierciedla stan, otwarcie przenosi fokus do panelu, a `Escape` oraz klik w tło zamykają je i przywracają fokus na przycisk.
- Mapa i Szukaj otwierają właściwy tryb wspólnego overlaya.
- Kategorie prowadzą do odpowiedniej sekcji.
- Żadna kategoria nie jest zaznaczona domyślnie.
- „Szczegółowe wyszukiwanie” prowadzi do jawnego ekranu zastępczego, z którego można wrócić do sekcji Kategorii.
- Nagłówek sekcji Kategorii wraz z opisem rozpoczyna się `20px` od jej górnej krawędzi.
- Ramka „Propozycje dla Ciebie” sięga dolnej krawędzi sekcji, a lista przepisów
  wypełnia jej przewijalne wnętrze.
- Pasek pod grupami zawsze pokazuje przypomnienie albo jednoliniowe podsumowanie wyboru.
- Ramka wyników jest widoczna w każdym stanie i nie zmienia wysokości po wyborze, odznaczeniu ani braku dopasowań.
- Co najmniej jeden wybór generuje filtrowane wyniki; niewybrane grupy nie ograniczają filtrowania.
- Lista propozycji używa tego samego panoramicznego wariantu kart co discovery overlay.
- Użytkownik może usunąć aktywny wybór.
- Wyniki aktualizują się po każdej zmianie, a usunięcie ostatniego wyboru je ukrywa.
- Każda główna sekcja wypełnia jeden ekran i nie jest wyższa niż ekran, zgodnie z regułą pełnoekranowych sekcji w [ui-system.md](../../design/ui-system.md).
- Środek komunikatu głównego znajduje się w połowie odległości między dolną
  krawędzią wspólnego nagłówka a górną krawędzią panelu wyboru dróg.
- Panel jest dosuwany do dolnej kotwicy pierwszej sekcji.
- Kafel każdej drogi znajduje się bezpośrednio pod tytułem i kolorową kreską,
  ma górny margines `6px`, delikatne półprzezroczyste obramowanie w kolorze drogi,
  a osobna strzałka nie jest renderowana.
- Wszystkie trzy obszary akcji dróg są kwadratami o identycznej szerokości i
  wysokości, a ikony i etykiety zachowują proporcjonalną skalę.
- Centralną ikonę drzewka otacza pierścień o średnicy dawnej poświaty. Kolor ma
  krycie `0.8` w centrum i przez większość promienia, a dopiero blisko obrzeża
  zanika do pełnej przezroczystości. Pierścień tworzą trzy
  równe, jednolite wycinki: koralowy od godziny 12, następnie niebieski i zielony
  zgodnie z ruchem wskazówek zegara; tylko styki kolorów mają wąskie przejścia.
  Puls delikatnie zwiększa grubość pierścienia, a centralny węzeł pozostaje
  nieruchomy.
- Wysokość panelu dopasowuje się do responsywnej zawartości, a pionowy odstęp
  między każdą grupą akcji a notatką wynosi `22px`.
- Odstęp między drzewem a siatką dróg jest stały w mobilnych viewportach i zgodny z referencją Pixel 7 (`412 × 839px`).
- Odległość dolnej krawędzi notatki od ramki panelu jest stała w mobilnych viewportach i zgodna z referencją iPhone 12 Pro.
- Odległość dolnej ramki panelu wyboru dróg od końca pierwszej sekcji skaluje się płynnie od `16px` do `24px` zależnie od wysokości mobilnego viewportu.
- Układ spełnia wymagania responsywności i dostępności.
