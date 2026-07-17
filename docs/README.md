# Dokumentacja Obiadologii

Ten katalog jest lekkim systemem routingu wiedzy dla ludzi i agentów. Dokumenty są rozdzielone według odpowiedzialności, aby agent czytał tylko kontekst potrzebny do zadania.

## Struktura

Dokumentacja żyje w katalogu `docs/` tego samego repozytorium co aplikacja; nie jest osobnym projektem. Poniżej pokazano jej miejsce w drzewie (katalogi kodu zwinięto).

```text
obiadologia/
├── AGENTS.md               # instrukcja dla agentów
├── README.md               # skrót projektu i wskazanie tej dokumentacji
├── src/                    # kod aplikacji (mapa kodu w AGENTS.md)
├── tests/                  # testy E2E (Playwright)
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
    │   ├── quality-requirements.md
    │   ├── code-conventions.md
    │   └── adr/
    │       └── 0001-stos-aplikacji.md
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
| uzasadnienie zaakceptowanej decyzji kosztownej do odwrócenia | właściwy dokument w [`engineering/adr/`](engineering/adr/) wskazany przez rejestr decyzji |
| dostępność, wydajność i Definition of Done | [quality-requirements.md](engineering/quality-requirements.md) |
| miejsce styli, nazewnictwo klas, importy i hydratacja | [code-conventions.md](engineering/code-conventions.md) |

## Źródła prawdy

| Obszar | Źródło prawdy |
|---|---|
| cel i zasady produktu | `product-vision.md` |
| granice pierwszej wersji | `mvp-scope.md` |
| zachowanie funkcji | właściwy plik w `product/features/` |
| wspólne reguły wizualne i prezentacja komponentów | `design/ui-system.md` |
| dane i dopasowanie | `engineering/data-model.md` |
| rejestr decyzji implementacyjnych i decyzje otwarte | `engineering/technical-decisions.md` |
| pełna treść zaakceptowanej decyzji kosztownej do odwrócenia | właściwy ADR wskazany przez `engineering/technical-decisions.md`; w razie różnicy ADR ma pierwszeństwo przed skrótem w rejestrze |
| wymagania jakościowe | `engineering/quality-requirements.md` |
| konwencje kodu (miejsce styli, nazewnictwo, importy, hydratacja) | `engineering/code-conventions.md` |
| szczegóły faktycznie zaimplementowane | kod i testy, gdy powstaną |

Każdy kontrakt ma jedno normatywne źródło wskazane powyżej. Inne dokumenty mogą zawierać krótkie streszczenie albo kryterium weryfikacji, jeżeli odsyłają do tego źródła i nie dodają własnych szczegółów. Rejestr decyzji opisuje przyjęty kierunek techniczny i jego uzasadnienie, ale nie zastępuje specyfikacji zachowania.

## Najważniejsze kontrakty bieżącego etapu

Poniższa lista jest wyłącznie skrótem nawigacyjnym; pełny kontrakt znajduje się w podlinkowanym źródle.

- „Wstecz” przy otwartym overlayu najpierw go zamyka — [discovery-overlay.md](product/features/discovery-overlay.md).
- Kategorie i Wyszukiwarka odświeżają wyniki po każdej zmianie kryteriów, a Mapa podczas przeciągania punktu — [home-page.md](product/features/home-page.md) i [discovery-overlay.md](product/features/discovery-overlay.md).
- Cała karta przepisu prowadzi do trasy przepisu, której bieżący zakres opisuje [mvp-scope.md](product/mvp-scope.md).
- Obowiązuje jeden wyśrodkowany układ mobilny — [ui-system.md](design/ui-system.md).
- Każda główna sekcja wypełnia jeden ekran (jedna sekcja = jeden ekran) i nie jest wyższa niż ekran — [ui-system.md](design/ui-system.md).
- Na telefonach układ i odstępy sekcji są spójne i proporcjonalne między urządzeniami, bez ucięć i rozjeżdżania się — [ui-system.md](design/ui-system.md).

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
