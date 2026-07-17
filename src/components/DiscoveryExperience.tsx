import { useMemo, useState } from 'react';
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
    options: [
      ['breakfast', 'Śniadanie'],
      ['lunch', 'Obiad'],
      ['dinner', 'Kolacja'],
    ] as const satisfies ReadonlyArray<readonly [MealTime, string]>,
  },
  {
    key: 'tempo',
    label: 'Tempo',
    options: [
      ['now', 'Na już'],
      ['today', 'Na dziś'],
      ['two_days', 'Na dwa dni'],
    ] as const satisfies ReadonlyArray<readonly [Tempo, string]>,
  },
  {
    key: 'occasion',
    label: 'Okazja',
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
            <fieldset key={group.key}>
              <legend>{group.label}</legend>
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
                      <span aria-hidden="true">{selected ? '✓' : '○'}</span>
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
