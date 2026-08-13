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
- Każdy składnik można odhaczyć niezależnie. Stan jest lokalny dla otwartej strony, nie zmienia danych przepisu i nie jest zapisywany między wizytami. Odhaczenie pokazuje znacznik oraz zmianę tekstu, a licznik w wierszu nagłówka „Składniki” podaje postęp „{wybrane}/{wszystkie} zebrane”. Po zebraniu wszystkiego licznik zmienia się w znacznik kompletu. Bez skryptu składniki pozostają zwykłą, kompletną listą, a kontrolki odhaczania i licznik są ukryte.
- Strona pokazuje kroki przygotowania jako uporządkowaną, numerowaną listę (`ol`) w kolejności zapisanej w danych ([data-model.md](../../engineering/data-model.md)). Przepis bez etapów wspierających ma jedną listę z pola `steps`.
- Przepis z przygotowaniem wspierającym ma dwie wersje kroków i każdy tryb pokazuje własną. „Tryb asystenta” pokazuje `steps` — kroki właściwego gotowania, obok widocznej sekcji „Zanim zaczniesz”. „Tylko kroki” pokazuje `stepsOnly` — wersję samodzielną, która niesie także czynności ukrytej sekcji (krojenie, namoczenie, sprzęt), więc jest innym tekstem i może mieć inną liczbę kroków. Obie wersje mają wspólny nagłówek „Kroki”, a widoczna jest zawsze dokładnie jedna. Bez skryptu strona pokazuje przygotowanie razem z wersją asystenta, a wersja samodzielna pozostaje ukryta, aby ta sama instrukcja nie pojawiła się dwa razy.
- Każdy krok można lokalnie oznaczyć jako wykonany. Sekcja zapowiada tę interakcję instrukcją, a każdy aktywny krok pokazuje wycentrowaną, subtelną akcję z pustym okręgiem i tekstem „Oznacz jako zrobione”; stan oczekujący używa neutralnego tła, przygaszonego tekstu i lekkiego obramowania. Po odhaczeniu akcja redukuje się do samego, wypełnionego koralem okręgu z precyzyjnie wycentrowanym ✓; właściwy krok zachowuje pełny rozmiar i numer, a jego treść zostaje przekreślona. Ponowne kliknięcie całej karty przywraca stan niewykonany. Krok nie jest usuwany i nie przechodzi automatycznie dalej. Stan nie jest zapisywany między wizytami. Bez skryptu instrukcja i znaczniki akcji pozostają ukryte, a strona pokazuje semantyczną listę `ol` bez kontrolek ukończenia.
- Na dole ramki każdego właściwego kroku znajduje się jego lokalny licznik postępu „{wykonane}/{wszystkie} wykonane” z poziomym wypełnieniem. Dla kroku z półkrokami licznik obejmuje przypisane półkroki i właściwy krok; dla kroku bez półkroków ma zakres `0/1`. Po ukończeniu całej grupy pokazuje po prawej etykietę i liczbę elementów, np. „Komplet · 4 kroki” albo „Komplet · 1 krok”. Bez skryptu licznik pozostaje ukryty.
- Po ukończeniu wszystkich właściwych kroków oraz obecnych w danej wersji półkroków, bezpośrednio pod ostatnim krokiem aktywnej listy pojawia się komunikat „Gratulacje, danie gotowe!”. „Tryb asystenta” i „Tylko kroki” obliczają komplet niezależnie. Cofnięcie dowolnej czynności danej listy ponownie ukrywa komunikat. Bez skryptu komunikat pozostaje ukryty.
- Gdy przepis ma pole `preparation`, strona pokazuje jeden panel „Zanim zaczniesz”. Czynności z `timing: day_before` trafiają do grupy „Nawet dzień wcześniej”, a `timing: just_in_time` do grupy „Tuż przed lub w trakcie”; pusta grupa nie jest renderowana. Podział czasu jest opisany tekstem, więc nie opiera się wyłącznie na kolorze ([data-model.md](../../engineering/data-model.md)).
- Opis panelu „Zanim zaczniesz” zachęca do zajrzenia do listy i wskazuje, że wcześniejsze przygotowanie może usprawnić późniejsze gotowanie. Panel korzysta ze wspólnego mechanizmu zwijania całych sekcji opisanego wyżej.
- Każdą czynność w „Zanim zaczniesz” można lokalnie oznaczyć jako wykonaną. Czynność pojawia się również na liście asystenta jako wizualnie lżejszy półkrok z tekstu `stepText`, bez własnego numeru, wewnątrz wspólnej powierzchni z krokiem `steps` wskazanym przez `beforeStep`. Półkroki poprzedzają ten krok, a wspólna ramka i ciągły akcent wizualny pokazują, do którego kroku prowadzą. Aktywny półkrok ma wycentrowany pionowo, pusty kwadratowy checkbox bez dodatkowej akcji tekstowej; po oznaczeniu checkbox pokazuje ✓, a półkrok płynnie minimalizuje się do jednoliniowego, przekreślonego fragmentu treści zapisanego mniejszą czcionką, bez etykiety „Gotowe”. Cofnięcie stanu płynnie rozwija pełną treść. Zmiana wysokości i wewnętrznego układu korzysta ze wspólnego, łagodnego tempa bez zanikania treści: przez cały ruch tekst pozostaje w całości, a kolejne linie odsłania i chowa krawędź zwijanej ramki, więc treść nie znika skokowo. Checkbox przez cały ruch pozostaje wycentrowany w pionie względem widocznej wysokości półkroku, a linia rozdzielająca nie zanika. Animacja działa także przy zbiorczej zmianie półkroków przez właściwy krok; przy `prefers-reduced-motion` stan zmienia się natychmiast, bez animacji i przejść. Odhaczenie w panelu albo przy półkroku synchronizuje oba miejsca i pozostawia możliwość cofnięcia. Odhaczenie właściwego kroku gotowania oznacza jako wykonane wyłącznie półkroki przypisane bezpośrednio do niego przez `beforeStep`; cofnięcie kroku cofa stan tych samych półkroków. Stan półkroków wcześniejszych i późniejszych kroków pozostaje bez zmian. Ponowne kliknięcie całej karty półkroku cofa jego stan. Stan resetuje się po opuszczeniu strony. Bez skryptu panel pozostaje zwykłą listą, a półkroki nie są powielane.
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
- Licznik zebranych składników jest niewielkim, pozbawionym obramowania wskaźnikiem w wierszu nagłówka „Składniki”, umieszczonym przed kontrolką zwijania. Dyskretny pierścień pokazuje postęp bez nasycania całego tła kolorem. Komplet zastępuje pierścień znakiem ✓ i otrzymuje jedynie łagodne koralowe tło bez cienia. Cały ruch niesie `transition`, więc `prefers-reduced-motion` wycisza go wspólną regułą globalną, nie zmieniając stanów.
- Wybór sposobu gotowania i ujawniona po nim treść, aż do sekcji „Coś jeszcze” włącznie, tworzą jeden nadrzędny panel. Panel odróżnia się od neutralnych ramek większym promieniem, delikatnym koralowym tłem i subtelnym cieniem; poszczególne etapy zachowują wewnętrzne powierzchnie.
- Przed wyborem sposobu gotowania nadrzędny panel ma jednolite jasne tło bez widocznego gradientu oraz ten sam neutralny kolor obramowania co ramka „Składniki”. Po wybraniu trybu otrzymuje koralowy akcent, a gradient panelu gotowania płynnie narasta przez zmianę przezroczystości.
- Sekcje „Zanim zaczniesz” i „Kroki” korzystają ze wspólnej neutralnej, jasnej ramki.
- Etykiety „Przygotowanie” i „Gotowanie” porządkują oba etapy przepływu. Wszystkie właściwe kroki, w obu trybach i niezależnie od obecności półkroków, korzystają z tej samej jednolitej, delikatnie koralowej ramki bez pogrubienia którejkolwiek krawędzi. Półkroki i krok gotowania, do którego prowadzą, tworzą jedną grupę; półkroki odróżniają się lżejszym tłem, checkboxem i subtelnym separatorem. Każdy właściwy krok gotowania ma numer, tekst i wycentrowaną akcję „Oznacz jako zrobione” z pustym okręgiem; pełne koralowe wypełnienie z ✓ komunikuje stan wykonany. W stanie wykonanym treść kroku zostaje przekreślona, a karta zachowuje pełny rozmiar i numer; półkroki nadal minimalizują się do zwartego stanu.
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
| 11 | Składniki i kroki można niezależnie odhaczać; klikalność kroków jest jawnie opisana nad listą i przez dostępne nazwy kontrolek. Wykonany właściwy krok zachowuje pełny rozmiar i numer, ma przekreśloną treść oraz wypełniony znacznik ✓; wykonany półkrok minimalizuje się do przekreślonego fragmentu bez etykiety stanu. Oba pozostawiają możliwość przywrócenia. Stan ukończenia jest widoczny nie tylko kolorem, nie zmienia danych i resetuje się po opuszczeniu strony. Licznik w wierszu nagłówka „Składniki” podaje aktualny postęp, domyka pierścień i po zebraniu wszystkiego pokazuje komplet. Bez skryptu instrukcje interakcji są ukryte, a obie listy pozostają kompletne i czytelne. |
| 12 | Hero, nakładka tytułu, trzykomórkowy pasek metadanych i kolejność treści odpowiadają `recipe-page.html`; elementy bez pól w modelu są pominięte bez pustych komórek i fikcyjnych danych. |
| 13 | Przepis z polem `tips` pokazuje po krokach sekcję „Coś jeszcze” ze wszystkimi poradami; bez pola sekcja nie jest renderowana. |
| 14 | Zmniejszenie lub zwiększenie liczby porcji w zakresie `1–12` proporcjonalnie przelicza każdą pokazaną formę miary, po obu stronach ukośnika włącznie; bez skryptu widoczne są bazowe porcje i ilości bez aktywnych kontrolek. |
| 15 | Składniki są podzielone na obecne w przepisie grupy zakupowe; grupowanie nie zmienia wspólnego postępu odhaczania ani przeliczania miar. |
| 16 | W przepisie z przygotowaniem wspierającym „Tryb asystenta” i „Tylko kroki” pokazują różne teksty kroków: wersja samodzielna niesie czynności ukrytego panelu „Zanim zaczniesz”, a widoczna jest zawsze dokładnie jedna lista, także bez skryptu. Numeracja każdej wersji zaczyna się od jedynki i wraca po cofnięciu odhaczenia. |
| 17 | Każdy główny panel treści jest początkowo rozwinięty, ma dostępną kontrolkę zwijania w nagłówku i zachowuje niezależny stan. Zmiana stanu przebiega płynnie przez kolejne wysokości sekcji i kończy się bez przeskoku układu, a przy `prefers-reduced-motion` następuje natychmiast. Po zwinięciu nagłówek pozostaje widoczny, a bez JavaScriptu kontrolki są ukryte i treść pozostaje dostępna. |
| 18 | Ukończenie wszystkich czynności aktywnej listy pokazuje bezpośrednio pod ostatnim krokiem komunikat „Gratulacje, danie gotowe!”. Cofnięcie dowolnej czynności ukrywa komunikat, a obie wersje listy mają niezależny stan kompletu. |
