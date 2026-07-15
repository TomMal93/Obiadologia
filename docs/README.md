# Dokumentacja Obiadologii

## Cel

Dokumentacja ma pozwalać agentom ustalić zakres zmiany, oczekiwane zachowanie, obowiązujące ograniczenia i sposób weryfikacji bez zgadywania.
Agent czyta wyłącznie dokumenty związane z bieżącym zadaniem. Nie należy wczytywać całego katalogu `docs/` przed każdą zmianą.

## Źródła prawdy

| Obszar | Źródło |
| --- | --- |
| Cel i zasady produktu | `docs/product/product-vision.md` |
| Aktualny zakres | `docs/product/mvp-scope.md` |
| Zachowanie funkcji | właściwy plik w `docs/product/features/` |
| Wygląd i komponenty | dokumenty w `docs/design/` oraz zatwierdzone makiety |
| Architektura i dane | kod oraz `docs/architecture/` |
| Uruchamianie i weryfikacja | główny `AGENTS.md` |

Kod i testy opisują stan istniejący. Specyfikacje funkcji mogą opisywać stan docelowy.

Makiety są źródłem wyglądu i intencji interfejsu. Nie należy wyprowadzać z nich nieopisanych kontraktów, algorytmów ani wartości technicznych.

## Dokumenty

Planowane obszary dokumentacji:

- `product/` — wizja, zakres i zachowanie funkcji,
- `design/` — reguły wizualne, responsywność i dostępność,
- `architecture/` — rzeczywista architektura, dane i API,
- `quality/` — polecenia i scenariusze weryfikacyjne,
- `standards/` — zasady utrzymywania dokumentacji.

Nie należy tworzyć pustych dokumentów ani opisywać planowanej architektury jako istniejącej.

## Praca ze sprzecznościami

Jeżeli dokumenty, kod i polecenie zadania są sprzeczne, agent wskazuje konflikt i jego wpływ.

Agent zatrzymuje zależną część pracy, jeśli konflikt dotyczy zachowania użytkownika, danych, API, bezpieczeństwa lub architektury. Nie zgaduje decyzji o dużym wpływie.
