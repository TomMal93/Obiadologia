import { z } from 'zod';

/**
 * Składnik przepisu z grammaturą. Miara bazowa jest zawsze metryczna:
 * `g` (masa), `ml` (objętość) albo `szt` (liczba sztuk). Formę domową
 * (szklanki/łyżki/łyżeczki/szczypta) wyliczamy z miary metrycznej, a nie
 * przechowujemy osobno — dzięki temu obie prezentacje pochodzą z jednej
 * wartości i nie mogą się rozjechać.
 */
export const ingredientUnits = ['g', 'ml', 'szt'] as const;
export type IngredientUnit = (typeof ingredientUnits)[number];

export const ingredientSchema = z
  .object({
    name: z.string().trim().min(1),
    amount: z.number().positive(),
    unit: z.enum(ingredientUnits),
    // Gęstość składnika sypkiego wyrażona jako gramy na jedną szklankę (250 ml).
    // Pozwala przeliczyć masę na miarę domową; bez niej masa pozostaje w gramach,
    // bo dla wielu produktów (mięso, warzywa) „szklanka” nie ma sensu.
    gramsPerCup: z.number().positive().optional(),
  })
  .strict();

export type Ingredient = z.infer<typeof ingredientSchema>;

const CUP_ML = 250;

interface UnitForms {
  /** 1 (mianownik l. poj.): „1 szklanka” */
  one: string;
  /** 2–4 (mianownik l. mn.): „2 szklanki” */
  few: string;
  /** 5+ oraz 12–14 (dopełniacz l. mn.): „5 szklanek” */
  many: string;
  /** wartości ułamkowe (dopełniacz l. poj.): „½ szklanki”, „1½ szklanki” */
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

const PINCH = 'szczypta';

/**
 * Progi doboru miary domowej (w ml) i krok zaokrąglenia. Sprawdzane od
 * największej miary: pierwsza, dla której objętość osiąga próg, wygrywa.
 */
const householdScale = [
  { millilitres: CUP_ML, threshold: 60, step: 0.25, forms: cupForms },
  { millilitres: 15, threshold: 15, step: 0.5, forms: tablespoonForms },
  { millilitres: 5, threshold: 2.5, step: 0.5, forms: teaspoonForms },
] as const;

/** Polska liczba mnoga dla całkowitych ilości. */
function pluralForm(count: number, forms: UnitForms): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return forms.one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms.few;
  return forms.many;
}

const fractionGlyphs: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };

/** Formatuje liczbę na tekst: całkowite bez zmian, dziesiętne z przecinkiem. */
function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');
}

function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/** „¼”, „½”, „¾”, „1½” dla wartości zaokrąglonych do ćwiartek/połówek. */
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

/** Przelicza objętość w ml na najbliższą sensowną miarę domową. */
export function millilitresToHousehold(millilitres: number): string {
  if (millilitres < householdScale[householdScale.length - 1].threshold) {
    return PINCH;
  }
  for (const level of householdScale) {
    if (millilitres >= level.threshold) {
      const quantity = Math.max(roundToStep(millilitres / level.millilitres, level.step), level.step);
      return formatQuantity(quantity, level.forms);
    }
  }
  return PINCH;
}

/** Miara metryczna: „400 g”, „250 ml”, „2 sztuki”. */
export function formatMetricMeasure(ingredient: Ingredient): string {
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
 * Miara domowa: objętość i przeliczalna masa (z `gramsPerCup`) trafiają na
 * szklanki/łyżki/łyżeczki/szczyptę, liczba sztuk pozostaje sztukami, a masa
 * bez gęstości zostaje w gramach.
 */
export function formatHouseholdMeasure(ingredient: Ingredient): string {
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
