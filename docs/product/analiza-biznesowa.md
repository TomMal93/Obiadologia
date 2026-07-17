# Analiza biznesowa i pomysły rozwojowe

> Status: materiał roboczy (nie jest specyfikacją)
> Data: 2026-07-17
> Kontekst: analiza na podstawie dokumentacji produktu i kodu MVP

## Punkt wyjścia

Obiadologia to nie jest kolejny portal z przepisami — i to jest największy atut. Pozycjonowanie „nie musisz wiedzieć, czego chcesz" adresuje realny, codzienny ból: zmęczenie decyzyjne. Pytanie „co dziś jemy?" pada w polskich domach ~365 razy w roku i żaden duży gracz (Kwestia Smaku, Aniagotuje, Kuchnia Lidla) go wprost nie rozwiązuje — oni rozwiązują problem „jak ugotować X", nie „co ugotować".

Mapa preferencji (tempo × lekkość) to wyróżnik, którego nikt na polskim rynku nie ma.

Słabość: 100 statycznych przepisów bez kont to produkt, do którego nie ma po co wracać — brak pętli nawyku i brak danych o użytkowniku.

## 10 pomysłów na rozwój

1. **„Zakręć kołem" / propozycja dnia** — jeden przycisk, zero decyzji: aplikacja sama proponuje danie na podstawie pory dnia i dnia tygodnia. To najczystsza realizacja wizji produktu (minimum decyzji) i naturalny powód codziennego powrotu, np. jako powiadomienie o 16:00: „Dziś proponujemy…".

2. **Tryb „co mam w lodówce"** — użytkownik wpisuje 2–3 składniki, które musi zużyć, a aplikacja pokazuje dania, które da się z nich zrobić. Model `Recipe` już ma pole `ingredients`, więc to rozszerzenie wyszukiwarki, nie nowa architektura. W czasach drożyzny „niemarnowanie" jest silnym motywatorem społecznym.

3. **Lekka pamięć bez kont** — localStorage zamiast logowania: „ostatnio oglądane", „ukryj to danie", serdeczko na ulubione. Zero backendu (zgodnie z ADR-0001), a mapa i propozycje zaczynają się uczyć użytkownika. Konta dopiero wtedy, gdy będzie co synchronizować.

4. **Trzecia oś mapy jako „nastrój dnia"** — sezonowość i pogoda: w listopadowy wieczór mapa domyślnie ciąży ku „konkretnie", w lipcowe południe ku „lekko". Prosta heurystyka (data + ew. API pogodowe), a produkt sprawia wrażenie, że „rozumie" użytkownika. - tociekawe, bo można analizowac na podstawie pogody.

5. **Planer tygodnia „od tyłu"** — nie klasyczny meal planner (słusznie wykluczony z MVP jako moloch), tylko odwrotność: użytkownik przeciąga punkt na mapie 5 razy — po razie na każdy dzień roboczy — i dostaje plan tygodnia w 30 sekund. Z planu generuje się jedna lista zakupów.

6. **Lista zakupów z eksportem** — skoro są składniki, jedno kliknięcie tworzy listę do skopiowania/udostępnienia na WhatsApp. To najkrótsza droga od „zdecydowałem" do „kupiłem", a jednocześnie fundament pod przyszłe partnerstwa z e-grocery (patrz monetyzacja). - git

7. **Tryb „gotujemy we dwoje/rodzinnie"** — dwie osoby przesuwają punkt na mapie (na jednym telefonie, po kolei), aplikacja pokazuje część wspólną. Konflikt „ja chcę lekko, on chce konkretnie" to realny scenariusz domowy i świetny materiał wirusowy („sprawdźcie, co wybierze Wasza mapa"). - do pomyslenia

8. **SEO-owe strony przepisów jako silnik wzrostu** — stos Astro jest do tego stworzony: statyczne strony `/recipes/:slug` ze structured data (schema.org/Recipe), szybkie, z ładnymi zdjęciami. 100 świetnie zoptymalizowanych przepisów pod długi ogon fraz („szybki obiad dla dzieci bez mięsa") da darmowy ruch, którego nie da się kupić za żadne pieniądze reklamowe.

9. **PWA + instalacja na ekranie głównym** — aplikacja jest już mobilna i statyczna; manifest + service worker to mały koszt, a „ikonka na telefonie" zamienia jednorazowego gościa w narzędzie codzienne. Działanie offline to bonus (przepis w kuchni bez zasięgu).

10. **Krótkie wideo „danie w 15 sekund"** — zamiast statycznego zdjęcia na karcie, opcjonalny klip pokazujący gotowe danie i 2–3 kluczowe kroki. To jednocześnie content na TikTok/Reels/Shorts — kanał, którym dziś realnie zdobywa się użytkowników food-appek w Polsce, praktycznie za koszt produkcji.

## 3 pomysły niszowe

1. **Obiadologia dla rodziców małych dzieci** — okazja `kids` już istnieje w słowniku. Nisza: rodzice dzieci 1–6 lat, którzy codziennie toczą wojnę o to, co dziecko zje. Filtry typu „bez ostrego, da się zrobić jedną ręką, dziecko może pomóc". To grupa o ogromnej desperacji decyzyjnej, aktywna w mediach społecznościowych i lojalna wobec narzędzi, które realnie pomagają. - to ciekawe

2. **Obiadologia po treningu / dla aktywnych** — mapa lekkość×tempo naturalnie pasuje do osób trenujących: „szybko i białkowo po siłowni" vs „regeneracyjnie w dzień wolny". Dodanie makroskładników do modelu `Recipe` otwiera współprace z trenerami i klubami fitness — nisza z nawykiem płacenia za zdrowie.

3. **Obiadologia budżetowa — obiad do 15 zł/porcję** — koszt porcji jako pole modelu i filtr. W obecnych nastrojach społecznych (utrzymująca się wrażliwość cenowa na żywność) „tanio i konkretnie" to nisza masowa: studenci, młode rodziny, single. Nikt w Polsce nie robi tego dobrze z aktualizowanymi cenami — nawet przybliżony koszt („ok. 12–16 zł") daje przewagę.

## 4 pomysły na monetyzację

1. **Afiliacja z e-grocery i quick-commerce** — przycisk „zamów składniki" przy przepisie/liście zakupów, prowadzący do koszyka w Barbora, Auchan, Carrefour, Lisek/Jush czy Żabka Nano. Prowizja od koszyka (zwykle 3–8%). To monetyzacja zgodna z misją: skraca drogę od decyzji do obiadu, nie przeszkadza w niej.

2. **Sponsorowane składniki i partnerstwa z markami FMCG** — model „Kuchni Lidla" à rebours: producent (np. marka fety, makaronu, halloumi) płaci za obecność swojego produktu w przepisach i za pozycję „danie tygodnia". Ważne: oznaczone jako współpraca i tylko tam, gdzie produkt naturalnie pasuje — wiarygodność to kapitał, którego nie warto przepalić banerami.

3. **Premium „Obiadologia+" (subskrypcja ~9–15 zł/mies.)** — darmowy rdzeń zostaje darmowy (3 drogi odkrywania), płatne są oszczędzające czas nadbudowy: planer tygodnia, lista zakupów z eksportem, tryb budżetowy z kosztem porcji, profile rodzinne. W Polsce próg płacenia za appki spożywcze jest niski, więc premium powinno celować w nisze z sekcji wyżej (rodzice, aktywni) — oni płacą za rozwiązanie swojego konkretnego bólu.

4. **B2B: silnik „co dziś jemy?" jako widget/API** — mapa preferencji i dopasowanie to technologia licencjonowalna: dla cateringów dietetycznych (rynek diet pudełkowych w Polsce to setki firm walczących o konwersję — „wskaż klimat, dobierzemy Ci dietę"), dla sieci handlowych do ich aplikacji, dla portali kulinarnych, które mają katalog, ale nie mają odkrywania. Model domenowy jest już świadomie odseparowany od frameworka (ADR-0001), więc technicznie projekt jest w połowie drogi.

## Rekomendowana kolejność

1. Pomysły 8 + 9 (SEO + PWA) — tani, organiczny wzrost na istniejącym stosie.
2. Pomysły 2 + 6 (lodówka + lista zakupów) — budują wartość i przygotowują grunt pod afiliację.
3. Monetyzację zacząć od afiliacji e-grocery — nie wymaga masy krytycznej użytkowników ani psucia produktu reklamami.
4. Subskrypcję uruchomić dopiero po potwierdzeniu retencji w jednej z nisz.
