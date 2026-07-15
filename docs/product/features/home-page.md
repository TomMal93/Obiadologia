# Strona główna

> Status: obowiązujący  
> Właściciel: właściciel produktu  
> Opisywany stan: docelowy dla MVP  
> Ostatnia aktualizacja: 2026-07-15

## Cel

Strona główna prowadzi użytkownika do przepisu trzema równorzędnymi drogami:

1. Mapa — użytkownik nie potrafi nazwać dania, ale zna oczekiwany charakter posiłku.
2. Szukaj — użytkownik ma składnik, nazwę dania, smak, kategorię lub tag.
3. Kategorie — użytkownik chce zawęzić propozycje przez porę dnia, tempo i okazję.

## Zatwierdzone materiały referencyjne

- [Hero](../../assets/ui/home-hero.png)
- [Sekcja „Wybierz tryb”](../../assets/ui/home-browse-mode.png)

Makiety określają wygląd i hierarchię treści. Nie określają dokładnych wymiarów, algorytmu dopasowania ani źródła danych.

## W zakresie

- hero z trzema drogami do przepisu,
- przejście do overlayu Mapy,
- przejście do overlayu Wyszukiwarki,
- przejście do sekcji „Wybierz tryb”,
- wybór pory dnia, tempa i okazji,
- lista dopasowanych propozycji,
- przycisk „Pokaż więcej”.

## Poza zakresem

- szczegóły przepisu po kliknięciu karty,
- logowanie i zapisywanie wyborów użytkownika,
- zapisywanie filtrów w adresie URL,
- algorytm dopasowania przepisów,
- zachowanie i zawartość overlayów Mapy oraz Wyszukiwarki.

## Hero

Hero zawiera:

- nazwę „Obiadologia”,
- nagłówek „Co dziś jemy?”,
- komunikat „Nie musisz wiedzieć, czego chcesz.”,
- nagłówek „Wybierz najbliższą myśl”,
- trzy ścieżki:
  - „Nie wiem, czego chcę” → przycisk „Mapa”,
  - „Wiem, czego szukam” → przycisk „Szukaj”,
  - „Chcę przeglądać” → przycisk „Kategorie”.

Przycisk „Mapa” otwiera pełnoekranowy overlay z aktywną zakładką Mapy.

Przycisk „Szukaj” otwiera pełnoekranowy overlay z aktywną zakładką Wyszukiwarki.

Przycisk „Kategorie” przewija stronę do sekcji „Wybierz tryb”. Po zakończeniu przewijania fokus przechodzi na nagłówek tej sekcji.

Hero nie zawiera dolnej nawigacji mobilnej.

Kolory przycisków określają tryb:

- Mapa — niebieski,
- Szukaj — koralowy,
- Kategorie — zielony.

## Sekcja „Wybierz tryb”

Sekcja zawiera nagłówek „Wybierz tryb” oraz tekst „Połącz 3 wybory: pora dnia, tempo i okazja.”

Użytkownik wybiera dokładnie jedną opcję w każdej grupie:

| Grupa | Opcje |
| --- | --- |
| Pora dnia | Śniadanie, Obiad, Kolacja |
| Tempo | Na już, Na dziś, Na dwa dni |
| Okazja | Dla dzieci, Dla gości, Na grilla |

### Stan początkowy

Po wejściu na stronę żadna opcja nie jest zaznaczona.

Sekcja wyświetla komunikat:

> Wybierz po jednej opcji z każdej grupy, a pokażemy propozycje.

Lista wyników i przycisk „Pokaż więcej” nie są widoczne.

### Stan niepełnego wyboru

Po wybraniu jednej lub dwóch grup zaznaczone opcje pozostają widoczne.

Komunikat wskazuje, ile grup pozostało do wybrania. Lista wyników nadal nie jest widoczna.

### Stan gotowy

Po wybraniu opcji we wszystkich trzech grupach:

- każda grupa ma dokładnie jedną aktywną opcję,
- widoczne jest podsumowanie w formacie `Wybrano: {pora dnia} · {tempo} · {okazja}`,
- pojawia się nagłówek „Propozycje dla Ciebie”,
- pojawiają się trzy lub cztery dopasowane karty,
- widoczny jest przycisk „Pokaż więcej”.

Zmiana aktywnej opcji w dowolnej grupie odświeża podsumowanie i wyniki bez przeładowania strony oraz bez dodatkowego przycisku zatwierdzającego.

### Ładowanie

Jeżeli pobranie wyników jest asynchroniczne:

- aktywne wybory i podsumowanie pozostają widoczne,
- obszar wyników pokazuje stan ładowania,
- użytkownik może zmienić wybór podczas ładowania,
- wynik starszego żądania nie może nadpisać wyników nowszego wyboru.

### Brak wyników

Jeżeli pełny zestaw wyborów nie zwraca wyników:

- wyświetlany jest komunikat o braku propozycji,
- widoczna jest możliwość zmiany dowolnego wyboru,
- nie jest widoczny przycisk „Pokaż więcej”.

### Błąd

Jeżeli nie można pobrać wyników:

- wyświetlany jest zrozumiały komunikat błędu,
- aktywne wybory pozostają zachowane,
- użytkownik może ponowić pobranie wyników,
- błąd nie usuwa możliwości zmiany wyborów.

## Karty wyników

Każda karta zawiera:

- zdjęcie potrawy,
- nazwę przepisu,
- czas przygotowania,
- od jednego do trzech tagów.

Opis karty jest opcjonalny w tej sekcji. Szczegółową wspólną specyfikację kart określa dokumentacja danych lub komponentu, gdy powstanie.

Karty pozostają wizualnie neutralne. Kolory grup są używane przede wszystkim dla aktywnych opcji, ikon i podsumowania.

## „Pokaż więcej”

Przycisk pobiera lub pokazuje kolejną porcję wyników dla aktualnych wyborów.

Podczas ładowania przycisk komunikuje stan ładowania i nie może wysłać drugiego żądania.

Jeżeli nie ma kolejnych wyników, przycisk znika, a interfejs informuje, że pokazano wszystkie dostępne propozycje.

## Dostępność i responsywność

- Opcje w każdej grupie tworzą jedną grupę wyboru i są obsługiwane z klawiatury.
- Aktywna opcja ma widoczny focus i stan zaznaczenia dostępny dla technologii asystujących.
- Zmiana kompletnego zestawu wyborów ogłasza podsumowanie oraz liczbę pokazanych propozycji.
- Elementy interaktywne mają dostępne nazwy zgodne z widocznymi etykietami.
- Gdy trzy opcje nie mieszczą się bez przepełnienia lub nieczytelnego łamania tekstu, układają się pionowo.
- Gdy trzy ścieżki hero nie mieszczą się w jednym rzędzie, układają się pionowo.
- Interfejs nie wymaga przewijania w poziomie.

Dokładne breakpointy oraz standard dostępności zostaną określone w zasadach UI.

## Kryteria akceptacji

| Kryterium | Sposób weryfikacji |
| --- | --- |
| Każda z trzech dróg z hero prowadzi do właściwego widoku | kontrola w przeglądarce |
| Początkowo nie ma aktywnych filtrów ani wyników | test komponentu i kontrola w przeglądarce |
| Można wybrać dokładnie jedną opcję w każdej grupie | test komponentu |
| Wyniki pojawiają się po kompletnym wyborze | test komponentu i kontrola w przeglądarce |
| Zmiana wyboru odświeża wyniki bez przeładowania strony | test komponentu |
| Można obsłużyć wybór wyłącznie z klawiatury | kontrola ręczna |
| Wąski widok nie ma poziomego przewijania | kontrola w przeglądarce |
| Widok odpowiada zatwierdzonym makietom w zakresie hierarchii i kolorów | kontrola wizualna |
