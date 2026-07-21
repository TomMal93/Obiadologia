import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import type { CategorySelection, MealTime, Occasion, Recipe, Tempo } from '@/domain/recipe';
import { filterRecipesByCategories, hasCategorySelection } from '@/domain/recipe';
import {
  createRecipeSearch,
  rankRecipesForMap,
} from '@/domain/recipe-search';
import type { MapCoordinates, Trope, TropeKind } from '@/domain/recipe-search';
import './DiscoveryExperience.css';

interface Props {
  recipes: Recipe[];
}

type DiscoveryMode = 'search' | 'map';

interface DiscoverySnapshot {
  activeMode: DiscoveryMode;
  query: string;
  map: MapCoordinates;
}

interface DiscoverySession {
  id: string;
  initialMode: DiscoveryMode;
  snapshot: DiscoverySnapshot;
}

interface DiscoveryHistoryState {
  discovery?: DiscoverySession;
}

const initialSnapshot = (mode: DiscoveryMode): DiscoverySnapshot => ({
  activeMode: mode,
  query: '',
  map: { x: 50, y: 50 },
});

const endedSessionsKey = 'obiadologia-ended-discovery-sessions';

const categoryGroups = [
  {
    key: 'mealTime',
    label: 'Pora dnia',
    accent: 'daypart',
    options: [
      ['breakfast', 'Śniadanie'],
      ['lunch', 'Obiad'],
      ['dinner', 'Kolacja'],
    ] as const satisfies ReadonlyArray<readonly [MealTime, string]>,
  },
  {
    key: 'tempo',
    label: 'Tempo',
    accent: 'tempo',
    options: [
      ['now', 'Na już'],
      ['today', 'Na dziś'],
      ['two_days', 'Na dwa dni'],
    ] as const satisfies ReadonlyArray<readonly [Tempo, string]>,
  },
  {
    key: 'occasion',
    label: 'Okazja',
    accent: 'occasion',
    options: [
      ['kids', 'Dla dzieci'],
      ['guests', 'Dla gości'],
      ['grill', 'Na grilla'],
    ] as const satisfies ReadonlyArray<readonly [Occasion, string]>,
  },
] as const;

const optionLabels: Record<string, string> = Object.fromEntries(
  categoryGroups.flatMap((group) => group.options.map(([value, label]) => [value, label])),
);

type SelectionChip = {
  key: (typeof categoryGroups)[number]['key'];
  accent: (typeof categoryGroups)[number]['accent'];
  label: string;
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const groupIcons: Record<string, ReactNode> = {
  mealTime: <Icon><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4" /></Icon>,
  tempo: <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></Icon>,
  occasion: <Icon><path d="M4 20 8.5 9l6.5 6.5L4 20z" /><path d="M13 8s1.5-2 3.5-1.5M17 4v2M20.5 7.5 19 9M21 12h-2" /></Icon>,
};

const optionIcons: Record<string, ReactNode> = {
  breakfast: groupIcons.mealTime,
  lunch: <Icon><path d="M3 11h18a9 9 0 0 1-18 0zM12 3c-1 1-1 2 0 3" /></Icon>,
  dinner: <Icon><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" /></Icon>,
  now: <Icon><path d="M13 2 5 13h6l-1 9 8-11h-6l1-8z" /></Icon>,
  today: <Icon><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></Icon>,
  two_days: <Icon><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M4 15V6a2 2 0 0 1 2-2h9" /></Icon>,
  kids: <Icon><circle cx="12" cy="12" r="9" /><path d="M9 15a4 4 0 0 0 6 0M9.5 10h.01M14.5 10h.01" /></Icon>,
  guests: <Icon><circle cx="9" cy="9" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6.5a3 3 0 0 1 0 5M17 13.5a5.5 5.5 0 0 1 4 5.5" /></Icon>,
  grill: <Icon><path d="M5 9h14a7 7 0 0 1-14 0zM8.5 15.5 7 20M15.5 15.5 17 20M10 3s.8 1.4-.5 2.6M14 3s.8 1.4-.5 2.6" /></Icon>,
};

function getEndedSessions(): Set<string> {
  try {
    const value = window.sessionStorage.getItem(endedSessionsKey);
    return new Set(value ? (JSON.parse(value) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markSessionEnded(id: string) {
  const ended = getEndedSessions();
  ended.add(id);
  window.sessionStorage.setItem(endedSessionsKey, JSON.stringify([...ended].slice(-20)));
}

function RecipeItems({ recipes }: { recipes: Recipe[] }) {
  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <li key={recipe.id}>
          <a className="recipe-card" href={`/recipes/${recipe.slug}`}>
            <span className="recipe-media">
              {recipe.image ? (
                <img src={recipe.image.src} alt={recipe.image.alt} loading="lazy" />
              ) : (
                <span className="recipe-placeholder" aria-hidden="true">O</span>
              )}
            </span>
            <span className="recipe-content">
              <strong>{recipe.title}</strong>
              <span className="recipe-description visually-hidden">{recipe.description}</span>
              <span className="recipe-facts">
                <span className="recipe-meta">◷ {recipe.preparationMinutes} min</span>
                <span className="tag-list" aria-label="Tagi">
                  {recipe.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
                </span>
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// Rodzaj tropu → grupa akcentu (koloru). Pora dnia i składnik dzielą koral, tak
// jak w wyborze Kategorii: pora dnia↔Szukaj, tempo↔Kategorie, okazja↔Mapa.
const tropeAccent: Record<TropeKind, 'daypart' | 'tempo' | 'occasion'> = {
  daypart: 'daypart',
  ingredient: 'daypart',
  tempo: 'tempo',
  occasion: 'occasion',
};

function TropeList({
  label,
  labelId,
  tropes,
  onPick,
  variant = 'pills',
}: {
  label: string;
  labelId: string;
  tropes: Trope[];
  onPick: (query: string) => void;
  variant?: 'pills' | 'bento';
}) {
  if (tropes.length === 0) return null;
  return (
    <div className={`trope-block trope-block--${variant}`} role="group" aria-labelledby={labelId}>
      <p className="trope-label" id={labelId}>{label}</p>
      {variant === 'bento' ? (
        // Bento: pierwszy kafel jest „hero" 2×2 (patrz CSS nth-child(1)) i niesie
        // ikonę ⌕ przez pseudoelement; aria-label trzyma go poza nazwą dostępną,
        // więc czytnik ogłasza sam trop, a nie znak dekoracyjny.
        <div className="trope-bento">
          {tropes.map((trope, index) => (
            <button
              key={`${trope.kind}:${trope.query}`}
              type="button"
              className={`trope-tile trope-tile--${tropeAccent[trope.kind]}`}
              aria-label={index === 0 ? trope.label : undefined}
              onClick={() => onPick(trope.query)}
            >
              {trope.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="suggestion-list trope-list">
          {tropes.map((trope) => (
            <button
              key={`${trope.kind}:${trope.query}`}
              type="button"
              className={`trope-chip--${tropeAccent[trope.kind]}`}
              onClick={() => onPick(trope.query)}
            >
              {trope.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeList({
  recipes,
  headingId,
  title = 'Propozycje',
}: {
  recipes: Recipe[];
  headingId: string;
  title?: string;
}) {
  return (
    <section className="results discovery-results" aria-labelledby={headingId}>
      <h3 id={headingId}>{title}</h3>
      <RecipeItems recipes={recipes} />
    </section>
  );
}

function mapSummary({ x, y }: MapCoordinates): string {
  const pace = x < 50 ? `szybko ${100 - x}%` : x > 50 ? `bez pośpiechu ${x}%` : 'tempo neutralne';
  const character = y < 50 ? `lekko ${100 - y}%` : y > 50 ? `konkretnie ${y}%` : 'charakter neutralny';
  return `${pace} · ${character}`;
}

type MoodBand = 'low' | 'mid' | 'high';

// Pasmo neutralne 38–62 daje spokojny środek i zapobiega przeskokom nazwy przy
// drobnych ruchach (jeden krok klawiatury o 5 nie zmienia strefy).
function moodBand(value: number): MoodBand {
  if (value < 38) return 'low';
  if (value > 62) return 'high';
  return 'mid';
}

// Wiersze: tempo (low = szybko, high = bez pośpiechu).
// Kolumny: charakter (low = lekko, high = konkretnie).
const moodNames: Record<MoodBand, Record<MoodBand, string>> = {
  low: { low: 'Ekspres na lekko', mid: 'Szybki strzał', high: 'Ekspresowy konkret' },
  mid: { low: 'Lekki luz', mid: 'Codzienny środek', high: 'Solidny standard' },
  high: { low: 'Powolna lekkość', mid: 'Spokojny rytm', high: 'Wolny rytuał' },
};

function moodName({ x, y }: MapCoordinates): string {
  return moodNames[moodBand(x)][moodBand(y)];
}

// Barwa płynie wraz z osiami: odcień ciepły (koralowy) przy „szybko” i chłodny
// (niebieski) przy „bez pośpiechu”, jasność maleje ku „konkretnie”, a nasycenie
// rośnie z odległością od neutralnego środka. Kolor jest dekoracją — znaczenie
// niesie nazwa oraz dostępna etykieta punktu.
function moodColor({ x, y }: MapCoordinates): string {
  const hue = Math.round(12 + (x / 100) * 200);
  const intensity = Math.max(Math.abs(x - 50), Math.abs(y - 50)) / 50;
  const saturation = Math.round(22 + intensity * 58);
  const lightness = Math.round(52 - (y / 100) * 20);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

// Wariant dla tekstu nazwy nastroju: ten sam odcień i nasycenie co punkt, ale
// jasność przypięta do najciemniejszego końca palety (32%). Pełna barwa punktu
// bywa zbyt jasna — najjaśniejsze odcienie (żółć/zieleń przy „lekko”) na białym
// tle nie osiągają kontrastu WCAG 3:1 dla dużego, pogrubionego tekstu. 32% daje
// ≥3,3:1 w całym zakresie odcieni; dekoracyjny punkt mapy zostaje przy pełnej
// palecie.
function moodTextColor({ x, y }: MapCoordinates): string {
  const hue = Math.round(12 + (x / 100) * 200);
  const intensity = Math.max(Math.abs(x - 50), Math.abs(y - 50)) / 50;
  const saturation = Math.round(22 + intensity * 58);
  return `hsl(${hue} ${saturation}% 32%)`;
}

export function DiscoveryExperience({ recipes }: Props) {
  const [selection, setSelection] = useState<CategorySelection>({});
  const [session, setSession] = useState<DiscoverySession | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapPointRef = useRef<HTMLButtonElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const recipeSearch = useMemo(() => createRecipeSearch(recipes), [recipes]);

  const hasSelection = hasCategorySelection(selection);
  const categoryResults = useMemo(
    () => filterRecipesByCategories(recipes, selection).slice(0, 4),
    [recipes, selection],
  );
  const snapshot = session?.snapshot;
  const currentQuery = snapshot?.query ?? '';
  const currentMap = snapshot?.map;

  // Pole tekstowe i punkt mapy reagują natychmiast, ale kosztowne obliczenia
  // pracują na wartościach opóźnionych: zapytanie po pauzie w pisaniu, ranking
  // mapy co najwyżej raz na klatkę animacji — bez opóźniania ruchu punktu.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [rankedMap, setRankedMap] = useState<MapCoordinates>({ x: 50, y: 50 });

  useEffect(() => {
    // Wyczyszczenie pola nie czeka na pauzę w pisaniu — tylko niepuste zapytanie
    // ma sens debounce'owania.
    const timer = window.setTimeout(() => setDebouncedQuery(currentQuery), currentQuery ? 200 : 0);
    return () => window.clearTimeout(timer);
  }, [currentQuery]);

  useEffect(() => {
    if (!currentMap) return;
    const frame = window.requestAnimationFrame(() => setRankedMap(currentMap));
    return () => window.cancelAnimationFrame(frame);
  }, [currentMap]);

  const searchResults = useMemo(
    () => recipeSearch.search(debouncedQuery).slice(0, 4),
    [recipeSearch, debouncedQuery],
  );
  const suggestions = useMemo(
    () => recipeSearch.suggest(debouncedQuery),
    [recipeSearch, debouncedQuery],
  );
  const tropes = useMemo(() => recipeSearch.tropes(), [recipeSearch]);
  const mapResults = useMemo(
    () => rankRecipesForMap(recipes, rankedMap),
    [recipes, rankedMap],
  );

  const restoreFromHistory = useCallback((state: DiscoveryHistoryState | null) => {
    const saved = state?.discovery;
    if (!saved) {
      setSession(null);
      openerRef.current?.focus();
      return;
    }

    if (getEndedSessions().has(saved.id)) {
      const renewed: DiscoverySession = {
        id: crypto.randomUUID(),
        initialMode: saved.initialMode,
        snapshot: initialSnapshot(saved.initialMode),
      };
      window.history.replaceState({ ...window.history.state, discovery: renewed }, '');
      setSession(renewed);
      return;
    }
    setSession(saved);
  }, []);

  const openOverlay = useCallback((mode: DiscoveryMode, opener: HTMLElement) => {
    openerRef.current = opener;
    const nextSession: DiscoverySession = {
      id: crypto.randomUUID(),
      initialMode: mode,
      snapshot: initialSnapshot(mode),
    };
    window.history.pushState({ ...window.history.state, discovery: nextSession }, '', window.location.href);
    setSession(nextSession);
  }, []);

  function requestClose() {
    if (!session) return;
    markSessionEnded(session.id);
    // Zamknięcie nie może zależeć wyłącznie od history.back(): w osadzonych
    // przeglądarkach (webview in-app) albo gdy overlay jest pierwszym wpisem
    // historii karty back() nie ma dokąd wrócić — popstate nie zdąży zamknąć
    // dialogu i X „nie działa". Dlatego zamykamy stan wprost, a cofnięcie
    // historii tylko zdejmuje wpis overlaya (zachowując „Forward → ponowne
    // otwarcie"); gdy back() jest bezczynny, restoreFromHistory po prostu się
    // nie odpali, a overlay i tak jest już zamknięty.
    setSession(null);
    openerRef.current?.focus();
    window.history.back();
  }

  function updateSnapshot(patch: Partial<DiscoverySnapshot>) {
    setSession((current) => current ? {
      ...current,
      snapshot: { ...current.snapshot, ...patch },
    } : current);
  }

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      restoreFromHistory(window.history.state as DiscoveryHistoryState | null);
    }, 0);
    const onPopState = (event: PopStateEvent) => {
      restoreFromHistory(event.state as DiscoveryHistoryState | null);
    };
    const onOpenRequest = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest('[data-discovery-mode]')
        : null;
      if (!(target instanceof HTMLElement)) return;
      const mode = target.dataset.discoveryMode;
      if (mode === 'search' || mode === 'map') openOverlay(mode, target);
    };
    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onOpenRequest);
    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onOpenRequest);
    };
  }, [openOverlay, restoreFromHistory]);

  const isOpen = Boolean(session);
  const activeMode = session?.snapshot.activeMode;

  useEffect(() => {
    if (!session) return;
    window.history.replaceState({ ...window.history.state, discovery: session }, '');
  }, [session]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // W trybie Wyszukiwarki fokus trafia na dialog, a nie na pole — dzięki temu
    // klawiatura ekranowa nie otwiera się na starcie, a fokus i tak pozostaje
    // w overlayu (pole nadal opisane etykietą i osiągalne Tabem/dotknięciem).
    const focusTarget = activeMode === 'search'
      ? dialogRef.current
      : mapPointRef.current;
    window.requestAnimationFrame(() => focusTarget?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeMode, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const resultCount = activeMode === 'search'
      ? searchResults.length
      : mapResults.length;
    const timer = window.setTimeout(() => {
      setAnnouncement(resultCount === 1 ? 'Znaleziono 1 propozycję.' : `Znaleziono ${resultCount} propozycje.`);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [activeMode, currentMap, currentQuery, isOpen, mapResults.length, searchResults.length]);

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href]',
    )];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function updateMapFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = mapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    updateSnapshot({
      map: {
        x: Math.round(Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100))),
        y: Math.round(Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100))),
      },
    });
  }

  function handleMapKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!snapshot || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const delta = 5;
    const next = { ...snapshot.map };
    if (event.key === 'ArrowLeft') next.x = Math.max(0, next.x - delta);
    if (event.key === 'ArrowRight') next.x = Math.min(100, next.x + delta);
    if (event.key === 'ArrowUp') next.y = Math.max(0, next.y - delta);
    if (event.key === 'ArrowDown') next.y = Math.min(100, next.y + delta);
    updateSnapshot({ map: next });
  }

  function toggle(key: keyof CategorySelection, value: MealTime | Tempo | Occasion) {
    setSelection((current) => ({ ...current, [key]: current[key] === value ? undefined : value }));
  }

  const selectedChips = categoryGroups
    .map((group): SelectionChip | null => {
      const value = selection[group.key];
      return value ? { key: group.key, accent: group.accent, label: optionLabels[value] } : null;
    })
    .filter((chip): chip is SelectionChip => chip !== null);

  return (
    <>
      <section id="kategorie" className="screen category-section" aria-labelledby="categories-heading">
        <div className="section-heading">
          <h2 id="categories-heading" className="category-heading">Kategorie</h2>
          <p className="category-subtitle">Wybierz co najmniej jedną opcję:<br />porę dnia, tempo lub okazję.</p>
        </div>
        <div className="category-panel">
          {categoryGroups.map((group) => (
            <fieldset key={group.key} className={`category-group category-group--${group.accent}`}>
              <legend><span>{group.label}</span><span className="legend-icon">{groupIcons[group.key]}</span></legend>
              <div className="option-grid">
                {group.options.map(([value, label]) => {
                  const selected = selection[group.key] === value;
                  return (
                    <button key={value} type="button" className={selected ? 'category-option is-selected' : 'category-option'} aria-pressed={selected} onClick={() => toggle(group.key, value)}>
                      <span className="option-icon">{optionIcons[value]}</span>{label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <a className="category-details-link" href="/categories">
            Szczegółowe wyszukiwanie
          </a>
        </div>
        <section className="results category-results-frame" aria-labelledby="category-results-heading">
          <h3 id="category-results-heading">Propozycje dla Ciebie</h3>
          <div className="category-selection-summary" aria-live="polite">
            {hasSelection ? (
              <>
                <span className="selection-summary-label">Wybrano:</span>
                <span className="selection-summary-chips">
                  {selectedChips.map((chip) => (
                    <span key={chip.key} className={`selection-chip selection-chip--${chip.accent}`}>{chip.label}</span>
                  ))}
                </span>
              </>
            ) : (
              <span className="selection-summary-hint">Wybierz co najmniej jedną opcję.</span>
            )}
          </div>
          <div
            className={`category-results-body${hasSelection && categoryResults.length > 0 ? '' : ' is-message'}`}
            role="region"
            aria-label="Wyniki kategorii"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={hasSelection && categoryResults.length > 0 ? 0 : undefined}
          >
            {!hasSelection && <p className="category-results-message">Tutaj pojawią się dopasowane przepisy.</p>}
            {hasSelection && categoryResults.length === 0 && <p className="category-results-message">Brak dopasowań. Zmień lub usuń wybrane kryterium.</p>}
            {hasSelection && categoryResults.length > 0 && <RecipeItems recipes={categoryResults} />}
          </div>
        </section>
      </section>

      {session && snapshot && (
        <dialog
          open
          ref={dialogRef}
          tabIndex={-1}
          className={`discovery-overlay discovery-overlay--${snapshot.activeMode}`}
          aria-modal="true"
          aria-labelledby="discovery-title"
          onKeyDown={handleDialogKeyDown}
        >
          <div className="overlay-header">
            <span className="overlay-brand-mark" aria-hidden="true">O</span>
            <strong>Obiadologia</strong>
            <button type="button" className="overlay-close" aria-label="Zamknij discovery" onClick={requestClose}>×</button>
          </div>

          <div className="mode-switch" role="group" aria-label="Tryb odkrywania">
            <button type="button" className={snapshot.activeMode === 'search' ? 'is-active' : ''} aria-pressed={snapshot.activeMode === 'search'} onClick={() => updateSnapshot({ activeMode: 'search' })}>
              Wyszukiwarka
            </button>
            <button type="button" className={snapshot.activeMode === 'map' ? 'is-active' : ''} aria-pressed={snapshot.activeMode === 'map'} onClick={() => updateSnapshot({ activeMode: 'map' })}>
              Mapa
            </button>
          </div>

          {snapshot.activeMode === 'search' ? (
            <div className="overlay-mode">
              <div className="overlay-intro">
                <h2 id="discovery-title">Masz trop? Wpisz go tutaj</h2>
                <p>Składnik, danie, smak albo tag.</p>
              </div>
              <label className="search-field">
                <span className="visually-hidden">Szukaj przepisu</span>
                <span aria-hidden="true">⌕</span>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={snapshot.query}
                  placeholder="np. kurczak, curry, szybko, bez mięsa"
                  autoComplete="off"
                  onChange={(event) => updateSnapshot({ query: event.target.value })}
                />
                {snapshot.query && (
                  <button
                    type="button"
                    className="search-clear"
                    aria-label="Wyczyść wyszukiwanie"
                    onClick={() => {
                      updateSnapshot({ query: '' });
                      searchInputRef.current?.focus();
                    }}
                  >
                    ×
                  </button>
                )}
              </label>
              {snapshot.query && suggestions.length > 0 && (
                <div className="suggestion-list" aria-label="Sugestie wyszukiwania">
                  {suggestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => updateSnapshot({ query: suggestion })}>{suggestion}</button>
                  ))}
                </div>
              )}
              {!snapshot.query && (
                <TropeList
                  label="Popularne tropy"
                  labelId="search-tropes-heading"
                  tropes={tropes}
                  onPick={(trope) => updateSnapshot({ query: trope })}
                  variant="bento"
                />
              )}
              {snapshot.query && searchResults.length > 0 && <RecipeList recipes={searchResults} headingId="search-results-heading" />}
              {snapshot.query && debouncedQuery === snapshot.query && searchResults.length === 0 && (
                <>
                  <p className="empty-state overlay-empty">Nie znaleźliśmy pasujących propozycji.</p>
                  <TropeList
                    label="Spróbuj popularnych tropów:"
                    labelId="search-empty-tropes-heading"
                    tropes={tropes}
                    onPick={(trope) => updateSnapshot({ query: trope })}
                    variant="bento"
                  />
                </>
              )}
            </div>
          ) : (
            <div className="overlay-mode">
              <div className="overlay-intro">
                <h2 id="discovery-title">Wskaż klimat na mapie</h2>
                <p>Przesuń talerz tam, gdzie dziś Ci pasuje.</p>
              </div>
              <div
                ref={mapRef}
                className="preference-map"
                role="application"
                aria-label="Mapa preferencji: szybko do bez pośpiechu oraz lekko do konkretnie"
                onPointerDown={(event) => {
                  draggingRef.current = true;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  updateMapFromPointer(event);
                }}
                onPointerMove={(event) => draggingRef.current && updateMapFromPointer(event)}
                onPointerUp={(event) => {
                  draggingRef.current = false;
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
              >
                <span className="map-label map-label--top">lekko</span>
                <span className="map-label map-label--right">bez pośpiechu</span>
                <span className="map-label map-label--bottom">konkretnie</span>
                <span className="map-label map-label--left">szybko</span>
                <button
                  ref={mapPointRef}
                  type="button"
                  className="map-point"
                  style={{
                    left: `${snapshot.map.x}%`,
                    top: `${snapshot.map.y}%`,
                    '--map-point-mood': moodColor(snapshot.map),
                  } as CSSProperties}
                  aria-label={`Talerz na mapie: ${mapSummary(snapshot.map)}`}
                  onKeyDown={handleMapKeyDown}
                >
                  <span aria-hidden="true">♨</span>
                </button>
              </div>
              <p className="map-mood" aria-hidden="true">
                <span className="map-mood__label">Nastrój na dziś:</span>
                <span className="map-mood__value" style={{ color: moodTextColor(snapshot.map) }}>
                  {moodName(snapshot.map)}
                </span>
              </p>
              {mapResults.length > 0 && <RecipeList recipes={mapResults} headingId="map-results-heading" />}
              {mapResults.length === 0 && <p className="empty-state overlay-empty">Nie znaleźliśmy propozycji dla tego miejsca.</p>}
            </div>
          )}
          <p className="visually-hidden" role="status" aria-live="polite">{announcement}</p>
        </dialog>
      )}
    </>
  );
}
