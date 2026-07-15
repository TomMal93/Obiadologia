# Gar Plan — przewodnik stylistyczny

Wersja: 1.0  
Zakres: kolorystyka, typografia, layout, ramki, promienie, cienie, komponenty i zasady wizualne strony.

---

## 1. Charakter wizualny

Gar Plan ma wyglądać jak lekka, ciepła i przyjazna strona kulinarna, ale bez estetyki typowego bloga z przepisami.

Styl powinien łączyć:

- ciepłe tło inspirowane papierem, kuchnią i jedzeniem,
- mocne, duże nagłówki,
- zaokrąglone karty,
- miękkie cienie,
- proste ilustracyjne elementy zamiast ciężkich zdjęć,
- mobilny układ jako punkt wyjścia,
- jasne CTA w kolorze czerwono-pomarańczowym.

Strona ma sprawiać wrażenie produktu pomagającego szybko wybrać obiad, nie katalogu przepisów.

---

## 2. Design tokens

### Kolory

```css
:root {
  --bg: #fff7ea;
  --text: #251a14;
  --muted: #7a6658;
  --card: #fffdf8;
  --soft: #fff1db;
  --accent: #ff5a3d;
  --accent-2: #ffc857;
  --green: #2f8f5b;
  --border: rgba(37, 26, 20, 0.12);
  --shadow: 0 18px 50px rgba(37, 26, 20, 0.12);
  --radius-lg: 28px;
  --container: 760px;
}
```

### Znaczenie kolorów

| Token | Wartość | Zastosowanie |
|---|---:|---|
| `--bg` | `#fff7ea` | główne tło strony |
| `--text` | `#251a14` | główny tekst, ciemne przyciski, aktywne filtry |
| `--muted` | `#7a6658` | opisy, leady, etykiety, drugorzędne informacje |
| `--card` | `#fffdf8` | karty, pola, powierzchnie pierwszego planu |
| `--soft` | `#fff1db` | tagi, tła pomocnicze, spokojne elementy UI |
| `--accent` | `#ff5a3d` | główne CTA, logo, wyróżnienia, akcje |
| `--accent-2` | `#ffc857` | akcent dekoracyjny, ilustracje, gradienty |
| `--green` | `#2f8f5b` | tagi smakowe, warianty wizualne, sygnał świeżości |
| `--border` | `rgba(37, 26, 20, 0.12)` | ramki kart i pól |
| `--shadow` | `0 18px 50px rgba(37, 26, 20, 0.12)` | główne duże cienie |

### Zasada kolorystyczna

Kolor czerwono-pomarańczowy jest kolorem decyzji i akcji. Nie powinien być używany do dekorowania wszystkiego. Ma prowadzić użytkownika do kolejnego kroku.

Ciemny brąz `--text` jest alternatywnym kolorem CTA, szczególnie dla przełączników, aktywnych filtrów i przycisków pomocniczych.

---

## 3. Typografia

### Font

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Ton typografii

- Nagłówki są bardzo ciężkie, zwarte i mocno ściśnięte.
- Tekst opisowy jest spokojny, czytelny, brązowo-szary.
- Etykiety i tagi są małe, ale bardzo pogrubione.

### Skala typograficzna

| Element | Rozmiar | Line-height | Weight | Letter-spacing |
|---|---:|---:|---:|---:|
| Hero H1 | `clamp(50px, 16vw, 86px)` | `0.9` | `950` | `-0.08em` |
| Hero H1 — wariant główny | `clamp(52px, 18vw, 86px)` | `0.88` | `950` | `-0.08em` |
| H2 sekcji | `36px` | `0.95` | `950` | `-0.065em` |
| H2 w kartach | `28–32px` | `0.95–0.98` | `950` | `-0.06em` |
| H3 karty | `20–22px` | `1–1.02` | `950` | `-0.045em` |
| Lead | `17px` | `1.52` | normal/średni | brak |
| Body | `14–15px` | `1.4–1.5` | `650–850` | brak |
| Meta/tagi | `11–13px` | normal | `900–950` | brak |

### Zasady

1. Nagłówki mają być krótkie, duże i konkretne.
2. Nie stosować cienkich fontów.
3. Nie zwiększać letter-spacingu w nagłówkach. Ten styl bazuje na ujemnym letter-spacingu.
4. Kolor `--muted` używać do tekstów pomocniczych, ale nie do głównych akcji.

---

## 4. Layout

### Kontener

```css
--container: 760px;

header,
main {
  width: min(100%, var(--container));
  margin: 0 auto;
}
```

Strona jest projektowana mobile-first. Na małych i średnich ekranach treść jest mocno skupiona w jednej kolumnie.

### Paddingi główne

```css
header {
  padding: 18px 18px 8px;
}

main {
  padding: 34px 18px 72px;
}
```

Dla stron szczegółowych dopuszczalne jest zmniejszenie górnego paddingu main do `28px`.

### Breakpointy

```css
@media (min-width: 700px) {
  /* tablet / mały desktop */
}

@media (min-width: 960px) {
  /* desktop */
}
```

### Siatki

Domyślnie komponenty są w jednej kolumnie:

```css
display: grid;
gap: 12px;
```

Na większych ekranach można przechodzić do układów dwukolumnowych, szczególnie dla:

- hero + wizual,
- treść przepisu + panel boczny,
- kontakt: dane + formularz,
- katalog: filtry + lista.

---

## 5. Tła i dekoracje

### Główne tło

Tło strony zawsze korzysta z `--bg`.

```css
body {
  background: var(--bg);
  color: var(--text);
}
```

### Dekoracyjne pytania w tle

Powtarzające się pytania w tle budują charakter marki. Są bardzo subtelne.

```css
.background-questions {
  position: fixed;
  inset: 0;
  z-index: -2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  padding: 24px;
  opacity: 0.055;
  transform: rotate(-8deg) scale(1.12);
  pointer-events: none;
  font-size: 17px;
  font-weight: 900;
  line-height: 1.15;
  color: var(--text);
}
```

Nie zwiększać opacity powyżej `0.08`, bo tło zacznie walczyć z treścią.

### Bloby

```css
.blob {
  position: fixed;
  z-index: -1;
  width: 360px;
  height: 360px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 200, 87, 0.55), transparent 68%);
  top: -130px;
  right: -140px;
  pointer-events: none;
}

.blob.second {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 90, 61, 0.22), transparent 70%);
  left: -160px;
  bottom: -140px;
}
```

Bloby mają być tłem atmosferycznym, nie główną grafiką.

---

## 6. Karty i powierzchnie

### Główna karta

```css
.card,
.panel,
.hero-card,
.contact-card,
.search-card,
.map-card {
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(16px);
}
```

### Mniejsze karty

```css
.small-card,
.topic,
.principle,
.step,
.recipe-card,
.result-tile {
  border-radius: 24px;
  background: rgba(255, 253, 248, 0.88);
  border: 1px solid var(--border);
  box-shadow: 0 12px 34px rgba(37, 26, 20, 0.08);
  backdrop-filter: blur(14px);
}
```

### Promienie zaokrągleń

| Element | Radius |
|---|---:|
| Duże sekcje/karty | `28px` |
| Karty list/przepisów | `24px` |
| Wewnętrzne panele | `20–23px` |
| Inputy i przyciski prostokątne | `16–17px` |
| Tagi/chipy | `999px` |
| Logo mark | `13px` |

### Zasady ramek

- Ramki są cienkie: `1px`.
- Ramki nie są czarne. Używać `--border` albo `rgba(37, 26, 20, 0.08)`.
- Ramka + cień + lekko przezroczyste tło tworzą główny język wizualny strony.

---

## 7. Przyciski

### Główne CTA

```css
.primary-button,
.submit-button,
.recipe-action {
  background: var(--accent);
  color: white;
  border: 0;
  border-radius: 17px;
  font-weight: 950;
  box-shadow: 0 14px 30px rgba(255, 90, 61, 0.26);
}
```

### CTA w formie pigułki

```css
.cta-button,
.menu-button,
.back-link {
  border-radius: 999px;
}
```

### Drugorzędne przyciski

```css
.secondary-button,
.filter-clear {
  background: #fff8ef;
  color: var(--muted);
  border: 1px solid var(--border);
}
```

### Zasady

1. Główna akcja na ekranie powinna być pomarańczowa.
2. Akcje pomocnicze mogą być ciemne lub jasne.
3. Nie używać więcej niż jednego mocnego CTA w jednej małej sekcji.
4. Przyciski powinny mieć dużą powierzchnię kliknięcia: minimum `44px`, preferowane `48–56px`.

---

## 8. Formularze i pola

### Inputy

```css
input,
textarea,
select {
  width: 100%;
  border: 1px solid rgba(37, 26, 20, 0.08);
  outline: none;
  border-radius: 17px;
  background: rgba(255, 253, 248, 0.9);
  color: var(--text);
  font-size: 15px;
  font-weight: 650;
}

input,
select {
  min-height: 52px;
  padding: 0 15px;
}

textarea {
  min-height: 138px;
  resize: vertical;
  padding: 15px;
  line-height: 1.45;
}
```

### Etykiety

```css
label {
  color: var(--muted);
  font-size: 12px;
  font-weight: 950;
}
```

Formularze mają wyglądać miękko i bez technicznej surowości.

---

## 9. Chipy, tagi i metadane

### Meta tag

```css
.meta,
.chip,
.map-tag {
  border-radius: 999px;
  background: var(--soft);
  color: var(--muted);
  font-size: 11px;
  font-weight: 950;
  white-space: nowrap;
}
```

### Aktywny filtr

```css
.active-chip,
.filter-chip input:checked + span {
  background: var(--text);
  color: white;
  border-color: transparent;
}
```

### Zasady

- Chipy powinny być krótkie: 1–3 słowa.
- Nie używać chipów do długich opisów.
- Aktywne chipy są ciemne, nie pomarańczowe. Pomarańczowy zostaje dla decyzji i CTA.

---

## 10. Nawigacja i logo

### Logo

```css
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 950;
  letter-spacing: -0.04em;
  font-size: 20px;
}

.logo-mark {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: var(--accent);
  color: white;
  box-shadow: 0 10px 26px rgba(255, 90, 61, 0.32);
}
```

### Menu button

```css
.menu-button {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.58);
  border-radius: 999px;
  padding: 9px 13px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 900;
  backdrop-filter: blur(12px);
}
```

Nawigacja nie powinna dominować. Najważniejszy jest wybór obiadu i treść.

---

## 11. Ilustracje i grafiki jedzenia

Obecny styl używa ilustracyjnych, CSS-owych wizualizacji zamiast zdjęć. To dobry kierunek dla MVP, bo daje spójność.

### Zasady

- Grafiki powinny być proste, płaskie, oparte o gradienty i koła.
- Nie mieszać realistycznych zdjęć z abstrakcyjnymi CSS-ilustracjami bez jasnego systemu.
- Jeżeli pojawią się zdjęcia potraw, trzeba przygotować osobny styl fotografii: jasne tła, ciepłe światło, ciasny kadr, brak stockowej estetyki.

### Miniatury przepisów

Miniatury powinny mieć:

```css
width: 106px;
height: 112px;
border-radius: 20px;
```

Na desktopie można zwiększać rozmiar, ale proporcja powinna zostać podobna.

---

## 12. Animacje i interakcje

Animacje mają być krótkie i praktyczne.

```css
transition: 0.18s ease;
```

Dopuszczalne efekty:

- lekki hover na kartach,
- zmiana tła aktywnego filtra,
- delikatne podbicie cienia,
- przesunięcie `transform: translateY(-2px)` dla kart interaktywnych.

Nie stosować długich animacji wejścia ani efektów odciągających uwagę od decyzji użytkownika.

---

## 13. Responsywność

### Mobile-first

Wersja mobilna jest główną wersją projektu. Wszystkie komponenty muszą dobrze działać na szerokości `360px`.

### Tablet: od 700px

Od `700px` można:

- zwiększać paddingi,
- tworzyć 2-kolumnowe listy kart,
- pokazywać więcej przestrzeni w hero,
- zmniejszać udział bottom sheetów.

### Desktop: od 960px

Od `960px` można:

- pokazać filtry boczne w katalogu,
- rozszerzyć layout treści przepisu,
- użyć dwukolumnowego hero,
- pokazać pełniejszą nawigację.

---

## 14. Komponenty bazowe

### Hero

Hero powinno składać się z:

- krótkiego eyebrowa,
- bardzo dużego H1,
- leadu,
- jednej głównej akcji albo modułu decyzyjnego.

### Karta przepisu

Karta przepisu powinna zawierać:

- metadane: czas, trudność, typ,
- tytuł,
- krótki opis,
- CTA,
- miniaturę.

### Strona przepisu

Strona przepisu powinna zawierać:

- powrót do listy,
- tytuł,
- lead,
- metadane,
- składniki,
- kroki,
- podpowiedzi / zamienniki / tagi.

### Katalog

Katalog powinien mieć:

- licznik wyników,
- sortowanie,
- filtry,
- aktywne chipy,
- listę kart,
- paginację albo infinite load.

---

## 15. Zasady tekstowe UI

Styl tekstów powinien być prosty i użytkowy.

Dobre przykłady:

- „Co dziś gotujemy?”
- „Mam 20 minut”
- „Pokaż szybkie obiady”
- „Bez mięsa”
- „Mało zmywania”
- „Zobacz przepis”

Unikać:

- zbyt marketingowych haseł,
- długich opisów na kartach,
- słów, które brzmią jak reklama aplikacji SaaS,
- nadmiernie ozdobnego tonu.

---

## 16. Czego nie robić

1. Nie zmieniać głównego tła na białe.
2. Nie używać czystej czerni.
3. Nie usuwać mocnych zaokrągleń — to część charakteru.
4. Nie robić pomarańczowych wszystkich elementów aktywnych.
5. Nie mieszać wielu rodzin fontów.
6. Nie dodawać cienkich, eleganckich serifów.
7. Nie przeładowywać strony zdjęciami stockowymi.
8. Nie robić pełnego dashboardowego UI. To ma być lekkie, kulinarne i decyzyjne.

---

## 17. Kierunek rozwoju wizualnego

Najlepszy kierunek to rozwijać markę wokół idei szybkiej decyzji:

- mniej scrollowania,
- mniej chaosu,
- kilka sensownych propozycji,
- ciepły, kuchenny klimat,
- mocny, prosty język.

Wizualnie strona powinna pozostać ciepła, miękka i lekko ilustracyjna. Technicznie może rosnąć w stronę aplikacji, ale estetycznie nie powinna wyglądać jak panel administracyjny.
