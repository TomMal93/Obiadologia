# Strona przepisu

> Status: obowiązujący dla MVP (wersja wstępna)  
> Aktualizacja: przy zmianie zawartości lub zachowania trasy `/recipes/:slug`

## Cel

Strona przepisu jest celem nawigacji wszystkich trzech dróg odkrywania: karta wyniku z Kategorii, Wyszukiwarki i Mapy prowadzi do `/recipes/:slug`. Strona prezentuje jeden przepis na podstawie wspólnego modelu `Recipe` i pozwala wrócić do dalszego odkrywania.

Wersja wstępna prezentuje wyłącznie pola istniejące w modelu `Recipe` z [data-model.md](../../engineering/data-model.md). Treść redakcyjna spoza modelu (porcje, wartości odżywcze) pozostaje poza zakresem — zob. [mvp-scope.md](../mvp-scope.md).

## W zakresie

- trasa `/recipes/:slug` i jej prerendering;
- prezentacja pól modelu `Recipe` dla jednego przepisu;
- placeholder braku zdjęcia;
- powrót do strony głównej i współpraca z historią przeglądarki.

## Poza zakresem

- porcje, wartości odżywcze i inne pola spoza modelu `Recipe` — granice etapu definiuje [mvp-scope.md](../mvp-scope.md);
- docelowy zestaw przepisów i produkcyjne obrazy — otwarte `OPEN-003` i `OPEN-005` w [technical-decisions.md](../../engineering/technical-decisions.md);
- oceny, komentarze, zapisywanie ulubionych i udostępnianie — poza MVP.

## Zachowanie

- Trasa `/recipes/:slug` jest prerenderowana dla każdego przepisu o statusie `published`; slug spoza katalogu nie generuje strony.
- Strona używa wspólnego nagłówka z brandem prowadzącym do strony głównej.
- Strona prezentuje w kolejności: zdjęcie albo placeholder, pasek metadanych nad tytułem (tagi po lewej, czas przygotowania po prawej w jednej linii), tytuł (`h1`), opis, listę składników z nagłówkiem „Składniki”, opcjonalne etapy wspierające gotowanie („Wcześniej” i „Przygotowanie”) oraz kroki przygotowania z nagłówkiem „Kroki”.
- Każdy składnik pokazuje nazwę i grammaturę z pola `ingredients` ([data-model.md](../../engineering/data-model.md)). Przełącznik nad listą zmienia formę miary między metryczną (`gramy / ml`) a domową (`szklanki / szczypty`); domowa forma wynika z przeliczenia miary metrycznej i pozostaje w jednostce naturalnej tam, gdzie miara domowa nie ma sensu (liczba sztuk, masa bez znanej gęstości).
- Przełącznik jest wzbogaceniem progresywnym: bez skryptu strona pokazuje sprawną listę w formie metrycznej, a sam przełącznik pozostaje ukryty.
- Strona pokazuje kroki przygotowania z pola `steps` jako uporządkowaną, numerowaną listę (`ol`) w kolejności zapisanej w danych ([data-model.md](../../engineering/data-model.md)).
- Gdy przepis ma pole `advance`, strona pokazuje sekcję „Wcześniej” z czynnościami wykonywanymi z wyprzedzeniem; każda pozycja podaje wymagane wyprzedzenie po ludzku (np. „na 2 godz przed podaniem”) wyliczone z `leadTimeMinutes` ([data-model.md](../../engineering/data-model.md)).
- Gdy przepis ma pole `preparation`, strona pokazuje sekcję „Przygotowanie” (mise en place, kompletowanie sprzętu) jako listę wstępnych czynności przed krokami.
- Sekcja „Wcześniej” zawiera pomocnik startu: po podaniu pory podania strona wylicza godzinę rozpoczęcia każdej czynności (`pora − leadTimeMinutes`); start przed północą jest oznaczony jako dzień wcześniej. Pomocnik jest wzbogaceniem progresywnym — bez skryptu pozostaje ukryty, a sekcja i tak pokazuje wymagane wyprzedzenie.
- Gdy przepis ma choć jedną z sekcji `advance`/`preparation`, strona udostępnia przełącznik „Tryb asystenta / Tylko kroki”: „Tryb asystenta” pokazuje etapy wspierające, „Tylko kroki” zwija je do samej listy kroków. Przełącznik jest wzbogaceniem progresywnym — bez skryptu pozostaje ukryty, a strona pokazuje pełną treść. Przepis bez tych pól nie pokazuje przełącznika i wygląda jak sama lista kroków.
- Strona pokazuje wszystkie tagi w kolejności zapisanej w `tags`, nad tytułem po lewej, jako drobne etykiety pisane wielkimi literami (bez punktorów i bez tła pigułki); reguła „od jednego do trzech tagów” dotyczy karty wyniku, nie strony przepisu ([data-model.md](../../engineering/data-model.md)).
- Brak zdjęcia (`image: null`) pokazuje wspólny, dekoracyjny placeholder bez zmiany układu strony; placeholder nie powiela dostępnej nazwy przepisu ([data-model.md](../../engineering/data-model.md)).
- Link „Wróć do strony głównej” prowadzi do `/`. Przeglądarkowe „Wstecz” po wejściu z overlaya przywraca zawieszoną sesję discovery zgodnie z [discovery-overlay.md](./discovery-overlay.md).
- Do czasu rozstrzygnięcia źródła danych (`OPEN-003`) strona jawnie oznacza dane jako prototypowe i wskazuje, że pełna treść redakcyjna powstanie później.

## Prezentacja

Wspólne reguły wizualne (tokeny, typografia, jeden układ mobilny `320–480px`, progi `16px` tekstu i `44 × 44px` obszaru akcji) definiuje [ui-system.md](../../design/ui-system.md).

- Zdjęcie ma stałe proporcje i `object-fit: cover`; awaria lub brak obrazu nie zmienia geometrii strony.
- Treść wersji wstępnej jest projektowana tak, aby mieściła się na jednym ekranie telefonu; przy powiększeniu tekstu lub niższym ekranie strona rośnie i przewija się zgodnie z regułą reflow z [ui-system.md](../../design/ui-system.md).

## SEO

- Strona ma unikalny tytuł `„{tytuł przepisu} — Obiadologia”` i opis z pola `description` ([quality-requirements.md](../../engineering/quality-requirements.md)).
- Canonical i metadane udostępniania wymagają decyzji o docelowej domenie i zostaną dodane przed wdrożeniem produkcyjnym (`TD-016`, `OPEN-006`).

## Kryteria akceptacji

| # | Kryterium |
|---|---|
| 1 | Kliknięcie karty wyniku na dowolnej drodze otwiera `/recipes/:slug` z tytułem przepisu w `h1`. |
| 2 | Strona pokazuje opis, czas przygotowania, wszystkie tagi, pełną listę składników przepisu z grammaturą oraz numerowane kroki przygotowania. |
| 8 | Przełącznik jednostek zmienia formę miary składników między metryczną a domową i z powrotem; bez skryptu widoczna jest lista w formie metrycznej. |
| 9 | Przepis z polem `advance`/`preparation` pokazuje sekcje „Wcześniej”/„Przygotowanie” przed krokami; przepis bez tych pól ich nie pokazuje i nie udostępnia przełącznika trybu. |
| 10 | Pomocnik startu w sekcji „Wcześniej” wylicza godzinę rozpoczęcia każdej czynności z podanej pory podania; przełącznik „Tryb asystenta / Tylko kroki” zwija i przywraca etapy wspierające. Bez skryptu obie funkcje pozostają ukryte, a treść jest pełna. |
| 3 | Przy `image: null` widoczny jest dekoracyjny placeholder, a układ strony nie zmienia wymiarów. |
| 4 | Link „Wróć do strony głównej” prowadzi do `/`; „Wstecz” po wejściu z overlaya przywraca zawieszoną sesję. |
| 5 | Tytuł dokumentu i meta description są unikalne dla przepisu. |
| 6 | Strona przechodzi automatyczną kontrolę `axe-core`, działa klawiaturą i nie tworzy poziomego przewijania w zakresie `320–480px`. |
| 7 | Dane prototypowe są jawnie oznaczone jako prototypowe. |
