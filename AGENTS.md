# Obiadologia — instrukcja dla agentów

## Czytaj tylko to, czego wymaga zadanie

- orientacja i routing dokumentacji: `docs/README.md`
- cel produktu i zakres MVP: `docs/product/`
- strona główna: `docs/product/features/home-page.md`
- wspólny overlay Mapa/Wyszukiwarka: `docs/product/features/discovery-overlay.md`
- wygląd i komponenty: `docs/design/ui-system.md`
- model danych: `docs/engineering/data-model.md`
- przyjęte i otwarte decyzje techniczne: `docs/engineering/technical-decisions.md`; zaakceptowane decyzje kosztowne do odwrócenia: `docs/engineering/adr/`
- testy, dostępność i wydajność: `docs/engineering/quality-requirements.md`

Nie wczytuj całego katalogu `docs/`, jeśli zadanie dotyczy jednego obszaru.

## Reguły pracy

1. Każdy kontrakt ma jedno normatywne źródło zgodne z tabelą „Źródła prawdy” w `docs/README.md`: specyfikacja funkcji definiuje zachowanie, `data-model.md` dane i dopasowanie, `ui-system.md` wspólne reguły wizualne, `quality-requirements.md` wymagania przekrojowe, a rejestr decyzji i ADR-y decyzje techniczne oraz ich uzasadnienie.
2. W innym dokumencie można umieścić krótkie streszczenie albo kryterium weryfikacji, ale MUSI ono odsyłać do normatywnego źródła i nie może dodawać własnych szczegółów kontraktu. W razie różnicy obowiązuje źródło wskazane w `docs/README.md`.
3. Zachowaj jeden model `Recipe` dla Kategorii, Wyszukiwarki i Mapy.
4. Nie dodawaj domyślnych wyborów w trybie Kategorii. Stan z wybranymi wartościami na makiecie przedstawia przykład po interakcji. Mapa rozpoczyna w punkcie środkowym.
5. Każdą istotną zmianę zachowania uzupełnij w odpowiedniej specyfikacji i kryteriach akceptacji.
6. Nie podejmuj po cichu kosztownych decyzji technicznych. Zapisz je jako otwarte albo dodaj ADR po uzgodnieniu.
7. Po implementacji uruchom testy wskazane w projekcie. Dopóki nie powstanie kod aplikacji i rzeczywiste skrypty projektu, brak poleceń jest jawnym stanem etapu, a nie zgodą na pominięcie weryfikacji po ich dodaniu.
8. W bieżącym etapie twórz wyłącznie jeden układ mobilny. Nie projektuj osobnych układów tabletowych ani desktopowych.
9. Nie implementuj zakresu odłożonego na później. Jeżeli jest potrzebny do zachowania przepływu, użyj jawnie opisanego ekranu lub danych zastępczych.

Dokument bliżej zmienianego kodu może opisywać lokalny szczegół implementacji, ale nie może redefiniować kontraktu należącego do innego źródła prawdy.
