# Decyzje techniczne

> Status: roboczy — stos wybrany, pozostałe decyzje otwarte
> Aktualizacja: przy zaakceptowaniu, zmianie lub odrzuceniu istotnej decyzji

## Cel

Rejestr zapobiega cichym założeniom agentów. Rozdziela decyzje już uzgodnione od otwartych, które wpływają na architekturę, koszt lub sposób pracy.

## W zakresie

- decyzje wpływające na więcej niż jeden plik lub funkcję;
- otwarte wybory z właścicielem i regułą tymczasową;
- zasady tworzenia ADR.

## Poza zakresem

- drobne wybory lokalnej implementacji;
- plan pojedynczego zadania;
- historia zmian kodu.

## Decyzje przyjęte

| ID | Decyzja | Uzasadnienie |
|---|---|---|
| TD-001 | Dokumentacja poprzedza repozytorium i kod. | Najpierw stabilizujemy zakres oraz kontrakty, aby ograniczyć koszt poprawek. |
| TD-002 | Szukaj i Mapa są dwoma trybami jednego overlayu. | Współdzielą powłokę, wyniki i przełącznik; stan jest zachowany do zamknięcia overlayu. |
| TD-003 | Wszystkie ścieżki korzystają ze wspólnego modelu `Recipe`. | Zapobiega trzem niespójnym źródłom danych i duplikacji kart. |
| TD-004 | Wspólne reguły wizualne istnieją tylko w `../design/ui-system.md`. | Specyfikacje funkcji opisują różnice, a nie kopiują tokenów i stanów. |
| TD-005 | Kategorie nie mają wyborów domyślnych; mapa zaczyna w neutralnym środku. | System nie udaje preferencji użytkownika. |
| TD-006 | „Wstecz” wraca do poprzedniego widoku, a przy otwartym overlayu najpierw zamyka overlay. | Nawigacja zachowuje przewidywalną hierarchię i nie opuszcza strony przed zamknięciem warstwy. |
| TD-007 | Kategorie i Wyszukiwarka przeliczają wyniki po każdej zmianie, a Mapa podczas przeciągania. | Interakcje nie wymagają osobnego przycisku zatwierdzającego. |
| TD-008 | Cała karta jest linkiem do `/recipes/:slug`. Do czasu implementacji strony przepisu trasa pokazuje ekran zastępczy. | Zachowujemy docelowy kontrakt nawigacji bez rozszerzania bieżącego etapu o treść przepisu. |
| TD-009 | Bieżący etap ma jeden układ mobilny `320–480px`; na szerszych ekranach jest wyśrodkowany w kontenerze `480px`. | Widoki pozostają wizualnie spójne bez projektowania wariantów tabletowych i desktopowych. |
| TD-010 | Docelowe dane, treść strony przepisu, produkcyjne obrazy, analityka i pełne opracowanie wizualne stanów danych są odłożone do kolejnych etapów. | Prototyp używa jawnych danych zastępczych i podstawowych stanów zachowania, bez przedstawiania ich jako rozwiązania produkcyjnego. |
| TD-011 | Publiczne trasy dostarczają podstawową treść w HTML i korzystają z prerenderingu, gdy treść jest wspólna dla użytkowników. Stan Kategorii oraz sesji discovery overlayu pozostaje lokalny i nie jest zapisywany w URL. Otwarcie overlayu tworzy wpis historii, aby akcja „Wstecz” go zamykała; przełączanie trybu nie tworzy kolejnych wpisów. | Rozwiązanie wspiera przyszłe publiczne podstrony i SEO, a jednocześnie zachowuje wymagany reset sesji overlayu i nie ustanawia przedwcześnie kontraktu udostępniania filtrów. Trwałe lub udostępnialne kryteria wymagają osobnej decyzji produktowej. |
| TD-012 | Testy logiki oraz synchronicznych komponentów prowadzi Vitest z React Testing Library, a integrację z warstwą serwerową, przepływy E2E i porównania wizualne prowadzi Playwright. Automatyczne kontrole dostępności używają `axe-core`; kontrola typów i lint są osobnymi bramkami. | Zestaw pokrywa wymagane poziomy testów, prawdziwą obsługę fokusu, klawiatury i viewportów oraz pozwala utrzymać szybkie testy czystej logiki. Komponenty asynchroniczne i zachowanie zależne od środowiska uruchomieniowego są sprawdzane E2E. Automaty dostępności nie zastępują kontroli ręcznej. |
| TD-013 | Warstwa aplikacji korzysta z własnego kontraktu `RecipeSearch`; komponenty, hooki prezentacyjne i model domenowy nie importują konkretnej biblioteki, usługi ani jej typów. | Granica pozwala dobrać i później wymienić implementację wyszukiwania na podstawie pomiarów bez zmiany UI i reguł domenowych. |
| TD-014 | Dla katalogu do 100 opublikowanych przepisów implementacja `RecipeSearch` korzysta z Fuse.js działającego lokalnie. Indeks powstaje raz dla aktualnego zbioru, obejmuje wyłącznie pola wyszukiwalne, a adapter zwraca wyniki aplikacyjne powiązane z kanonicznym `Recipe`; szczegóły i typy Fuse.js nie przekraczają granicy adaptera. | Przy tej skali lokalne wyszukiwanie usuwa opóźnienie sieciowe i koszt utrzymania usługi, a Fuse.js zapewnia ważenie pól, tolerancję literówek i znaków diakrytycznych. Przekroczenie 100 opublikowanych przepisów albo niespełnienie budżetu wydajności wymaga ponownego benchmarku implementacji `RecipeSearch`. |
| TD-015 | Aplikacja korzysta z Astro, oficjalnej integracji React, TypeScriptu w trybie `strict` i pnpm. MVP generuje statyczny output; React obsługuje wyłącznie interaktywny obszar `DiscoveryExperience`, a publiczne strony i pozostała treść pozostają komponentami Astro bez niepotrzebnej hydratacji. | Stos minimalizuje JavaScript wysyłany na telefon, prerenderuje publiczne podstrony i pozwala zachować React dla złożonych interakcji. Nie wprowadza warstwy serwerowej, której obecny zakres bez kont nie wymaga. Szczegóły: [ADR 0001](./adr/0001-stos-aplikacji.md). |
| TD-016 | Statyczny output Astro jest hostowany w Netlify. Repozytorium jest połączone z Netlify w celu ciągłego wdrażania: gałąź produkcyjna publikuje stronę główną, a pull requesty otrzymują Deploy Previews. Dla statycznego MVP nie instalujemy `@astrojs/netlify`; adapter może zostać dodany dopiero wraz z zaakceptowanym renderingiem na żądanie lub usługą wymagającą runtime Netlify. | Netlify bez dodatkowego adaptera obsługuje katalog `dist` generowany przez Astro, upraszcza publikację statycznego projektu i daje osobne, niezmienne podglądy zmian. Brak adaptera ogranicza zależność od dostawcy i zachowuje przenośny build. |

## Decyzje otwarte

Właściciel oznacza osobę, która zatwierdza kierunek. Do czasu decyzji agent stosuje regułę tymczasową i nie przedstawia jej jako docelowej architektury.

| ID | Do rozstrzygnięcia | Wpływ | Właściciel | Reguła tymczasowa |
|---|---|---|---|---|
| OPEN-003 | Źródło przepisów: pliki, CMS czy API | model danych, wdrożenia, redakcja | właściciel produktu | traktować `Recipe` jako model koncepcyjny; lokalny prototyp może używać jawnie oznaczonych danych przykładowych zgodnych z tym modelem |
| OPEN-005 | Źródło i licencje zdjęć | legalność, wydajność, jakość | właściciel produktu | makiety są referencją, nie biblioteką produkcyjną; prototyp używa neutralnych placeholderów albo materiałów dopuszczonych wyłącznie do prac lokalnych |
| OPEN-006 | Bramki CI przed wdrożeniem i minimalna obserwowalność produkcji | bezpieczeństwo, czas pipeline'u, wykrywanie awarii i polecenia weryfikacji | osoba techniczna | Netlify buduje statyczny output i tworzy Deploy Previews zgodnie z `TD-016`; nie dodawać analityki ani zewnętrznej telemetrii, a konkretne bramki skonfigurować dopiero po utworzeniu rzeczywistych skryptów projektu |

## Jak podejmować decyzje

1. Opisz problem i ograniczenia, nie tylko preferowane narzędzie.
2. Porównaj maksymalnie trzy realne opcje: koszt wejścia, utrzymanie, ryzyko i zgodność z MVP.
3. Zapisz właściciela i termin, jeśli brak decyzji blokuje pracę.
4. Po akceptacji przenieś pozycję do decyzji przyjętych i zaktualizuj dokumenty, których dotyczy.
5. Jeśli zmiana jest kosztowna do odwrócenia, utwórz ADR.

Agent MOŻE samodzielnie wybrać szczegół lokalny, jeśli jest łatwo odwracalny, zgodny z istniejącymi regułami i nie tworzy nowego kontraktu. W pozostałych przypadkach MUSI zgłosić decyzję zamiast ją ukrywać w kodzie.

## ADR

Katalog `docs/engineering/adr/` powstaje dopiero przy pierwszej zaakceptowanej decyzji kosztownej do odwrócenia, np. stosie aplikacji, źródle danych lub hostingu. Numeracja: `0001-krotki-tytul.md`.

Minimalny szablon:

```markdown
# ADR 0001: Tytuł

Status: proposed | accepted | superseded
Data: YYYY-MM-DD

## Kontekst
## Rozważane opcje
## Decyzja
## Konsekwencje
## Sposób weryfikacji
```

## Kolejność prac

Rendering, zachowanie URL, wyszukiwanie, stos, hosting oraz poziomy narzędzi testowych są ustalone w `TD-011`–`TD-016`. Można utworzyć projekt i dopiero na podstawie jego rzeczywistych skryptów uzupełnić polecenia weryfikacyjne w wymaganiach jakościowych.

Lokalny pionowy wycinek i Deploy Preview w Netlify mogą powstać przed rozstrzygnięciem `OPEN-003`, `OPEN-005` i `OPEN-006`, jeżeli korzystają z danych przykładowych zgodnych z `Recipe` oraz nieprodukcyjnych obrazów lub placeholderów. `OPEN-003` i `OPEN-005` muszą zostać zamknięte odpowiednio przed podłączeniem docelowych danych i publikacją obrazów, a `OPEN-006` przed pierwszym wdrożeniem produkcyjnym.

## Ukończenie etapu projektowego

Można rozpocząć tworzenie repozytorium zgodnie z `TD-015`, a po jego utworzeniu wymagania jakościowe MUSZĄ otrzymać prawdziwe polecenia uruchomienia i weryfikacji zgodne z `TD-012`. Otwarte `OPEN-003`, `OPEN-005` i `OPEN-006` nie blokują lokalnego prototypu ani Deploy Preview, ale blokują odpowiednio integrację docelowych danych, użycie produkcyjnych obrazów i promocję wdrożenia na produkcję.
