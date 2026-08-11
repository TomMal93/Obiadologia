import { describe, expect, it } from 'vitest';
import { formatLeadTime } from './recipe-schedule';

describe('formatLeadTime', () => {
  it('formats sub-hour, whole-hour and mixed durations', () => {
    expect(formatLeadTime(30)).toBe('30 min');
    expect(formatLeadTime(120)).toBe('2 godz');
    expect(formatLeadTime(90)).toBe('1 godz 30 min');
    expect(formatLeadTime(720)).toBe('12 godz');
  });
});
