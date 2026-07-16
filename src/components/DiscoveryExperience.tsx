import { useMemo, useState } from 'react';
import type { CategorySelection, MealTime, Occasion, Recipe, Tempo } from '@/domain/recipe';
import { filterRecipesByCategories, hasCategorySelection } from '@/domain/recipe';

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

const labels: Record<MealTime | Tempo | Occasion, string> = {
  breakfast: 'Śniadanie',
  lunch: 'Obiad',
  dinner: 'Kolacja',
  now: 'Na już',
  today: 'Na dziś',
  two_days: 'Na dwa dni',
  kids: 'Dla dzieci',
  guests: 'Dla gości',
  grill: 'Na grilla',
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

  function scrollToCategories() {
    document.querySelector('#kategorie')?.scrollIntoView({ behavior: 'smooth' });
  }

  const selectedLabels = Object.values(selection)
    .filter((value): value is string => Boolean(value))
    .map((value) => labels[value as MealTime | Tempo | Occasion]);

  return (
    <>
      <section className="path-panel" aria-labelledby="paths-heading">
        <p className="eyebrow">Nie musisz wiedzieć, czego chcesz</p>
        <h2 id="paths-heading">Wybierz najbliższą myśl</h2>
        <div className="path-grid">
          <article className="path-card path-card--map">
            <p className="path-intent">Nie wiem, czego chcę</p>
            <p>nastrój · tempo · inspiracja</p>
            <span className="path-pending">Mapa — kolejny wycinek</span>
          </article>
          <article className="path-card path-card--search">
            <p className="path-intent">Wiem, czego szukam</p>
            <p>składnik · danie · smak</p>
            <span className="path-pending">Szukaj — kolejny wycinek</span>
          </article>
          <article className="path-card path-card--categories">
            <p className="path-intent">Chcę przeglądać</p>
            <p>kategoria · okazja · sytuacja</p>
            <button type="button" onClick={scrollToCategories}>Kategorie</button>
          </article>
        </div>
      </section>

      <section id="kategorie" className="category-section" aria-labelledby="categories-heading">
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
    </>
  );
}
