# ADR 0001: Stos aplikacji

Status: accepted

Data: 2026-07-16

## Kontekst

Obiadologia ma być publicznym, mobilnym katalogiem maksymalnie 100 przepisów. Bieżący zakres nie obejmuje kont, trwałej personalizacji ani operacji wymagających własnej warstwy serwerowej. Projekt ma natomiast wspierać przyszłe publiczne podstrony przepisów, SEO i bardzo szybkie interakcje Kategorii, Wyszukiwarki oraz Mapy.

Większość treści może powstać jako statyczny HTML. JavaScript w przeglądarce jest potrzebny przede wszystkim dla wspólnego obszaru `DiscoveryExperience`, obejmującego wybór ścieżki, Kategorie i discovery overlay. Model `Recipe`, reguły dopasowania oraz kontrakt `RecipeSearch` muszą pozostać niezależne od frameworka.

## Rozważane opcje

### Astro z React

- generuje publiczne strony jako statyczny HTML i hydratuje tylko jawnie wskazane interaktywne wyspy;
- pozwala użyć Reacta dla złożonego `DiscoveryExperience` bez wysyłania go dla każdej statycznej podstrony;
- wymaga świadomego zaprojektowania granicy oraz danych przekazywanych do wyspy React.

### Next.js App Router

- obsługuje prerenderowane strony i komponenty klienckie oraz daje drogę do funkcji serwerowych;
- w obecnym zakresie wnosi granice Server/Client Components i możliwości runtime, których projekt bez kont oraz dynamicznego backendu nie potrzebuje;
- pozostaje możliwą przyszłą alternatywą, jeżeli charakter produktu zmieni się zasadniczo.

### React z Vite i React Router

- ma niski koszt wejścia i dobrze obsługuje interaktywny prototyp;
- jako SPA uzależnia podstawową treść i routing od JavaScriptu albo wymaga dołożenia osobnego prerenderingu;
- słabiej realizuje cel ograniczenia kodu klienckiego na przyszłych publicznych stronach przepisów.

## Decyzja

Aplikacja korzysta z:

- Astro ze statycznym outputem dla MVP;
- oficjalnej integracji React;
- TypeScriptu w trybie `strict`;
- pnpm jako managera pakietów.

Publiczne strony, layout i treść statyczna powstają jako komponenty Astro. React obsługuje wyłącznie obszary wymagające współdzielonego stanu, zdarzeń lub API przeglądarki; w MVP jest to jedna wyspa `DiscoveryExperience`. Wyspa obejmuje wybór ścieżki, Kategorie i discovery overlay, aby nie wprowadzać komunikacji pomiędzy wieloma niezależnymi wyspami dla jednego przepływu.

Model domenowy, dane `Recipe`, reguły dopasowania i kontrakt `RecipeSearch` nie zależą od Astro ani Reacta. Granicę `RecipeSearch` ustala `TD-013`; konkretna implementacja pozostaje regułą tymczasową w `OPEN-007`, domyślnie lokalny Fuse.js po stronie adaptera, a nie zależnością komponentów.

Konkretne stabilne wersje Node.js, pnpm, Astro, Reacta i zależności zostaną przypięte podczas tworzenia projektu.

## Konsekwencje

- publiczne strony mogą być hostowane jako statyczne pliki i serwowane z CDN;
- JavaScript trafia tylko do obszarów wymagających interakcji;
- dane przekazywane do `DiscoveryExperience` muszą być ograniczone do pól rzeczywiście potrzebnych w discovery, lecz nadal powstawać ze wspólnego modelu `Recipe`;
- statyczny output ma być wdrażany w wybranym Netlify zgodnie z `TD-016`; integracja nie jest jeszcze skonfigurowana, a bramki CI i minimalna obserwowalność pozostają w `OPEN-006`;
- dodanie renderingu na żądanie wymaga adaptera Astro i ponownej oceny hostingu;
- dodanie kont lub rozbudowanej warstwy transakcyjnej wymaga ponownej decyzji architektonicznej, a nie cichego rozszerzenia obecnego stosu;
- pnpm utrzymuje jedyny obowiązujący plik blokady zależności.

## Sposób weryfikacji

Po utworzeniu projektu należy potwierdzić, że:

- TypeScript działa w trybie `strict`;
- instalacja pnpm jest deterministyczna na podstawie pliku blokady;
- strona główna i `/recipes/:slug` generują prawidłowy statyczny HTML;
- statyczne podstrony nie pobierają kodu React bez potrzeby;
- `DiscoveryExperience` hydratuje się i zachowuje kontrakty strony głównej oraz overlayu;
- komponenty nie importują Fuse.js bezpośrednio, a wyszukiwanie przechodzi przez `RecipeSearch`;
- lint, kontrola typów, testy i build mają rzeczywiste polecenia zapisane w `quality-requirements.md`.
