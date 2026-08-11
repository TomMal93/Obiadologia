/**
 * Czysty, bezpieczny dla klienta model ilości składnika i formatowanie miar.
 * Ten moduł nie importuje `zod`, dzięki czemu może obsługiwać dynamiczne
 * przeliczanie porcji bez powiększania paczki klienta o walidator buildowy.
 */
export const ingredientUnits = ['g', 'ml', 'szt'] as const;
export type IngredientUnit = (typeof ingredientUnits)[number];

export const householdUnits = [
  'cup',
  'tablespoon',
  'teaspoon',
  'pinch',
  'piece',
  'slice',
  'bread_slice',
  'handful',
] as const;
export type HouseholdUnit = (typeof householdUnits)[number];

export interface HouseholdMeasureConversion {
  unit: HouseholdUnit;
  /** Ilość bazowej jednostki metrycznej odpowiadająca jednej mierze domowej. */
  metricAmount: number;
}

/**
 * Redakcyjny wybór formy miary pojedynczego składnika. Strona przepisu nie ma
 * przełącznika jednostek — lista jest mieszana, a `both` łączy obie formy
 * ukośnikiem.
 */
export const measureDisplays = ['metric', 'household', 'both'] as const;
export type MeasureDisplay = (typeof measureDisplays)[number];

export const defaultMeasureDisplay: MeasureDisplay = 'metric';

export interface IngredientMeasure {
  name: string;
  amount: number;
  unit: IngredientUnit;
  gramsPerCup?: number;
  household?: HouseholdMeasureConversion;
  measure?: MeasureDisplay;
}

const CUP_ML = 250;

interface UnitForms {
  one: string;
  few: string;
  many: string;
  fraction: string;
}

const cupForms: UnitForms = {
  one: 'szklanka',
  few: 'szklanki',
  many: 'szklanek',
  fraction: 'szklanki',
};
const tablespoonForms: UnitForms = {
  one: 'łyżka',
  few: 'łyżki',
  many: 'łyżek',
  fraction: 'łyżki',
};
const teaspoonForms: UnitForms = {
  one: 'łyżeczka',
  few: 'łyżeczki',
  many: 'łyżeczek',
  fraction: 'łyżeczki',
};
const pieceForms: UnitForms = {
  one: 'sztuka',
  few: 'sztuki',
  many: 'sztuk',
  fraction: 'sztuki',
};
const sliceForms: UnitForms = {
  one: 'plaster',
  few: 'plastry',
  many: 'plastrów',
  fraction: 'plastra',
};
const breadSliceForms: UnitForms = {
  one: 'kromka',
  few: 'kromki',
  many: 'kromek',
  fraction: 'kromki',
};
const handfulForms: UnitForms = {
  one: 'garść',
  few: 'garści',
  many: 'garści',
  fraction: 'garści',
};
const pinchForms: UnitForms = {
  one: 'szczypta',
  few: 'szczypty',
  many: 'szczypt',
  fraction: 'szczypty',
};

const householdUnitForms: Record<HouseholdUnit, UnitForms> = {
  cup: cupForms,
  tablespoon: tablespoonForms,
  teaspoon: teaspoonForms,
  pinch: pinchForms,
  piece: pieceForms,
  slice: sliceForms,
  bread_slice: breadSliceForms,
  handful: handfulForms,
};

const PINCH = 'szczypta';

const householdScale = [
  { millilitres: CUP_ML, threshold: 60, step: 0.25, forms: cupForms },
  { millilitres: 15, threshold: 15, step: 0.5, forms: tablespoonForms },
  { millilitres: 5, threshold: 2.5, step: 0.5, forms: teaspoonForms },
] as const;

function pluralForm(count: number, forms: UnitForms): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return forms.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few;
  return forms.many;
}

const fractionGlyphs: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(2))).replace('.', ',');
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function formatFraction(value: number): string {
  const whole = Math.floor(value);
  const fraction = Number((value - whole).toFixed(2));
  const glyph = fractionGlyphs[fraction];
  if (!glyph) return formatNumber(value);
  return whole === 0 ? glyph : `${whole}${glyph}`;
}

function formatQuantity(quantity: number, forms: UnitForms): string {
  if (Number.isInteger(quantity)) {
    return `${quantity} ${pluralForm(quantity, forms)}`;
  }
  return `${formatFraction(quantity)} ${forms.fraction}`;
}

export function millilitresToHousehold(millilitres: number): string {
  if (millilitres < householdScale[householdScale.length - 1].threshold) {
    return PINCH;
  }
  for (const level of householdScale) {
    if (millilitres >= level.threshold) {
      const quantity = Math.max(
        roundToStep(millilitres / level.millilitres, level.step),
        level.step,
      );
      return formatQuantity(quantity, level.forms);
    }
  }
  return PINCH;
}

export function formatMetricMeasure(ingredient: IngredientMeasure): string {
  switch (ingredient.unit) {
    case 'g':
      return `${formatNumber(ingredient.amount)} g`;
    case 'ml':
      return `${formatNumber(ingredient.amount)} ml`;
    case 'szt':
      return formatQuantity(ingredient.amount, pieceForms);
  }
}

/**
 * Czy dla składnika da się wyliczyć formę domową różną od metrycznej. `szt`
 * jest już miarą naturalną, a masa bez przelicznika zostaje w gramach.
 */
export function hasHouseholdMeasure(ingredient: IngredientMeasure): boolean {
  if (ingredient.household) return true;
  switch (ingredient.unit) {
    case 'ml':
      return true;
    case 'g':
      return ingredient.gramsPerCup !== undefined;
    case 'szt':
      return false;
  }
}

export function formatHouseholdMeasure(ingredient: IngredientMeasure): string {
  if (ingredient.household) {
    return formatQuantity(
      ingredient.amount / ingredient.household.metricAmount,
      householdUnitForms[ingredient.household.unit],
    );
  }

  switch (ingredient.unit) {
    case 'szt':
      return formatQuantity(ingredient.amount, pieceForms);
    case 'ml':
      return millilitresToHousehold(ingredient.amount);
    case 'g':
      return ingredient.gramsPerCup
        ? millilitresToHousehold((ingredient.amount / ingredient.gramsPerCup) * CUP_ML)
        : formatMetricMeasure(ingredient);
  }
}

/**
 * Jedyna miara pokazywana przy składniku na stronie przepisu. Wybór formy jest
 * redakcyjny (`measure`), a `both` łączy formę metryczną z domową ukośnikiem.
 * Gdy obie formy są identyczne, ukośnik się nie pojawia.
 */
export function formatMeasure(ingredient: IngredientMeasure): string {
  const display = ingredient.measure ?? defaultMeasureDisplay;
  const metric = formatMetricMeasure(ingredient);
  if (display === 'metric') return metric;

  const household = formatHouseholdMeasure(ingredient);
  if (display === 'household') return household;
  return household === metric ? metric : `${metric} / ${household}`;
}
