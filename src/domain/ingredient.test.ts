import { describe, expect, it } from 'vitest';
import {
  formatHouseholdMeasure,
  formatMetricMeasure,
  ingredientSchema,
  millilitresToHousehold,
  type Ingredient,
} from './ingredient';

const make = (ingredient: Partial<Ingredient> & Pick<Ingredient, 'unit' | 'amount'>): Ingredient =>
  ingredientSchema.parse({ category: 'pantry', name: 'test', ...ingredient });

describe('ingredient schema', () => {
  it('accepts a metric ingredient with an optional density', () => {
    expect(ingredientSchema.parse({
      category: 'grains',
      name: 'mąka',
      amount: 130,
      unit: 'g',
      gramsPerCup: 130,
    })).toEqual({
      category: 'grains',
      name: 'mąka',
      amount: 130,
      unit: 'g',
      gramsPerCup: 130,
    });
  });

  it('accepts a natural household conversion for a metric amount', () => {
    expect(ingredientSchema.parse({
      category: 'meat',
      name: 'chorizo',
      amount: 80,
      unit: 'g',
      household: { unit: 'slice', metricAmount: 8 },
    })).toMatchObject({
      household: { unit: 'slice', metricAmount: 8 },
    });
  });

  it('rejects a non-positive amount and an unknown unit', () => {
    expect(() =>
      ingredientSchema.parse({ category: 'spices', name: 'sól', amount: 0, unit: 'g' }),
    ).toThrow();
    expect(() =>
      ingredientSchema.parse({ category: 'spices', name: 'sól', amount: 5, unit: 'kg' }),
    ).toThrow();
    expect(() =>
      ingredientSchema.parse({ category: 'frozen', name: 'groszek', amount: 200, unit: 'g' }),
    ).toThrow();
    expect(() => ingredientSchema.parse({ name: 'sól', amount: 5, unit: 'g' })).toThrow();
    expect(() => ingredientSchema.parse({
      category: 'produce',
      name: 'cebula',
      amount: 2,
      unit: 'szt',
      household: { unit: 'piece', metricAmount: 1 },
    })).toThrow();
    expect(() => ingredientSchema.parse({
      category: 'meat',
      name: 'chorizo',
      amount: 80,
      unit: 'g',
      household: { unit: 'slice', metricAmount: 0 },
    })).toThrow();
  });
});

describe('metric measure', () => {
  it('formats mass, volume and count', () => {
    expect(formatMetricMeasure(make({ amount: 400, unit: 'g' }))).toBe('400 g');
    expect(formatMetricMeasure(make({ amount: 250, unit: 'ml' }))).toBe('250 ml');
    expect(formatMetricMeasure(make({ amount: 1, unit: 'szt' }))).toBe('1 sztuka');
    expect(formatMetricMeasure(make({ amount: 2, unit: 'szt' }))).toBe('2 sztuki');
    expect(formatMetricMeasure(make({ amount: 5, unit: 'szt' }))).toBe('5 sztuk');
  });
});

describe('household measure from volume', () => {
  it('scales millilitres to cups, spoons and a pinch', () => {
    expect(millilitresToHousehold(250)).toBe('1 szklanka');
    expect(millilitresToHousehold(500)).toBe('2 szklanki');
    expect(millilitresToHousehold(125)).toBe('½ szklanki');
    expect(millilitresToHousehold(60)).toBe('¼ szklanki');
    expect(millilitresToHousehold(45)).toBe('3 łyżki');
    expect(millilitresToHousehold(15)).toBe('1 łyżka');
    expect(millilitresToHousehold(10)).toBe('2 łyżeczki');
    expect(millilitresToHousehold(5)).toBe('1 łyżeczka');
    expect(millilitresToHousehold(1)).toBe('szczypta');
  });
});

describe('household measure per unit', () => {
  it('keeps a count as pieces', () => {
    expect(formatHouseholdMeasure(make({ amount: 2, unit: 'szt' }))).toBe('2 sztuki');
  });

  it('converts a volume to a household measure', () => {
    expect(formatHouseholdMeasure(make({ amount: 200, unit: 'ml' }))).toBe('¾ szklanki');
  });

  it('converts mass to cups when a density is known', () => {
    expect(formatHouseholdMeasure(make({ amount: 130, unit: 'g', gramsPerCup: 130 }))).toBe(
      '1 szklanka',
    );
  });

  it('converts metric amounts to natural household units', () => {
    expect(formatHouseholdMeasure(make({
      amount: 80,
      unit: 'g',
      household: { unit: 'slice', metricAmount: 8 },
    }))).toBe('10 plastrów');
    expect(formatHouseholdMeasure(make({
      amount: 150,
      unit: 'g',
      household: { unit: 'piece', metricAmount: 300 },
    }))).toBe('½ sztuki');
    expect(formatHouseholdMeasure(make({
      amount: 100,
      unit: 'g',
      household: { unit: 'handful', metricAmount: 25 },
    }))).toBe('4 garści');
    expect(formatHouseholdMeasure(make({
      amount: 120,
      unit: 'g',
      household: { unit: 'bread_slice', metricAmount: 30 },
    }))).toBe('4 kromki');
    expect(formatHouseholdMeasure(make({
      amount: 2,
      unit: 'g',
      household: { unit: 'pinch', metricAmount: 1 },
    }))).toBe('2 szczypty');
  });

  it('leaves mass in grams when no density is available', () => {
    expect(formatHouseholdMeasure(make({ amount: 400, unit: 'g' }))).toBe('400 g');
  });
});
