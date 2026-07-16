# Dokumentacja Obiadologii

Ten katalog jest lekkim systemem routingu wiedzy dla ludzi i agentów. Dokumenty są rozdzielone według odpowiedzialności, aby agent czytał tylko kontekst potrzebny do zadania.

## Struktura

```text
obiadologia-docs/
├── AGENTS.md
└── docs/
    ├── README.md
    ├── product/
    │   ├── product-vision.md
    │   ├── mvp-scope.md
    │   └── features/
    │       ├── home-page.md
    │       └── discovery-overlay.md
    ├── design/
    │   └── ui-system.md
    ├── engineering/
    │   ├── technical-decisions.md
    │   ├── data-model.md
    │   └── quality-requirements.md
    └── assets/ui/
        ├── home-hero.png
        ├── home-browse-mode.png
        ├── search-overlay.png
        └── map-overlay.png
```

## Routing zadań

| Zadanie | Przeczytaj |
|---|---|
| zrozumienie celu produktu | [product-vision.md](product/product-vision.md) |
| ocena, czy funkcja należy do MVP | [mvp-scope.md](product/mvp-scope.md) |
| hero lub wybory kategorii | [home-page.md](product/features/home-page.md) |
| Wyszukiwarka, Mapa lub ich wspólny modal | [discovery-overlay.md](product/features/discovery-overlay.md) |
| kolory, typografia, odstępy, komponenty | [ui-system.md](design/ui-system.md) |
| pola przepisu i reguły dopasowania | [data-model.md](engineering/data-model.md) |
| framework, API, hosting lub test runner | [technical-decisions.md](engineering/technical-decisions.md) |
| dostępność, wydajność i Definition of Done | [quality-requirements.md](engineering/quality-requirements.md) |

## Źródła prawdy

| Obszar | Źródło prawdy |
|---|---|
| cel i zasady produktu | `product-vision.md` |
| granice pierwszej wersji | `mvp-scope.md` |
| zachowanie funkcji | właściwy plik w `product/features/` |
| wspólne reguły wizualne | `design/ui-system.md` |
| dane i dopasowanie | `engineering/data-model.md` |
| decyzje implementacyjne | `engineering/technical-decisions.md`, później ADR-y |
| wymagania jakościowe | `engineering/quality-requirements.md` |
| szczegóły faktycznie zaimplementowane | kod i testy, gdy powstaną |

## Najważniejsze kontrakty bieżącego etapu

- „Wstecz” wraca do poprzedniego widoku, a przy otwartym overlayu najpierw go zamyka.
- Kategorie i Wyszukiwarka odświeżają wyniki po każdej zmianie kryteriów.
- Mapa odświeża wyniki podczas przeciągania punktu.
- Cała karta przepisu prowadzi do trasy przepisu; do czasu powstania strony docelowej trasa pokazuje prosty ekran zastępczy.
- Obowiązuje jeden układ mobilny od `320px` do `480px`. Na szerszym ekranie jest wyśrodkowany w kontenerze o maksymalnej szerokości `480px`, bez osobnego wariantu desktopowego.

Gdy dokumenty są sprzeczne, nie wybieraj wygodniejszej wersji. Zatrzymaj zmianę, wskaż konflikt i popraw właściwe źródło prawdy.

## Słowa normatywne i statusy

- **MUSI** — wymaganie obowiązkowe.
- **POWINIEN** — mocna rekomendacja; odstępstwo wymaga uzasadnienia.
- **MOŻE** — zachowanie opcjonalne.
- `obowiązujący` — uzgodniona reguła produktu.
- `roboczy` — materiał z otwartymi decyzjami.
- `zastąpiony` lub `wycofany` — dokument historyczny, którego nie należy wdrażać.

## Utrzymanie

Aktualizuj dokument tylko wtedy, gdy zmienia się jego odpowiedzialność: zachowanie, zakres, model, decyzja albo wymaganie jakościowe. Nie prowadź tu dziennika prac ani listy drobnych zmian. Kosztowne i trwałe decyzje techniczne po uzgodnieniu należy przenosić do osobnych ADR-ów.
