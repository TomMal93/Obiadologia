import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CategorySelection, MealTime, Occasion, Recipe, Tempo } from '@/domain/recipe';
import { filterRecipesByCategories, hasCategorySelection } from '@/domain/recipe';
import './DiscoveryExperience.css';

interface Props {
  recipes: Recipe[];
}

const categoryGroups = [
  {
    key: 'mealTime',
    label: 'Pora dnia',
    // Kolor akcentu grupy (docelowy) — zob. docs/design/ui-system.md „Akcenty grup Kategorii”.
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

// Etykiety pochodzą z tej samej definicji co przyciski wyboru — jedno źródło
// prawdy dla par wartość→etykieta, bez osobnej, ręcznie utrzymywanej mapy.
const optionLabels: Record<string, string> = Object.fromEntries(
  categoryGroups.flatMap((group) => group.options.map(([value, label]) => [value, label])),
);

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// Ikony grup i opcji zgodne z makietą home-browse-mode.png. Są dekoracyjne
// (aria-hidden na spanie); znaczenie niesie etykieta tekstowa. Kolor bierze
// akcent grupy (nagłówek) albo kolor tekstu (opcja) — zob. DiscoveryExperience.css.
const groupIcons: Record<string, ReactNode> = {
  mealTime: (
    <Icon>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
    </Icon>
  ),
  tempo: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </Icon>
  ),
  occasion: (
    <Icon>
      <path d="M4 20 8.5 9l6.5 6.5L4 20z" />
      <path d="M13 8s1.5-2 3.5-1.5" />
      <path d="M17 4v2M20.5 7.5 19 9M21 12h-2" />
    </Icon>
  ),
};

const optionIcons: Record<string, ReactNode> = {
  breakfast: (
    <Icon>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
    </Icon>
  ),
  lunch: (
    <Icon>
      <path d="M3 11h18a9 9 0 0 1-18 0z" />
      <path d="M12 3c-1 1-1 2 0 3" />
    </Icon>
  ),
  dinner: (
    <Icon>
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" />
    </Icon>
  ),
  now: (
    <Icon>
      <path d="M13 2 5 13h6l-1 9 8-11h-6l1-8z" />
    </Icon>
  ),
  today: (
    <Icon>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </Icon>
  ),
  two_days: (
    <Icon>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M4 15V6a2 2 0 0 1 2-2h9" />
    </Icon>
  ),
  kids: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15a4 4 0 0 0 6 0" />
      <path d="M9.5 10h.01M14.5 10h.01" />
    </Icon>
  ),
  guests: (
    <Icon>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5M17 13.5a5.5 5.5 0 0 1 4 5.5" />
    </Icon>
  ),
  grill: (
    <Icon>
      <path d="M5 9h14a7 7 0 0 1-14 0z" />
      <path d="M8.5 15.5 7 20M15.5 15.5 17 20" />
      <path d="M10 3s.8 1.4-.5 2.6M14 3s.8 1.4-.5 2.6" />
    </Icon>
  ),
};

export function DiscoveryExperience({ recipes }: Props) {
  const [selection, setSelection] = useState<CategorySelection>({});
  const hasSelection = hasCategorySelection(selection);
  const results = useMemo(
    () => filterRecipesByCategories(recipes, selection).slice(0, 4),
    [recipes, selection],
  );

  function toggle(key: keyof CategorySelection, value: MealTime | Tempo | Occasion) {
    setSelection((current) => ({
      ...current,
      [key]: current[key] === value ? undefined : value,
    }));
  }

  const selectedLabels = Object.values(selection)
    .filter((value): value is MealTime | Tempo | Occasion => Boolean(value))
    .map((value) => optionLabels[value]);

  return (
    <section id="kategorie" className="screen category-section" aria-labelledby="categories-heading">
        <div className="section-heading">
          <p className="eyebrow">Kategorie</p>
          <h2 id="categories-heading">Wybierz tryb</h2>
          <p>Wybierz co najmniej jedną opcję: porę dnia, tempo lub okazję.</p>
        </div>

        <div className="category-panel">
          {categoryGroups.map((group) => (
            <fieldset key={group.key} className={`category-group category-group--${group.accent}`}>
              <legend>
                <span className="legend-icon" aria-hidden="true">{groupIcons[group.key]}</span>
                {group.label}
              </legend>
              <div className="option-grid">
                {group.options.map(([value, label]) => {
                  const selected = selection[group.key] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      className={selected ? 'category-option is-selected' : 'category-option'}
                      aria-pressed={selected}
                      onClick={() => toggle(group.key, value)}
                    >
                      <span className="option-icon" aria-hidden="true">{optionIcons[value]}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {hasSelection && (
            <p className="selection-summary">
              <span aria-hidden="true">✓</span> Wybrano: <strong>{selectedLabels.join(' · ')}</strong>
            </p>
          )}
        </div>

        <div aria-live="polite" aria-atomic="true">
          {hasSelection && results.length > 0 && (
            <section className="results" aria-labelledby="results-heading">
              <h3 id="results-heading">Propozycje dla Ciebie</h3>
              <p className="prototype-note">Dane poniżej są zastępcze i służą wyłącznie do testowania przepływu.</p>
              <ul className="recipe-list">
                {results.map((recipe) => (
                  <li key={recipe.id}>
                    <a className="recipe-card" href={`/recipes/${recipe.slug}`}>
                      <span className="recipe-placeholder" aria-hidden="true">O</span>
                      <span className="recipe-content">
                        <strong>{recipe.title}</strong>
                        <span className="recipe-meta">{recipe.preparationMinutes} min</span>
                        <span className="tag-list" aria-label="Tagi">
                          {recipe.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasSelection && results.length === 0 && (
            <p className="empty-state">Brak dopasowań. Zmień lub usuń wybrane kryterium.</p>
          )}
        </div>
      </section>
  );
}
