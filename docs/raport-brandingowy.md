# Obiadologia — audyt UI/UX i propozycje odświeżenia brandingu

**Data:** 14.07.2026 · **Zakres:** cały serwis (strona główna, katalog przepisów, strona przepisu, O nas, Kontakt) · **Metoda:** przegląd kodu (`src/styles/global.css`, komponenty Astro) + audyt realnego renderu (zrzuty mobile 390×844 i desktop 1440×900, katalog `docs/audyt/`) + pomiar kontrastów WCAG skryptem (nie „na oko").

---

## 1. Streszczenie zarządcze

Obiadologia ma **rzadką rzecz: prawdziwy pomysł na produkt i własny głos**. „Decyzyjnik obiadowy" zamiast kolejnej bazy przepisów, świetny polski copywriting, konsekwentnie ciepły, kulinarny klimat. To fundament, którego większość stron o jedzeniu nie ma — i którego **nie wolno stracić przy odświeżeniu**.

Problem jest inny: **brand jest niedokończony, a interfejs przeciążony dekoracją**. Logo to emoji, które na każdym systemie wygląda inaczej (w testowanym renderze przypomina lupę, nie patelnię). Nie ma favicony, obrazu OG, footera ani — co dla serwisu kulinarnego zabójcze — **żadnego wizerunku jedzenia**: miniatury przepisów to abstrakcyjne gradientowe plamy. Jednocześnie warstwa dekoracyjna (marquee pytań w tle, bloby, wielowarstwowe „szkło", animacje połysku) konkuruje o uwagę z treścią, zwłaszcza na desktopie, który wygląda jak rozciągnięty mobile.

Werdykt: **nie przebudowywać tożsamości od zera — dokończyć ją i odchudzić**. Efekt „wow" ma tu przyjść nie z większej ilości efektów, tylko z profesjonalnego domknięcia: prawdziwy znak, charakterna typografia display, apetyczne ilustracje potraw i jeden spójny język komponentów.

**Ocena ogólna: 3.1 / 5** — dobry produkt w niedokończonym ubraniu.

---

## 2. Audyt obecnego designu

### 2.1 Tożsamość marki — 2/5 (najsłabsze ogniwo)

| Element | Stan | Ocena |
|---|---|---|
| Logo | Emoji 🍳 w pomarańczowym kwadracie (`SiteHeader.astro:15`) | Renderuje się różnie na każdej platformie; w teście wygląda jak **lupa**, co myli (sugeruje wyszukiwarkę, nie kuchnię). Emoji nie da się użyć w druku, na social mediach ani w favicona. |
| Favicona | **Brak** | Karta przeglądarki pokazuje domyślną ikonę — strona wygląda na niedokończoną od pierwszej sekundy. |
| Obraz OG / social | **Brak** (`BaseLayout.astro` ma meta OG bez `og:image`) | Każde udostępnienie linku na Messengerze/FB — czyli naturalny kanał wzrostu dla „co dziś jemy?" — wygląda pusto. |
| Footer | **Brak** | Strona „urywa się"; brak miejsca na markę, nawigację, prawa autorskie. |
| Wizerunek jedzenia | Gradientowe placeholdery (`.recipe-thumb`, `global.css:384-430`) | Na stronie przepisu desktop „ilustracja dania" to wielka żółta plama — zero apetytu. To największa pojedyncza bariera „wow". |

Mocna strona: **nazwa i ton**. „Obiadologia", „Robię to", „obiad bez dramatu", „mało zmywania" — to jest brand voice, który działa i wyróżnia. Tożsamość wizualna po prostu za nim nie nadąża.

### 2.2 Kolor — 3.5/5

Paleta (`global.css:1-17`): krem `#fff7ea`, tekst `#251a14`, pomarańcz `#ff5a3d`, żółć `#ffc857`, zieleń `#2f8f5b`. Kierunek jest **dobry** — ciepły, kulinarny, własny. Problemy są w egzekucji. Pomierzone kontrasty (WCAG 2.x):

| Para | Wynik | Werdykt |
|---|---|---|
| Tekst `#251a14` / krem | **15.97** | ✅ świetnie |
| Muted `#7a6658` / krem | **5.10** | ✅ AA |
| Lead `rgba(37,26,20,.72)` / krem | **6.51** | ✅ AA |
| **Biały / akcent `#ff5a3d` (wszystkie główne przyciski, 14 px bold)** | **3.10** | ❌ FAIL AA (wymagane 4.5) |
| **Akcent `#ff5a3d` / krem (spany w H1, „konkret")** | **2.91** | ❌ FAIL nawet dla dużego tekstu (3.0) |
| Zieleń `#2f8f5b` / krem | 3.80 | ⚠️ tylko duży tekst |
| `#c96a57` („konkret" w rotatorze) / krem | 3.47 | ⚠️ tylko duży tekst |
| Teksty `rgba(37,26,20,.58)` (helpery, cues 11–13 px) | **4.12** | ❌ FAIL przy tym rozmiarze |
| `#2f76a8` / niebieskie szkło (przycisk „Mapa", 16 px bold) | 4.37 | ❌ o włos poniżej AA |

Wniosek: **główny kolor akcji jest za jasny do roli, którą pełni**. `#ff5a3d` z białym tekstem na każdym CTA to systemowy fail dostępności. Wystarczy przyciemnić akcent interakcji do `#cf3b22` (biały tekst: **4.88:1** ✅, a jako tekst na kremie: **4.59:1** ✅ — pomiar skryptem) albo dawać ciemny tekst na jasnym akcencie — bez zmiany charakteru palety.

Drugi problem: kolory są **rozmyte przez rgba i szkło**. Realnie na stronie występują dziesiątki pochodnych (`rgba(37,26,20,.58/.66/.7/.72/.84)`, `#9a4a35`, `#80601a`, `#2f76a8`, `#c96a57`…), niezdefiniowanych w `:root`. Nie ma jednego źródła prawdy o kolorze marki.

### 2.3 Typografia — 2.5/5

- **Jeden krój (Inter/system)** dla wszystkiego. Inter jest bezpieczny i nijaki — nie niesie żadnego charakteru marki, a przy tym strona żąda od niego wag, których nie ma: w kodzie występują font-weight **650, 720, 760, 780, 820, 850, 900, 950, 980**. Bez zmiennego fontu przeglądarka i tak spłaszcza to do 2–3 realnych wag — system wag jest fikcją.
- **Ekstremalny tracking nagłówków** (`letter-spacing: -0.08em` przy 50–92 px, `global.css:244-257`) — efektowny na słowie „Co dziś jemy?", ale przy dłuższych tytułach skleja litery.
- **Twardy defekt: `overflow-wrap: anywhere` na nagłówkach** (`global.css:237-242`). Na mobile H1 przepisu łamie się w środku wyrazu: **„Makaron z pomidoram / i i serem."** (zrzut `przepis-mobile.png`), a pigułka trybu łamie „Śniadani / e" (`home-kategorie-mobile.png`). To czytelny sygnał „niedokończone" dokładnie tam, gdzie brand ma błyszczeć.
- Rozmiary 10–11 px z wagą 950 (chipy, liczniki, „WYBRANO") — mikrotypografia na granicy czytelności.
- Brak skali modularnej: rozmiary 10/11/12/13/14/15/16/17/19/20/21/24/36/50–92 px bez systemu.

### 2.4 Komponenty i spójność — 2.5/5

- **Promienie bez systemu:** 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 22, 24, 28, 999 px — praktycznie każda karta ma inny.
- **Cienie i „szkło" kopiowane ręcznie:** wielowarstwowe `box-shadow` (do 6 warstw) + `backdrop-filter` powtarzane z drobnymi mutacjami w `index.astro`, `CategoryPanels.astro`, `RecipeCard.astro`, zamiast tokenów. Efekt: ta sama karta wygląda inaczej w każdej sekcji, a CSS strony głównej ma ~2700 linii.
- **Desktop to inny brand niż mobile.** Na mobile przyciski Mapa/Szukaj/Kategorie to kolorowe „szklane" kafle; na desktopie — płaskie białe paski (zrzuty `home-mobile.png` vs `home-desktop.png`). Sekcja „Wybierz tryb" na desktopie ma ucięty rząd pigułek z obu stron (`justify-content:center` + `overflow-x:auto` — pierwszy element jest nieosiągalny) i łososiowy panel nachodzący na ramkę (`home-kategorie-desktop.png`).
- Desktop ogólnie wygląda jak **rozciągnięty mobile**: ogromne puste przestrzenie, karta hero odklejona od tytułu, treść w wąskiej kolumnie na 1440 px.

### 2.5 Ruch i dekoracja — 3/5

Naraz działają: 8 rzędów marquee w tle + 2 animowane bloby + animacje „lustre" na kaflach + rotator słów + reveal. Na mobile tło jest dyskretne; **na desktopie marquee (20–22 px, waga 900) czyta się jak watermark rozlany po całej stronie** — konkuruje z treścią na każdej podstronie (`o-nas-desktop`, `przepisy-desktop`). Sam pomysł (pytania „co zjemy?" w tle) jest brandowo świetny — wymaga tylko przyciszenia i dyscypliny: jedna dekoracja naraz, nie cztery.

Duży plus: pełna obsługa `prefers-reduced-motion` (`global.css:538-554`).

### 2.6 UX i architektura informacji — 3.5/5

- **Decyzyjnik to wyróżnik klasy premium** — lejek „Poszukiwania / konkretne danie / okazja" → Mapa / Szukaj / Kategorie jest zrozumiały i unikalny. Chwalę też mapę smaków (oś szybko–wolno / lekko–konkretnie).
- Hero na mobile niesie jednak **za dużo mikro-copy naraz**: dwa akapity misji + „Wybierz najbliższą myśl" + „Do obiadu prowadzi mnie" + lejki + przyciski + „Od razu dostajesz: konkret". To 5 poziomów komunikatu przed pierwszą akcją.
- Brak footera = ślepy koniec każdej strony; brak drogi dalej po dojściu do dołu.
- Katalog: dobre filtry i sortowanie; karty czytelne.
- Formularz kontaktu ma `action="#"` — wygląda na atrapę; jeśli tak, lepiej tego nie udawać.

### 2.7 Dostępność — 3.5/5

Dobrze: semantyczne aria (role tablist/tabpanel, aria-current, aria-expanded), `:focus-visible`, `prefers-reduced-motion`, sr-only labele, sensowne obszary dotyku (min 44–52 px).
Do poprawy: kontrasty z §2.2 (przyciski!), tekst 10–11 px, „szkło" pod tekstem daje niestabilne tło (kontrast zależy od tego, co akurat przepływa pod spodem — np. marquee pod kartą).

### 2.8 Zbiorcza ocena

| Obszar | Ocena | Priorytet naprawy |
|---|---|---|
| Tożsamość marki (logo, favicona, OG, footer) | 2/5 | 🔴 najwyższy |
| Fotografia / ilustracja potraw | 1.5/5 | 🔴 najwyższy |
| Typografia | 2.5/5 | 🟠 wysoki |
| Spójność komponentów (tokeny) | 2.5/5 | 🟠 wysoki |
| Kolor / kontrasty | 3.5/5 | 🟠 wysoki (przyciski) |
| Desktop jako pełnoprawny layout | 2.5/5 | 🟡 średni |
| Ruch i dekoracja | 3/5 | 🟡 średni |
| UX / IA | 3.5/5 | 🟢 niski |
| Dostępność (poza kontrastem) | 3.5/5 | 🟢 niski |

---

## 3. Propozycje odświeżenia — trzy kierunki

Wspólny mianownik wszystkich kierunków (rzeczy obowiązkowe niezależnie od wyboru): prawdziwy logotyp + sygnet, favicona, obraz OG, footer, ilustracje/zdjęcia potraw, tokeny designu, naprawa kontrastów i łamania wyrazów.

### Kierunek A — „Apetyt na decyzję" ⭐ REKOMENDOWANY

**Idea:** nie zmieniamy duszy — dokańczamy ją i podkręcamy. Ciepły, apetyczny, charakterny brand „doradcy od obiadu", który wygląda jak dopracowany produkt, nie prototyp.

- **Sygnet:** talerz-kompas — okrąg talerza z igłą/widelcem wskazującym kierunek (dosłowna metafora decyzyjnika). Prosty, geometryczny, działa w 16 px favicony i w 512 px OG. Logotyp: „Obiadologia" nowym krojem display, kropka nad „i" w kolorze akcentu.
- **Typografia:** nagłówki **Bricolage Grotesque** (Google Fonts, zmienny, pełne polskie znaki, charakterny ale kulinarnie ciepły; self-hosted przez `astro-font` lub woff2 w repo) — waga 700–800, tracking −0.02 do −0.04 em (koniec z −0.08). Tekst: zostaje Inter (variable), ale w zdyscyplinowanej skali: 12 / 14 / 16 / 18 / 21 / 28 / 40 / 64 px i tylko 3 wagi (450, 600, 750).
- **Kolor:** paleta zostaje, ale z rolami: `#fff7ea` tło · `#251a14` tekst · **`#cf3b22` akcja** (biały na nim: 4.88:1 ✅) · `#ff5a3d` tylko dekoracyjnie/duże napisy na ciemnym · `#ffc857` podkreślenia i tła chipów · `#2f8f5b` sukces/wege. Wszystkie pochodne rgba zastąpione 8–10 nazwanymi tokenami.
- **Ilustracje potraw:** spójny zestaw SVG w stylu „duotone na kremie" (linia `#251a14` + wypełnienia z palety) — miska ryżu, patelnia, garnek, tost, curry… Generowalne raz, ważą kilobajty, nie wymagają sesji foto i skalują się na OG images per przepis (tytuł + ilustracja na kremowym tle).
- **Szkło → papier:** jeden poziom kart („papier" `#fffdf8`, 1 px border, jeden token cienia), glassmorphism zostaje **tylko** w jednym miejscu-bohaterze (kafle Mapa/Szukaj/Kategorie), identyczny na mobile i desktopie.
- **Ruch:** marquee pytań zostaje jako podpis marki, ale wyciszony (desktop: opacity ≤ 0.03, większy rozmiar, 3–4 rzędy zamiast 8) i tylko na stronie głównej. Jedna sygnaturowa animacja: „igła kompasu" w sygnecie wskazująca wynik po wyszukaniu.
- **Wow-moment:** po wybraniu filtra/mapy wynik wjeżdża jako „podany talerz" — karta z ilustracją dania obracająca się lekko jak talerz stawiany na stole.
- **Koszt wdrożenia: średni** (2–3 iteracje; zero przebudowy IA, głównie warstwa prezentacji).

### Kierunek B — „Edytorski food-magazine"

**Idea:** Obiadologia jak nowoczesny magazyn kulinarny — dużo światła, serif display, wielkie kadry jedzenia.

- Typografia: serif display (np. **Fraunces** — zmienny, „soft/wonk", polskie znaki) + Inter do tekstu.
- Kolor: złamana biel `#faf6f0`, atrament `#1d1712`, akcent terakota `#c73e1d`, dużo negatywnej przestrzeni; koniec z blobami i marquee.
- Obraz: **prawdziwa fotografia** potraw (top-down, ciepłe światło, kremowe tła) — wymaga sesji albo starannie kuratowanego stocka; to główny koszt i ryzyko spójności.
- Wow: wielkoformatowe hero ze zdjęciem dnia + serifowy tytuł; przewijane „menu dnia" jak rozkładówka.
- Ryzyko: gubi playful charakter i przewagę „decyzyjnika nad bazą przepisów"; **wysoki koszt** (fotografia).

### Kierunek C — „Playful bold / sticker kitchen"

**Idea:** pełny flat, grube obrysy 2–3 px, naklejkowe kafle, mocne kolory — energia aplikacji, nie strony.

- Typografia: zaokrąglony grotesk o dużym charakterze (np. **Baloo 2** / **Hanken Grotesk** black) + krótkie, krzykliwe copy (już jest!).
- Kolor: podbita paleta — pomidor `#cf3b22`, masło `#ffd166`, szpinak `#2f8f5b`, krem — używane w dużych, płaskich plamach; cienie twarde (offset bez blura).
- Ilustracje: sticker-style potraw z białym obrysem; badge'y „15 MIN!", „1 GARNEK!" jak naklejki na słoiku.
- Wow: interfejs „lodówki z magnesami" — kafle kategorii jak magnesy, drag-scroll.
- Ryzyko: łatwo o infantylność; wymaga bardzo konsekwentnej ręki ilustratorskiej. **Koszt średni-wysoki.**

### Porównanie

| | A — Apetyt na decyzję ⭐ | B — Edytorski | C — Playful bold |
|---|---|---|---|
| Zachowuje obecny charakter | ✅ w pełni | ⚠️ częściowo | ⚠️ podkręca |
| Koszt / czas | średni | wysoki (foto) | średni-wysoki |
| Ryzyko | niskie | średnie | średnie |
| Efekt „wow" | dopracowanie + sygnaturowe detale | prestiż, apetyt | energia, młodość |
| Pasuje do „decyzyjnika" | ✅ (kompas = decyzja) | ⚠️ (magazyn = przeglądanie) | ✅ |

---

## 4. Quick wins (do zrobienia od ręki, przed wyborem kierunku)

1. **Favicona + apple-touch-icon** — nawet tymczasowa, z inicjałem „O" na pomarańczy.
2. **`og:image`** — jeden statyczny obraz 1200×630 (tytuł + paleta marki) w `BaseLayout.astro`.
3. **Kontrast przycisków:** akcent interakcji `#ff5a3d` → `#cf3b22` (biały tekst: 4.88:1 ✅). Jedna zmienna w `:root`.
4. **Łamanie wyrazów:** usunąć `overflow-wrap: anywhere` z `h1–h3` (`global.css:237-242`), zostawić na akapitach; dla H1 dodać `text-wrap: balance`. Naprawia „pomidoram / i" i „Śniadani / e".
5. **Ucięte pigułki trybów na desktopie:** w `.category-mode-picker` (media ≥700 px, `CategoryPanels.astro`) zamienić `justify-content:center` na `safe center` lub margines auto na trackach.
6. **Footer:** logo, 4 linki nawigacji, mail kontaktowy, © — 30 minut pracy, duży skok wiarygodności.
7. **Przyciszenie marquee na desktopie:** opacity 0.055 → ~0.03 i mniej rzędów.
8. **Podnieść 10–11 px do 12 px minimum** (chipy, liczniki, „WYBRANO").

---

## 5. Plan wdrożenia (po akceptacji kierunku)

| Etap | Zakres | Efekt |
|---|---|---|
| 0. Quick wins | punkty z §4 | strona przestaje wyglądać na niedokończoną |
| 1. Fundament | tokeny (kolor, typo-skala, radius, cień, spacing) w `:root`; font display self-hosted; naprawa wag | spójny język wizualny |
| 2. Tożsamość | sygnet + logotyp, favicona, OG per strona, footer | marka istnieje poza viewportem |
| 3. Apetyt | ilustracje potraw (zestaw SVG) w kartach, hero przepisu, OG per przepis | strona zaczyna „smakować" |
| 4. Desktop | pełnoprawne layouty ≥960 px (hero, kategorie, katalog), ujednolicenie kafli z mobile | koniec „rozciągniętego mobile" |
| 5. Polish | sygnaturowe animacje, mikrointerakcje, stany puste | efekt „wow" w detalu |

---

## Załączniki

Zrzuty z audytu (stan na 14.07.2026): [strona główna mobile](audyt/home-mobile.png) · [strona główna desktop](audyt/home-desktop.png) · [tryby mobile](audyt/home-kategorie-mobile.png) · [tryby desktop](audyt/home-kategorie-desktop.png) · [katalog mobile](audyt/przepisy-mobile.png) · [katalog desktop](audyt/przepisy-desktop.png) · [przepis mobile](audyt/przepis-mobile.png) · [przepis desktop](audyt/przepis-desktop.png)

Kontrasty policzone dla WCAG 2.x (relative luminance, z uwzględnieniem przezroczystości zmieszanej z tłem `#fff7ea`).
