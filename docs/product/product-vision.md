# Wizja produktu Obiadologia

> Status: obowiązujący  
> Właściciel: właściciel produktu  
> Opisywany stan: docelowy (to-be)  
> Ostatnia aktualizacja: 2026-07-15


## Cel produktu

Obiadologia pomaga odpowiedzieć na codzienne pytanie:

**„Co dziś zjemy?”**

Problemem użytkownika nie jest brak przepisów. Problemem jest konieczność wymyślenia dania, dopasowania go do czasu i sytuacji, uwzględnienia innych osób oraz przejrzenia zbyt wielu możliwości.

Obiadologia ma skrócić drogę od niejasnej potrzeby do kilku możliwych do wykonania propozycji.

## Obietnica

**Mniej myślenia nad jedzeniem. Więcej odpowiedzi dopasowanych do dnia.**

Użytkownik nie musi znać nazwy dania ani wiedzieć, czego dokładnie szuka.

## W zakresie

Produkt:

- pomaga zdecydować, co przygotować do jedzenia,
- zaczyna od sytuacji użytkownika, a nie od struktury bazy przepisów,
- uwzględnia czas, okazję, odbiorców, preferencje i dostępne składniki,
- zawęża wybór do niewielkiej liczby pasujących propozycji,
- pozwala użytkownikowi zrozumieć, dlaczego widzi dane wyniki.

## Poza zakresem

Obiadologia nie jest:

- katalogiem nastawionym na prezentowanie tysięcy przepisów,
- portalem kulinarnym opartym głównie na artykułach,
- wyszukiwarką wymagającą precyzyjnego zapytania,
- panelem z dziesiątkami filtrów,
- narzędziem projektowanym wokół struktury danych zamiast potrzeb użytkownika.

Ten dokument nie określa szczegółowego zachowania widoków, algorytmu dopasowania, modelu danych ani architektury aplikacji.

## Trzy drogi do przepisu

Obiadologia oferuje trzy równorzędne sposoby rozpoczęcia:

1. **Mapa — „Nie wiem, czego chcę”**  
   Użytkownik określa charakter posiłku bez podawania nazwy dania.

2. **Szukaj — „Mam już jakiś trop”**  
   Użytkownik podaje składnik, danie, smak, kategorię albo tag.

3. **Przeglądanie — „Chcę zobaczyć możliwości”**  
   Użytkownik wybiera kontekst, taki jak pora dnia, tempo lub okazja.

Wszystkie trzy drogi prowadzą do tego samego rezultatu: kilku dopasowanych propozycji.

## Zasady produktu

- Interfejs MUSI ograniczać liczbę decyzji wymaganych od użytkownika.
- Funkcje MUSZĄ używać języka codziennych potrzeb, bez wymagania wiedzy kulinarnej.
- Pierwszy zestaw wyników POWINIEN być krótki i dopasowany. Dokładną liczbę określa specyfikacja danej funkcji.
- Użytkownik MUSI zachować kontrolę nad wyborem.
- Produkt nie może oceniać szybkich, prostych ani mniej ambitnych wyborów.
- Kolor służy rozpoznawaniu trybu i aktywnego wyboru, a nie dekorowaniu całego interfejsu.
- Nowa funkcja nie powinna zwiększać liczby kroków bez wyraźnej korzyści dla użytkownika.

## Filtr dla nowych funkcji

Przed dodaniem funkcji odpowiedz:

1. Czy pomaga szybciej zdecydować, co zjeść?
2. Czy odpowiada na realną, codzienną sytuację?
3. Czy zmniejsza liczbę decyzji?
4. Czy jest zrozumiała bez instrukcji?
5. Czy działa, gdy użytkownik nie zna nazwy dania?
6. Czy prowadzi do kilku trafnych propozycji?

Jeżeli większość odpowiedzi brzmi „nie”, funkcja nie powinna być częścią głównego doświadczenia Obiadologii.
