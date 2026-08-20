# Strona przepisu

> Status: obowiązujący dla MVP (wersja wstępna)  
> Aktualizacja: przy zmianie zawartości lub zachowania trasy `/recipes/:slug`

## Cel

Strona przepisu jest celem nawigacji wszystkich trzech dróg odkrywania: karta wyniku z Kategorii, Wyszukiwarki i Mapy prowadzi do `/recipes/:slug`. Strona prezentuje jeden przepis na podstawie wspólnego modelu `Recipe` i pozwala wrócić do dalszego odkrywania.

Wersja wstępna prezentuje wyłącznie pola istniejące w modelu `Recipe` z [data-model.md](../../engineering/data-model.md). Treść redakcyjna spoza modelu, w tym wartości odżywcze, pozostaje poza zakresem — zob. [mvp-scope.md](../mvp-scope.md).

## Referencja projektu

Interaktywny projekt [recipe-page.html](../../assets/ui/recipe-page.html) jest referencją kompozycji, hierarchii wizualnej i stanów interakcji strony przepisu. Niniejsza specyfikacja pozostaje źródłem prawdy dla zachowania, a [data-model.md](../../engineering/data-model.md) dla dostępnych danych. Element projektu wymagający pola spoza modelu nie może być uzupełniany fikcyjną wartością.

Z projektu obowiązują w MVP:

- pełnoszerokie zdjęcie hero lub placeholder z nakładką poprawiającą czytelność tekstu;
- akcja powrotu w lewym górnym rogu hero oraz tytuł i tagi na jego dolnej krawędzi;
- jasny, koralowy pasek metadanych bezpośrednio pod hero;
- jedna przewijana kolumna treści: opis, Składniki, przełącznik trybu gotowania, etapy wspierające i Kroki;
- opcjonalna sekcja porad „Coś jeszcze” po krokach;
- segmentowy przełącznik trybu gotowania;
- możliwość lokalnego odhaczania składników i wykonanych kroków;
- koral jako akcent strony, jasne powierzchnie, zwarte nagłówki i numerowane znaczniki kroków.

Sekcja „Kroki” ma nowszy kształt niż plik referencyjny: zamiast płaskiej listy prowadzi ścieżka z poziomym nawigatorem i niezależnie rozwijanymi etapami, opisana niżej w „Zachowaniu” i „Prezentacji”. Dla tej sekcji obowiązuje niniejsza specyfikacja, a pozostałe elementy projektu pozostają bez zmian.

Projekt pokazuje też kierunek dla elementów poza MVP. Ich widoczność w pliku referencyjnym nie rozszerza bieżącego zakresu:

| Element projektu | Status w MVP | Powód |
|---|---|---|
| wartości odżywcze | pominięte | brak danych w modelu i poza zakresem MVP |
| „Podobne przepisy” | pominięte | brak uzgodnionego kontraktu podobieństwa |
| przełącznik jednostek nad składnikami | pominięty | forma miary jest wyborem redakcyjnym pojedynczego składnika (`measure`), więc lista jest mieszana i nie ma czego przełączać |
| panel „Kiedy zacząć” | pominięty | tryb asystenta pokazuje etapy wspierające bez kalkulatora godziny rozpoczęcia |

## W zakresie

- trasa `/recipes/:slug` i jej prerendering;
- prezentacja pól modelu `Recipe` dla jednego przepisu;
- pasek trudności, bazowej liczby porcji i czasu oraz lokalne przeliczanie ilości składników;
- placeholder braku zdjęcia;
- lokalne, nietrwałe odhaczanie składników i kroków;
- opcjonalna sekcja porad redakcyjnych „Coś jeszcze”;
- powrót do strony głównej i współpraca z historią przeglądarki.

## Poza zakresem

- wartości odżywcze i inne pola spoza modelu `Recipe` — granice etapu definiuje [mvp-scope.md](../mvp-scope.md);
- sekcja podobnych przepisów;
- docelowy zestaw przepisów i produkcyjne obrazy — otwarte `OPEN-003` i `OPEN-005` w [technical-decisions.md](../../engineering/technical-decisions.md);
- oceny, komentarze, zapisywanie ulubionych i udostępnianie — poza MVP.

## Zachowanie

- Trasa `/recipes/:slug` jest prerenderowana dla każdego przepisu o statusie `published`; slug spoza katalogu nie generuje strony.
- Strona przepisu nie powiela wspólnego nagłówka. Pierwszym elementem jest hero z akcją powrotu, dzięki czemu zdjęcie i tytuł rozpoczynają stronę zgodnie z projektem.
- Strona prezentuje w kolejności: hero ze zdjęciem albo placeholderem, tytułem (`h1`) i tagami; pasek trudności, porcji i czasu przygotowania; opis; listę składników z nagłówkiem „Składniki”; opcjonalną sekcję wspierającą gotowanie „Zanim zaczniesz”; kroki przygotowania z nagłówkiem „Kroki”; opcjonalną sekcję porad „Coś jeszcze”.
- Każdy główny panel treści — „O daniu”, „Składniki”, „Zanim zaczniesz”, „Kroki” i opcjonalne „Coś jeszcze” — jest początkowo rozwinięty i można go niezależnie zwinąć oraz ponownie rozwinąć przyciskiem w nagłówku. Nagłówek pozostaje widoczny, kontrolka komunikuje nazwę sekcji i aktualny stan, a stan jest lokalny dla otwartej strony. Przycisk „Jak chcesz gotować?” steruje całym nadrzędnym panelem gotowania: razem zwija wybór trybu, przygotowanie, kroki i porady. Bez skryptu kontrolki pozostają ukryte, a cała dostępna w danym trybie treść jest widoczna.
- Zwijanie i rozwijanie sekcji jest ruchem ciągłym: treść pozostaje w całości, a kolejne linie odsłania i chowa krawędź sekcji schodząca do wysokości nagłówka. Odstęp między nagłówkiem a treścią maleje razem z nią, więc na końcu ruchu układ nie przeskakuje. Strzałka nagłówka obraca się w tym samym tempie, a przerwanie ruchu ponownym kliknięciem zawraca go z bieżącej klatki. Przy `prefers-reduced-motion` sekcja zmienia stan natychmiast, bez animacji.
- Pasek bezpośrednio pod hero ma trzy komórki: przetłumaczony poziom `difficulty`, bazową liczbę `servings` z akcjami zmniejszenia i zwiększenia oraz czas z `preparationMinutes`. Liczbę porcji można ustawić w zakresie `1–12`.
- Zmiana liczby porcji skaluje ilość każdego składnika względem bazowej wartości według reguły z [data-model.md](../../engineering/data-model.md). Każda pokazana forma miary — metryczna, domowa i obie połączone ukośnikiem — korzysta z przeliczonej ilości. Stan jest lokalny i resetuje się po opuszczeniu strony.
- Regulacja porcji jest wzbogaceniem progresywnym: bez skryptu strona pokazuje bazową liczbę porcji i bazowe ilości, a akcje zmiany pozostają ukryte.
- Składniki są podzielone według grup zakupowych z pola `category` ([data-model.md](../../engineering/data-model.md)). Puste grupy są pomijane. Każdy składnik pokazuje nazwę i jedną miarę.
- Strona nie ma przełącznika jednostek. Forma miary jest wyborem redakcyjnym pojedynczego składnika (`measure`): metryczna (`gramy / ml / sztuki`), domowa (`szklanki / łyżki / naturalne sztuki, plastry, kromki i garści`) albo obie rozdzielone ukośnikiem w kolejności `metryczna / domowa`, np. „80 g / 10 plastrów”. Lista jest więc celowo mieszana, a składnik bez wskazania pozostaje w formie metrycznej. Domowa forma jest zawsze wyliczana z ilości metrycznej: najpierw przez jawny przelicznik naturalnej miary `household`, następnie przez objętość lub `gramsPerCup`. Szczegóły, pierwszeństwo przeliczników i warunki dopuszczalności `measure` definiuje [data-model.md](../../engineering/data-model.md).
- Każdy składnik można odhaczyć niezależnie. Stan jest lokalny dla otwartej strony, nie zmienia danych przepisu i nie jest zapisywany między wizytami. Odhaczenie pokazuje znacznik oraz zmianę tekstu. Każda obecna grupa zakupowa ma własny licznik w wierszu swojego nagłówka, podający postęp „{wybrane}/{wszystkie}” wyłącznie dla składników tej grupy; po zebraniu całej grupy licznik pokazuje komplet. Nagłówek całej sekcji „Składniki” nie powiela globalnego licznika. Bez skryptu składniki pozostają zwykłą, kompletną listą, a kontrolki odhaczania i liczniki są ukryte.
- Strona pokazuje kroki przygotowania jako uporządkowaną, numerowaną listę (`ol`) w kolejności zapisanej w danych ([data-model.md](../../engineering/data-model.md)). Przepis bez etapów wspierających ma jedną listę z pola `steps`.
- Przepis z przygotowaniem wspierającym ma dwie wersje kroków i każdy tryb pokazuje własną. „Tryb asystenta” pokazuje `steps` — kroki właściwego gotowania, obok widocznej sekcji „Zanim zaczniesz”. „Tylko kroki” pokazuje `stepsOnly` — wersję samodzielną, która niesie także czynności ukrytej sekcji (krojenie, namoczenie, sprzęt), więc jest innym tekstem i może mieć inną liczbę kroków. Obie wersje mają wspólny nagłówek „Kroki”, a widoczna jest zawsze dokładnie jedna. Bez skryptu strona pokazuje przygotowanie razem z wersją asystenta, a wersja samodzielna pozostaje ukryta, aby ta sama instrukcja nie pojawiła się dwa razy.
- Kroki tworzą ścieżkę prowadzoną etap po etapie: nad kartami stoi jednorzędowy poziomy nawigator z numerami wszystkich etapów. Bieżący etap to pierwszy niewykonany; na wejściu rozwinięta jest tylko jego karta, a pozostałe pozostają zwinięte do jednoliniowej zapowiedzi treści. Wybranie numeru w nawigatorze rozwija odpowiadającą mu kartę. Karty rozwijają się niezależnie od siebie: kliknięcie nagłówka rozwija albo zwija wyłącznie własną kartę, więc czytelnik może trzymać otwartych kilka etapów naraz. Zmiana stanu karty przebiega tym samym ciągłym ruchem wysokości co zwijanie sekcji, a przy `prefers-reduced-motion` następuje natychmiast. Przy większej liczbie etapów nawigator może przewijać się poziomo, bez zwężania obszaru akcji poniżej `44 × 44px`.
- Rozwinięta karta etapu ma w wierszu sterowania widoczny nagłówek „Krok {numer}”, a w treści pokazuje kolejno: przypisane półkroki wraz z nagłówkiem „Przygotuj przed wykonaniem” i ich licznikiem, następnie pod linią rozdzielającą etykietę „Finalny krok”, treść kroku i wycentrowaną akcję „Oznacz jako zrobione” z pustym okręgiem. Nagłówek półkroków, ich licznik i etykieta „Finalny krok” należą wyłącznie do etapu z półkrokami. Zwinięta karta zachowuje etykietę „Krok {numer}” przed zapowiedzią treści. Etykieta pozostaje również dostępną nazwą kontrolek etapu.
- Kliknięcie akcji oznacza etap jako wykonany: pole nawigatora zamienia numer na ✓, pełna treść i jej zwinięty podgląd zostają przekreślone, karta zwija się do samej zapowiedzi treści, a ścieżka rozwija pierwszy etap wciąż do zrobienia — nie domykając kart, które czytelnik zostawił otwarte. Ponowne rozwinięcie wykonanego etapu pokazuje akcję w stanie „Zrobione”, której kliknięcie cofa wykonanie i zostawia etap rozwinięty. Krok nie jest usuwany, a stan nie jest zapisywany między wizytami. Bez skryptu strona pokazuje semantyczną listę `ol` z pełną treścią każdego etapu, bez nawigatora, zwijania, akcji i liczników.
- Pod listą półkroków etapu stoi ich licznik „{wykonane}/{wszystkie} wykonane” z poziomym wypełnieniem; obejmuje wyłącznie półkroki tego etapu, a po ich ukończeniu pokazuje „Przygotowanie gotowe”. Etap bez półkroków nie ma tego licznika. Bez skryptu licznik pozostaje ukryty.
- Po ukończeniu wszystkich właściwych kroków oraz obecnych w danej wersji półkroków, bezpośrednio pod ostatnim krokiem aktywnej listy pojawia się komunikat „Gratulacje, danie gotowe!”. „Tryb asystenta” i „Tylko kroki” obliczają komplet niezależnie. Cofnięcie dowolnej czynności danej listy ponownie ukrywa komunikat. Bez skryptu komunikat pozostaje ukryty.
- Gdy przepis ma pole `preparation`, strona pokazuje jeden panel „Zanim zaczniesz”. Czynności z `timing: day_before` trafiają do grupy „Nawet dzień wcześniej”, a `timing: just_in_time` do grupy „Tuż przed lub w trakcie”; pusta grupa nie jest renderowana. Podział czasu jest opisany tekstem, więc nie opiera się wyłącznie na kolorze ([data-model.md](../../engineering/data-model.md)).
- Opis panelu „Zanim zaczniesz” zachęca do zajrzenia do listy i wskazuje, że wcześniejsze przygotowanie może usprawnić późniejsze gotowanie. Panel korzysta ze wspólnego mechanizmu zwijania całych sekcji opisanego wyżej.
- Każdą czynność w „Zanim zaczniesz” można lokalnie oznaczyć jako wykonaną. Czynność pojawia się również w karcie etapu asystenta jako półkrok z tekstu `stepText`, bez własnego numeru, w bloku „Przygotuj przed wykonaniem” etapu wskazanego przez `beforeStep`. Blok poprzedza finalny krok, a wspólna karta i linia rozdzielająca pokazują, do którego kroku prowadzi. Półkrok ma kwadratowy checkbox bez dodatkowej akcji tekstowej; po oznaczeniu checkbox pokazuje ✓, a treść półkroku zostaje wyciszona i przekreślona, bez etykiety „Gotowe”. Odhaczenie w panelu albo przy półkroku synchronizuje oba miejsca i pozostawia możliwość cofnięcia. Odhaczenie właściwego kroku gotowania oznacza jako wykonane wyłącznie półkroki przypisane bezpośrednio do niego przez `beforeStep`; cofnięcie kroku cofa stan tych samych półkroków. Stan półkroków innych etapów pozostaje bez zmian. Stan resetuje się po opuszczeniu strony. Bez skryptu panel pozostaje zwykłą listą, a półkroki nie są powielane.
- Gdy przepis ma `preparation`, strona wymaga wybrania „Tryb asystenta” albo „Tylko kroki” przed pokazaniem dalszej części przepisu. Początkowo żadna opcja nie jest aktywna, a przygotowanie, kroki, porady i notatka prototypowa są ukryte. „Tryb asystenta” pokazuje „Zanim zaczniesz”, kroki w wersji `steps` i dalszą treść, natomiast „Tylko kroki” pomija przygotowanie i pokazuje samodzielną wersję kroków (`stepsOnly`) wraz z dalszą treścią. Wybór jest lokalny i resetuje się po opuszczeniu strony. Mechanizm jest wzbogaceniem progresywnym — bez skryptu wybór pozostaje ukryty, a strona pokazuje pełną treść. Przepis bez `preparation` nie pokazuje wyboru i od razu prezentuje kroki.
- Gdy przepis ma pole `tips`, strona pokazuje po krokach sekcję „Coś jeszcze” z poradami w kolejności zapisanej w danych. Brak pola nie pozostawia pustej sekcji. Porady są zwykłą treścią HTML i pozostają dostępne bez JavaScriptu.
- Strona pokazuje wszystkie tagi w kolejności zapisanej w `tags`, na dolnej nakładce hero pod tytułem, jako drobne etykiety pisane wielkimi literami, rozdzielone kropką (bez punktorów listy i bez tła pigułki); reguła „od jednego do trzech tagów” dotyczy karty wyniku, nie strony przepisu ([data-model.md](../../engineering/data-model.md)).
- Brak zdjęcia (`image: null`) pokazuje wspólny, dekoracyjny placeholder bez zmiany układu strony; placeholder nie powiela dostępnej nazwy przepisu ([data-model.md](../../engineering/data-model.md)).
- Widoczna akcja „Powrót” z ikoną chevronu w hero cofa do poprzedniego wpisu historii przeglądarki, dzięki czemu przywraca widok, z którego otwarto przepis — w tym zawieszoną sesję discovery zgodnie z [discovery-overlay.md](./discovery-overlay.md). Gdy przepis otwarto bezpośrednio i nie ma poprzedniego wpisu, link prowadzi awaryjnie do `/`. Dostępna nazwa wyjaśnia powrót do poprzedniego widoku.
- Do czasu rozstrzygnięcia źródła danych (`OPEN-003`) strona jawnie oznacza dane jako prototypowe i wskazuje, że pełna treść redakcyjna powstanie później.

## Prezentacja

Wspólne reguły wizualne (tokeny, typografia, jeden układ mobilny `320–480px`, progi `16px` tekstu i `44 × 44px` obszaru akcji) definiuje [ui-system.md](../../design/ui-system.md).

- Hero zajmuje pełną szerokość kontenera mobilnego, ma stałą wysokość w rytmie projektu i `object-fit: cover`; awaria lub brak obrazu nie zmienia jego geometrii.
- Dolna nakładka hero używa gradientu od przezroczystości do ciemnego koralu. Tagi i `h1` mają biały tekst oraz kontrast niezależny od zdjęcia.
- Akcja „Powrót” ma jasną powierzchnię, zaokrąglony kształt i minimalny obszar aktywny `44 × 44px`; pozostaje nad zdjęciem i nakładką.
- Akcje zmiany porcji są okrągłe, mają minimalny obszar aktywny `44 × 44px`, dostępne nazwy i stan `disabled` na granicach zakresu.
- Opis rozpoczyna właściwą kolumnę treści jako panel „O daniu” w tej samej neutralnej ramce i z takim samym nagłówkiem jak sekcja „Zanim zaczniesz”. Nie jest częścią koralowego paska metadanych.
- Sekcja „Składniki” korzysta z tej samej neutralnej ramki co panel „O daniu” i sekcja „Zanim zaczniesz”. Nagłówki grup zakupowych są mniejsze i lżejsze od nagłówka całej sekcji, ale zachowują koralowy kolor akcentu. Miara stoi przy prawej krawędzi wiersza składnika i pozostaje nierozdzielona; przy dłuższej nazwie łamie się nazwa, a nie miara.
- Licznik zebranych składników jest niewielkim wskaźnikiem z paskiem postępu w wierszu nagłówka każdej grupy składników. Pasek pokazuje bieżący postęp zebrania składników, a po zebraniu wszystkich składników licznik wskazuje komplet w koralowym kolorze akcentu. Cały ruch niesie `transition`, więc `prefers-reduced-motion` wycisza go wspólną regułą globalną, nie zmieniając stanów.
- Wybór sposobu gotowania i ujawniona po nim treść, aż do sekcji „Coś jeszcze” włącznie, tworzą jeden nadrzędny panel. Panel odróżnia się od neutralnych ramek większym promieniem, delikatnym koralowym tłem i subtelnym cieniem; poszczególne etapy zachowują wewnętrzne powierzchnie.
- Przed wyborem sposobu gotowania nadrzędny panel ma jednolite jasne tło bez widocznego gradientu oraz ten sam neutralny kolor obramowania co ramka „Składniki”. Po wybraniu trybu otrzymuje koralowy akcent, a gradient panelu gotowania płynnie narasta przez zmianę przezroczystości.
- Sekcje „Zanim zaczniesz” i „Kroki” korzystają z takiej samej neutralnej, jasnej ramki wewnątrz nadrzędnego panelu gotowania. Nawigator i osobno obramowane karty etapów zachowują lekkie, wspólne wcięcie wewnątrz ramki kroków.
- Etykiety „Przygotowanie” i „Gotowanie” porządkują oba etapy przepływu. Kroki gotowania mają postać ścieżki: poziomy nawigator używa zaokrąglonych prostokątów z numerami, bieżący etap ma koralowe wypełnienie i biały numer, a pozostałe jasne tło i koralowy obrys; wykonany etap pokazuje ✓. Rozwinięta karta zajmuje pełną szerokość ścieżki, ma delikatnie koralowe tło, koralowe obramowanie i nagłówek „Krok {numer}”, a zwinięta zostaje jasna i neutralna. Zwinięty wiersz mieści tę samą etykietę, jednoliniową, przyciętą zapowiedź treści i strzałkę stanu; zapowiedź wykonanego kroku jest przekreślona. Wewnątrz karty półkroki mają checkboxy i własny nagłówek, a finalny krok samą treść — bez znacznika z numerem — i wycentrowaną akcję w kształcie pigułki z pustym okręgiem; pełne koralowe wypełnienie z ✓ komunikuje stan wykonany.
- Strona przepisu jest długim dokumentem przewijanym w normalnym przepływie. Nie podlega regule „jedna sekcja = jeden ekran”; nie może mieć wewnętrznego przewijania całego artykułu ani ściskać treści do wysokości viewportu.
- Sekcja „Coś jeszcze” używa jasnego koralowego panelu z nagłówkiem w ciemnym koralu oraz dekoracyjnymi znacznikami porad, zgodnie z referencją projektu.

## SEO

- Strona ma unikalny tytuł `„{tytuł przepisu} — Obiadologia”` i opis z pola `description` ([quality-requirements.md](../../engineering/quality-requirements.md)).
- Canonical i metadane udostępniania wymagają decyzji o docelowej domenie i zostaną dodane przed wdrożeniem produkcyjnym (`TD-016`, `OPEN-006`).

## Kryteria akceptacji

| # | Kryterium |
|---|---|
| 1 | Kliknięcie karty wyniku na dowolnej drodze otwiera `/recipes/:slug` z tytułem przepisu w `h1`. |
| 2 | Strona pokazuje opis, trudność, bazową liczbę porcji, czas przygotowania, wszystkie tagi, pełną listę składników przepisu z grammaturą oraz numerowane kroki przygotowania. |
| 3 | Przy `image: null` widoczny jest dekoracyjny placeholder, a układ strony nie zmienia wymiarów. |
| 4 | Akcja „Powrót” w hero przywraca poprzedni widok z historii, w tym zawieszoną sesję discovery; przy bezpośrednim otwarciu przepisu prowadzi awaryjnie do `/`. |
| 5 | Tytuł dokumentu i meta description są unikalne dla przepisu. |
| 6 | Strona przechodzi automatyczną kontrolę `axe-core`, działa klawiaturą i nie tworzy poziomego przewijania w zakresie `320–480px`. |
| 7 | Dane prototypowe są jawnie oznaczone jako prototypowe. |
| 8 | Lista składników nie ma przełącznika jednostek, a każdy składnik pokazuje formę wskazaną w `measure`: metryczną, domową albo obie rozdzielone ukośnikiem; składnik bez wskazania pozostaje metryczny. Bez skryptu widoczne są te same miary. |
| 9 | Przepis z `preparation` pokazuje przed krokami jeden panel „Zanim zaczniesz”, rozdzielający czynności na grupy „Nawet dzień wcześniej” i „Tuż przed lub w trakcie”; pusta grupa jest pomijana. Opis wskazuje korzyść z wcześniejszego przygotowania. Każda czynność jest półkrokiem bez etykiety „Do zrobienia” przed wskazanym `beforeStep`, a jej odhaczenie w dowolnym z dwóch miejsc synchronizuje stan bez usuwania półkroku i pozostawia możliwość cofnięcia. Odhaczenie lub cofnięcie kroku gotowania zmienia stan wyłącznie półkroków bezpośrednio do niego przypisanych i nie wpływa na półkroki innych kroków. Przepis bez `preparation` nie pokazuje panelu ani przełącznika trybu. |
| 10 | Przed wyborem trybu żadna dalsza część przepisu nie jest widoczna i żadna opcja nie jest aktywna. Po wybraniu „Tryb asystenta” widoczne są etapy wspierające i kroki w wersji `steps`, bez panelu „Kiedy zacząć”; „Tylko kroki” ukrywa etapy wspierające i pokazuje samodzielną wersję kroków (`stepsOnly`), zawierającą czynności z ukrytych sekcji. Bez skryptu wybór pozostaje ukryty, a treść jest pełna. |
| 11 | Składniki i kroki można niezależnie odhaczać. Akcja etapu ma dostępną nazwę zawierającą swój widoczny tekst oraz numer etapu. Wykonany etap pokazuje ✓ na osi i przekreśloną treść, a po ponownym rozwinięciu pozwala cofnąć wykonanie; wykonany półkrok pokazuje ✓ w checkboxie. Stan ukończenia jest widoczny nie tylko kolorem, nie zmienia danych i resetuje się po opuszczeniu strony. Licznik w wierszu nagłówka każdej grupy składników podaje postęp wyłącznie tej grupy, zapełnia pasek postępu i po zebraniu całej grupy pokazuje komplet; nagłówek „Składniki” nie ma globalnego licznika. Bez skryptu kontrolki interakcji są ukryte, a obie listy pozostają kompletne i czytelne. |
| 12 | Hero, nakładka tytułu, trzykomórkowy pasek metadanych i kolejność treści odpowiadają `recipe-page.html`; elementy bez pól w modelu są pominięte bez pustych komórek i fikcyjnych danych. |
| 13 | Przepis z polem `tips` pokazuje po krokach sekcję „Coś jeszcze” ze wszystkimi poradami; bez pola sekcja nie jest renderowana. |
| 14 | Zmniejszenie lub zwiększenie liczby porcji w zakresie `1–12` proporcjonalnie przelicza każdą pokazaną formę miary, po obu stronach ukośnika włącznie; bez skryptu widoczne są bazowe porcje i ilości bez aktywnych kontrolek. |
| 15 | Składniki są podzielone na obecne w przepisie grupy zakupowe; grupowanie nie zmienia niezależnego stanu odhaczenia składników ani przeliczania miar, a prezentowany postęp jest liczony osobno dla każdej grupy. |
| 16 | W przepisie z przygotowaniem wspierającym „Tryb asystenta” i „Tylko kroki” pokazują różne teksty kroków: wersja samodzielna niesie czynności ukrytego panelu „Zanim zaczniesz”, a widoczna jest zawsze dokładnie jedna lista, także bez skryptu. Numeracja każdej wersji zaczyna się od jedynki i wraca po cofnięciu odhaczenia. |
| 17 | Każdy główny panel treści jest początkowo rozwinięty, ma dostępną kontrolkę zwijania w nagłówku i zachowuje niezależny stan. Zmiana stanu przebiega płynnie przez kolejne wysokości sekcji i kończy się bez przeskoku układu, a przy `prefers-reduced-motion` następuje natychmiast. Po zwinięciu nagłówek pozostaje widoczny, a bez JavaScriptu kontrolki są ukryte i treść pozostaje dostępna. |
| 18 | Ukończenie wszystkich czynności aktywnej listy pokazuje bezpośrednio pod ostatnim krokiem komunikat „Gratulacje, danie gotowe!”. Cofnięcie dowolnej czynności ukrywa komunikat, a obie wersje listy mają niezależny stan kompletu. |
| 19 | Nad krokami stoi poziomy nawigator numerów. Wybranie numeru rozwija odpowiadającą kartę. Na wejściu rozwinięty jest wyłącznie bieżący etap danej listy, a kliknięcie nagłówka rozwija albo zwija tylko własną kartę, więc otwartych może być kilka etapów naraz. Oznaczenie etapu jako wykonanego zwija jego kartę, przekreśla również tekst podglądu i rozwija pierwszy etap wciąż do zrobienia, nie ruszając pozostałych otwartych kart. Rozwinięta karta zachowuje widoczny nagłówek „Krok {numer}”. |
