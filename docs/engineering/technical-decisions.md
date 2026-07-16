# Decyzje techniczne

> Status: roboczy — projekt przed wyborem stosu  
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
| TD-010 | Dane, strona przepisu, produkcyjne obrazy, analityka i pełne stany danych są odłożone do kolejnych etapów. | Najpierw dopracowujemy obecne pliki i podstawowe interakcje. |

## Decyzje otwarte

Właściciel oznacza osobę, która zatwierdza kierunek. Do czasu decyzji agent stosuje regułę tymczasową i nie przedstawia jej jako docelowej architektury.

| ID | Do rozstrzygnięcia | Wpływ | Właściciel | Reguła tymczasowa |
|---|---|---|---|---|
| OPEN-001 | Framework, język i manager pakietów | struktura repo, typy, build, rekrutacja | właściciel produktu + osoba techniczna | nie generować projektu ani komend |
| OPEN-002 | Rendering oraz stan filtrów i wyszukiwania w URL | SEO, powroty, udostępnianie wyników | osoba techniczna | routing musi obsłużyć `/recipes/:slug`; pozostałe zachowanie opisujemy niezależnie od frameworka |
| OPEN-003 | Źródło przepisów: pliki, CMS czy API | model danych, wdrożenia, redakcja | właściciel produktu | traktować `Recipe` jako model koncepcyjny |
| OPEN-004 | Mechanizm wyszukiwania | trafność, polskie znaki, wydajność | produkt + osoba techniczna | stosować ranking opisany w modelu, bez wyboru silnika |
| OPEN-005 | Źródło i licencje zdjęć | legalność, wydajność, jakość | właściciel produktu | makiety są referencją, nie biblioteką produkcyjną |
| OPEN-006 | Hosting, CI/CD i obserwowalność | bezpieczeństwo, koszt, polecenia weryfikacji | osoba techniczna | nie tworzyć konfiguracji dostawcy |
| OPEN-007 | Narzędzia testowe i wizualne | Definition of Done i czas CI | osoba techniczna | zachować poziomy testów z wymagań jakościowych |

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

Najpierw doprowadzamy bieżące pliki dokumentacji i makiety do spójnego, zatwierdzonego stanu. Następnie rozstrzygamy decyzje blokujące repozytorium i dopiero wtedy generujemy projekt oraz polecenia weryfikacyjne. Agent nie może traktować tej kolejności jako zgody na samodzielny wybór stosu.

## Ukończenie etapu projektowego

Można rozpocząć tworzenie repozytorium, gdy co najmniej `OPEN-001`, `OPEN-002`, `OPEN-003`, `OPEN-005` i `OPEN-006` mają jawne decyzje, a wymagania jakościowe otrzymają prawdziwe polecenia uruchomienia i weryfikacji.
