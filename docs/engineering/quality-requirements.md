# Wymagania jakościowe

> Status: obowiązujące dla MVP  
> Aktualizacja: gdy zmienia się wspierane środowisko, ryzyko lub sposób weryfikacji

## Cel

Te wymagania są bramką jakości bieżącego etapu. Funkcja nie jest ukończona wyłącznie dlatego, że wygląda jak makieta — musi być dostępna, zachowywać spójny układ mobilny i reagować bez zauważalnych opóźnień.

## W zakresie

- dostępność, responsywność i kompatybilność;
- wydajność, bezpieczeństwo, SEO i lokalizacja;
- minimalna strategia testów i Definition of Done.

## Poza zakresem

- wybór narzędzi i dostawcy hostingu;
- szczegółowa konfiguracja CI;
- wymagania dla funkcji odłożonych na kolejne etapy: docelowe dane, pełna treść redakcyjna przepisów, produkcyjne obrazy, analityka i pełne opracowanie wizualne stanów danych;
- osobne układy tabletowe i desktopowe.

## Dostępność

- Interfejs MUSI spełniać WCAG 2.2 AA.
- Wszystkie działania MUSZĄ być możliwe klawiaturą; fokus jest zawsze widoczny.
- Używamy semantycznego HTML, etykiet formularzy, poprawnej hierarchii nagłówków i nazw dostępności.
- Dialog zarządza fokusem, `Escape`, powrotem fokusu oraz blokadą tła.
- Zmiany wyników i błędy asynchroniczne są ogłaszane przez odpowiedni live region bez nadmiernych komunikatów.
- Kontrast tekstu, kontrolek i fokusu musi być sprawdzany automatycznie i ręcznie.
- Animacje respektują `prefers-reduced-motion`.

## Responsywność i kompatybilność

- Jeden układ mobilny od szerokości `320px` do `480px`; brak poziomego przewijania treści.
- Na ekranach szerszych niż `480px` aplikacja zachowuje układ mobilny w wyśrodkowanym kontenerze o maksymalnej szerokości `480px`.
- Obowiązkowe szerokości kontroli: `320`, `375`, `390`, `430` i `480px`; dodatkowa kontrola na `768px` potwierdza wyśrodkowanie kontenera bez zmiany układu.
- Do obowiązkowych szerokości dochodzi kontrola reprezentatywnej niskiej i wysokiej wysokości telefonu, aby potwierdzić, że pełnoekranowe sekcje wypełniają jeden ekran bez ucięć i pustych obszarów.
- W całym zakresie mobilnym układ, kolejność i rytm odstępów sekcji pozostają spójne; różnice między telefonami są proporcjonalne, a nie strukturalne. Normatywną regułę definiuje [ui-system.md](../design/ui-system.md).
- Żaden element nie jest ucięty ani nie przepełnia sekcji, treść nie tworzy poziomego przewijania, a elementy nie nachodzą na siebie ani się nie rozjeżdżają między rozmiarami telefonów.
- Skalowanie proporcjonalne nie schodzi poniżej progów dostępności: tekst interfejsu `16px`, obszar akcji `44 × 44px` i kontrast WCAG 2.2 AA.
- Wspieramy dwie najnowsze stabilne wersje Chrome, Edge, Firefox i Safari w momencie wydania.
- Interfejs dotykowy ma obszary akcji minimum `44 × 44px`.
- Overlay używa dynamicznej wysokości viewportu i pozostaje obsługiwalny po otwarciu klawiatury ekranowej.

## Wydajność

Docelowe cele po wdrożeniu produkcyjnym, mierzone dla 75. percentyla danych terenowych na urządzeniach mobilnych:

| Metryka | Cel |
|---|---:|
| LCP | `≤ 2.5s` |
| INP | `≤ 200ms` |
| CLS | `≤ 0.1` |

Do czasu wdrożenia zgodnego z zaakceptowanym mechanizmem pomiarowym powyższe wartości są celami produkcyjnymi, a nie możliwą do zebrania bramką danych terenowych. MVP MUSI przed wdrożeniem przejść pomiar laboratoryjny LCP i CLS dla reprezentatywnego profilu telefonu oraz sieci mobilnej; wynik, narzędzie i profil pomiaru należy zapisać razem z weryfikacją. Laboratoryjna ocena responsywności interakcji korzysta z budżetów wyszukiwania i pracy głównego wątku opisanych poniżej. Cel INP staje się mierzalną bramką terenową dopiero po osobnym zaakceptowaniu mechanizmu pomiarowego zgodnego z wymaganiami prywatności.

- Obrazy MUSZĄ mieć prawidłowe wymiary, nowoczesny format i leniwe ładowanie poza pierwszym widokiem.
- Element LCP nie może być ładowany leniwie; jego zasób powinien mieć właściwy priorytet.
- Fonty powinny mieć ograniczoną liczbę odmian, preload tylko gdy uzasadniony i bez blokowania tekstu.
- Wyszukiwanie i przesuwanie punktu mapy nie może blokować interfejsu. Wyszukiwanie może używać debounce około `200ms`; mapa powinna ograniczać częstotliwość obliczeń bez opóźniania wizualnego ruchu punktu.
- Dla katalogu do 100 przepisów obliczenie wyników wyszukiwania po przygotowaniu indeksu powinno mieścić się w jednej klatce (`≤ 16ms` dla 95. percentyla na reprezentatywnym telefonie), a przygotowanie indeksu nie może utworzyć długiego zadania przekraczającego `50ms` na głównym wątku. Niespełnienie celu wymaga profilowania i ponownego rozważenia implementacji `RecipeSearch`.
- Budżety rozmiaru paczek zostaną dopisane po utworzeniu i zmierzeniu pierwszego działającego pionowego wycinka w wybranym stosie.

## Odporność i stany danych

Bieżący prototyp MUSI poprawnie odróżniać stan początkowy, sukces i brak dopasowań dla lokalnych danych zastępczych. Nie symuluje ładowania ani błędu, jeżeli nie wykonuje rzeczywistej operacji asynchronicznej.

Po podłączeniu źródła asynchronicznego implementacja MUSI dodatkowo obsłużyć ładowanie, błąd i ponowienie bez utraty aktualnych kryteriów. Pełne opracowanie wizualne wszystkich stanów należy do kolejnego etapu; podstawowy kontrakt zachowania obowiązuje od chwili pojawienia się danego stanu w aplikacji.

Dane i komunikaty zastępcze muszą być jawnie oznaczone jako prototypowe i nie mogą być przedstawiane jako zatwierdzone rozwiązanie produkcyjne. Awaria obrazu nie może zmieniać geometrii karty.

## Bezpieczeństwo i prywatność

- MVP nie wymaga konta ani danych wrażliwych; nie dodajemy ich bez osobnej decyzji.
- Dane wejściowe są walidowane i kodowane na granicy systemu; renderowany tekst nie może wykonywać HTML ani skryptów.
- Sekrety nie trafiają do kodu klienta, repozytorium ani dokumentacji.
- Zależności i nagłówki bezpieczeństwa należy sprawdzać w CI po utworzeniu kodu aplikacji i skonfigurowaniu wybranego hostingu.
- Analityka i telemetria nie należą do bieżącego etapu. Ich późniejsze dodanie wymaga opisania celu, zakresu danych i retencji.

## SEO i lokalizacja

- Język dokumentu i aplikacji: `pl-PL`; tekst nie może być zaszyty w sposób blokujący późniejszą lokalizację.
- Docelowe publiczne strony MUSZĄ mieć unikalny tytuł, opis, canonical i poprawne metadane udostępniania. Do czasu decyzji o docelowej domenie (TD-016, OPEN-006) publiczne strony spełniają to wymaganie w zakresie unikalnego tytułu i opisu; canonical oraz metadane udostępniania zostaną dodane przed wdrożeniem produkcyjnym.
- Treść podstawowa powinna być dostępna w HTML bez polegania wyłącznie na skrypcie klienta, jeśli wybrana architektura to umożliwia bez nieproporcjonalnego kosztu.
- Nazwy dań i opisy muszą być czytelne, naturalne i zgodne z tonem opisanym w wizji produktu.

## Strategia testów

- Testy jednostkowe: normalizacja wyszukiwania, filtry kategorii, ranking mapy i walidacja `Recipe`.
- Testy komponentów: wybory, aktualizacja wyników, karty, dialog i przełącznik trybu.
- Testy E2E: trzy główne ścieżki od strony startowej do wyników, karta prowadząca do trasy przepisu oraz powrót do zawieszonej sesji discovery, zamykanie overlayu przez przycisk, `Escape` i „Wstecz” bez dodatkowego wpisu do cofnięcia, zresetowane ponowne otwarcie przez „Dalej” oraz powrót fokusu. Normatywne zachowanie historii opisuje [discovery-overlay.md](../product/features/discovery-overlay.md).
- Automatyczna dostępność nie zastępuje ręcznej obsługi klawiaturą i czytnikiem ekranu.
- Porównanie wizualne obejmuje obowiązkowe szerokości mobilne, reprezentatywną niską i wysoką wysokość telefonu oraz widok wyśrodkowanego kontenera na `768px`; potwierdza proporcjonalną spójność sekcji i brak ucięć, ale nie powinno blokować przez nieistotne różnice antyaliasingu.

## Polecenia weryfikacyjne

Katalog roboczy: katalog główny repozytorium. Projekt przypina Node.js w `.node-version`, a wersję pnpm w polu `packageManager` pliku `package.json`.

```bash
# instalacja zależności z istniejącego lockfile
corepack pnpm install --frozen-lockfile

# jednorazowo na stanowisku uruchamiającym E2E
corepack pnpm exec playwright install chromium

# osobne bramki
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:e2e
corepack pnpm build

# pełny zestaw po przygotowaniu przeglądarki Playwright
corepack pnpm verify
```

`lint` uruchamia ESLint, `typecheck` — `astro check` (kontrola typów projektu Astro), a `verify` łączy powyższe bramki w jeden przebieg. `test` obejmuje Vitest oraz React Testing Library. `test:e2e` uruchamia Playwright w mobilnym Chromium i zawiera automatyczną kontrolę `axe-core`. Build MUSI generować statyczną stronę główną oraz dostępne trasy `/recipes/:slug`.

## Definition of Done

Funkcja jest ukończona, gdy:

- spełnia kryteria akceptacji swojej specyfikacji i nie rozszerza zakresu bez decyzji;
- używa wspólnego modelu i systemu UI;
- ma zachowanie mobilne i klawiaturowe oraz wyraźnie oznaczone elementy zastępcze dla zakresu kolejnych etapów;
- przechodzi dostępne testy, lint, kontrolę typów i build;
- została ręcznie sprawdzona na reprezentatywnym telefonie oraz na szerszym ekranie pod kątem wyśrodkowania kontenera;
- dokumentacja została zaktualizowana, jeśli zmienił się kontrakt, decyzja lub polecenie weryfikacyjne;
- znane odstępstwo jest jawnie opisane, ma właściciela i następny krok.
