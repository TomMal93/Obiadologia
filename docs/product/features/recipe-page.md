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
- Strona prezentuje w kolejności: hero ze zdjęciem albo placeholderem, tytułem (`h1`) i tagami; pasek trudności, porcji i czasu przygotowania; opis; listę składników z nagłówkiem „Składniki”; opcjonalne etapy wspierające gotowanie („Wcześniej” i „Przygotowanie”); kroki przygotowania z nagłówkiem „Kroki”; opcjonalną sekcję porad „Coś jeszcze”.
- Pasek bezpośrednio pod hero ma trzy komórki: przetłumaczony poziom `difficulty`, bazową liczbę `servings` z akcjami zmniejszenia i zwiększenia oraz czas z `preparationMinutes`. Liczbę porcji można ustawić w zakresie `1–12`.
- Zmiana liczby porcji skaluje ilość każdego składnika względem bazowej wartości według reguły z [data-model.md](../../engineering/data-model.md). Każda pokazana forma miary — metryczna, domowa i obie połączone ukośnikiem — korzysta z przeliczonej ilości. Stan jest lokalny i resetuje się po opuszczeniu strony.
- Regulacja porcji jest wzbogaceniem progresywnym: bez skryptu strona pokazuje bazową liczbę porcji i bazowe ilości, a akcje zmiany pozostają ukryte.
- Składniki są podzielone według grup zakupowych z pola `category` ([data-model.md](../../engineering/data-model.md)). Puste grupy są pomijane. Każdy składnik pokazuje nazwę i jedną miarę.
- Strona nie ma przełącznika jednostek. Forma miary jest wyborem redakcyjnym pojedynczego składnika (`measure`): metryczna (`gramy / ml / sztuki`), domowa (`szklanki / łyżki / naturalne sztuki, plastry, kromki i garści`) albo obie rozdzielone ukośnikiem w kolejności `metryczna / domowa`, np. „80 g / 10 plastrów”. Lista jest więc celowo mieszana, a składnik bez wskazania pozostaje w formie metrycznej. Domowa forma jest zawsze wyliczana z ilości metrycznej: najpierw przez jawny przelicznik naturalnej miary `household`, następnie przez objętość lub `gramsPerCup`. Szczegóły, pierwszeństwo przeliczników i warunki dopuszczalności `measure` definiuje [data-model.md](../../engineering/data-model.md).
- Każdy składnik można odhaczyć niezależnie. Stan jest lokalny dla otwartej strony, nie zmienia danych przepisu i nie jest zapisywany między wizytami. Odhaczenie pokazuje znacznik oraz zmianę tekstu, a licznik w wierszu nagłówka „Składniki” podaje postęp „{wybrane}/{wszystkie} zebrane”. Po zebraniu wszystkiego licznik zmienia się w znacznik kompletu. Bez skryptu składniki pozostają zwykłą, kompletną listą, a kontrolki odhaczania i licznik są ukryte.
- Strona pokazuje kroki przygotowania z pola `steps` jako uporządkowaną, numerowaną listę (`ol`) w kolejności zapisanej w danych ([data-model.md](../../engineering/data-model.md)).
- Każdy krok można lokalnie oznaczyć jako wykonany. Numer zmienia się wtedy w znacznik, a tekst otrzymuje drugi, niekolorystyczny sygnał ukończenia. Oznaczenie nie zwija kroku, nie przechodzi automatycznie dalej i nie jest zapisywane między wizytami. Bez skryptu pozostaje semantyczna lista `ol` bez kontrolek ukończenia.
- Gdy przepis ma pole `advance`, strona pokazuje sekcję „Wcześniej” z czynnościami wykonywanymi z wyprzedzeniem; każda pozycja podaje wymagane wyprzedzenie po ludzku (np. „na 2 godz przed podaniem”) wyliczone z `leadTimeMinutes` ([data-model.md](../../engineering/data-model.md)).
- Gdy przepis ma pole `preparation`, strona pokazuje sekcję „Przygotowanie” (mise en place, kompletowanie sprzętu) jako listę wstępnych czynności przed krokami.
- Tryb asystenta zaczyna się panelem „Kiedy zacząć”. Po podaniu pory podania pokazuje rozpoczęcie głównego gotowania (`pora − preparationMinutes`), a przy każdej czynności „Wcześniej” godzinę jej rozpoczęcia (`pora − leadTimeMinutes`); start przypadający poprzedniego dnia jest jednoznacznie oznaczony. Pomocnik jest wzbogaceniem progresywnym — bez skryptu pozostaje ukryty, a sekcja i tak pokazuje wymagane wyprzedzenie.
- Gdy przepis ma choć jedną z sekcji `advance`/`preparation`, strona wymaga wybrania „Tryb asystenta” albo „Tylko kroki” przed pokazaniem dalszej części przepisu. Początkowo żadna opcja nie jest aktywna, a etapy wspierające, kroki, porady i notatka prototypowa są ukryte. „Tryb asystenta” pokazuje pełne prowadzenie, kroki i dalszą treść, natomiast „Tylko kroki” pomija etapy wspierające i pokazuje kroki wraz z dalszą treścią. Wybór jest lokalny i resetuje się po opuszczeniu strony. Mechanizm jest wzbogaceniem progresywnym — bez skryptu wybór pozostaje ukryty, a strona pokazuje pełną treść. Przepis bez pól `advance`/`preparation` nie pokazuje wyboru i od razu prezentuje kroki.
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
- Opis rozpoczyna właściwą kolumnę treści jako panel „O daniu” w tej samej neutralnej ramce i z takim samym nagłówkiem jak sekcja „Przygotowanie”. Nie jest częścią koralowego paska metadanych.
- Sekcja „Składniki” korzysta z tej samej neutralnej ramki co panel „O daniu” i sekcja „Przygotowanie”. Miara stoi przy prawej krawędzi wiersza składnika i pozostaje nierozdzielona; przy dłuższej nazwie łamie się nazwa, a nie miara.
- Licznik zebranych składników jest pigułką w wierszu nagłówka „Składniki”, dosuniętą do prawej krawędzi sekcji. Niesie pierścień postępu, który domyka się razem z odhaczaniem, a tło pigułki nasyca się koralem proporcjonalnie do postępu. Komplet zamienia pigułkę w pełny koralowy znacznik ze znakiem ✓. Cały ruch niesie `transition`, więc `prefers-reduced-motion` wycisza go wspólną regułą globalną, nie zmieniając stanów.
- Wybór sposobu gotowania i ujawniona po nim treść, aż do sekcji „Coś jeszcze” włącznie, tworzą jeden nadrzędny panel. Panel odróżnia się od neutralnych ramek większym promieniem, delikatnym koralowym tłem i subtelnym cieniem; poszczególne etapy zachowują wewnętrzne powierzchnie.
- Pomocnik „Kiedy zacząć” używa tej samej jasnej koralowej powierzchni, promienia, paddingu, rytmu odstępów i koloru nagłówka co panel „Coś jeszcze”, uzupełnionych delikatnym koralowym obramowaniem wspólnym z nadrzędnym panelem wyboru trybu. Pole czasu w pomocniku pozostaje minimalistyczne. Sekcje „Przygotowanie” i „Kroki” korzystają ze wspólnej neutralnej, jasnej ramki.
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
| 9 | Przepis z polem `advance`/`preparation` pokazuje sekcje „Wcześniej”/„Przygotowanie” przed krokami; przepis bez tych pól ich nie pokazuje i nie udostępnia przełącznika trybu. |
| 10 | Przed wyborem trybu żadna dalsza część przepisu nie jest widoczna i żadna opcja nie jest aktywna. Po wybraniu „Tryb asystenta” pomocnik „Kiedy zacząć” wylicza początek głównego gotowania i godzinę rozpoczęcia każdej czynności z wyprzedzeniem; „Tylko kroki” pokazuje kroki bez etapów wspierających. Bez skryptu wybór i pomocnik pozostają ukryte, a treść jest pełna. |
| 11 | Składniki i kroki można niezależnie odhaczać; stan ukończenia jest widoczny nie tylko kolorem, nie zmienia danych i resetuje się po opuszczeniu strony. Licznik w wierszu nagłówka „Składniki” podaje aktualny postęp, domyka pierścień i po zebraniu wszystkiego pokazuje komplet. Bez skryptu obie listy pozostają kompletne i czytelne. |
| 12 | Hero, nakładka tytułu, trzykomórkowy pasek metadanych i kolejność treści odpowiadają `recipe-page.html`; elementy bez pól w modelu są pominięte bez pustych komórek i fikcyjnych danych. |
| 13 | Przepis z polem `tips` pokazuje po krokach sekcję „Coś jeszcze” ze wszystkimi poradami; bez pola sekcja nie jest renderowana. |
| 14 | Zmniejszenie lub zwiększenie liczby porcji w zakresie `1–12` proporcjonalnie przelicza każdą pokazaną formę miary, po obu stronach ukośnika włącznie; bez skryptu widoczne są bazowe porcje i ilości bez aktywnych kontrolek. |
| 15 | Składniki są podzielone na obecne w przepisie grupy zakupowe; grupowanie nie zmienia wspólnego postępu odhaczania ani przeliczania miar. |
