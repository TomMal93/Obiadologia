# Instrukcje dla agentów

## Dokumentacja

Czytaj wyłącznie dokumenty potrzebne do bieżącego zadania. Nie wczytuj całego katalogu `docs/`.

- Gdy zadanie dodaje funkcję, zmienia zachowanie użytkownika albo zakres produktu, przeczytaj [wizję produktu](docs/product/product-vision.md).
- Przed implementacją nowej funkcji lub rozszerzeniem istniejącej przeczytaj [zakres MVP](docs/product/mvp-scope.md).
- Gdy potrzebujesz znaleźć właściwy dokument, użyj [mapy dokumentacji](docs/README.md).
- Przy zmianie czysto technicznej nie czytaj wizji produktu, jeżeli zmiana nie wpływa na zachowanie użytkownika.
- Przy zmianach hero, sekcji „Wybierz tryb” lub listy propozycji przeczytaj [specyfikację strony głównej](docs/product/features/home-page.md).
- Przy zmianach Wyszukiwarki lub wspólnego szkieletu overlayu przeczytaj [specyfikację Wyszukiwarki](docs/product/features/search-overlay.md).
- Przy zmianach Mapy przeczytaj [specyfikację Mapy](docs/product/features/map-overlay.md).

## Zasady pracy

- Przed zmianą sprawdź istniejący kod, testy i konfigurację.
- Nie dodawaj funkcji ani zależności spoza zakresu zadania.
- Nie wyprowadzaj kontraktów, algorytmów ani dokładnych wartości technicznych z makiet.
- Jeśli wymagania są sprzeczne albo brakuje decyzji o dużym wpływie, opisz problem i poproś o rozstrzygnięcie.
- Po zmianie uruchom kontrole właściwe dla zmienionego zakresu.
