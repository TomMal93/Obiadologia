import { describe, expect, it } from 'vitest';
import {
  formatClock,
  formatLeadTime,
  parseClock,
  scheduleAdvanceSteps,
} from './recipe-schedule';

describe('formatLeadTime', () => {
  it('formats sub-hour, whole-hour and mixed durations', () => {
    expect(formatLeadTime(30)).toBe('30 min');
    expect(formatLeadTime(120)).toBe('2 godz');
    expect(formatLeadTime(90)).toBe('1 godz 30 min');
    expect(formatLeadTime(720)).toBe('12 godz');
  });
});

describe('formatClock', () => {
  it('pads to HH:MM and wraps around the day', () => {
    expect(formatClock(6 * 60)).toBe('06:00');
    expect(formatClock(18 * 60 + 5)).toBe('18:05');
    expect(formatClock(-60)).toBe('23:00');
    expect(formatClock(25 * 60)).toBe('01:00');
  });
});

describe('parseClock', () => {
  it('parses a valid time input into minutes from midnight', () => {
    expect(parseClock('18:00')).toBe(1080);
    expect(parseClock('06:30')).toBe(390);
  });

  it('rejects empty or out-of-range values', () => {
    expect(parseClock('')).toBeNull();
    expect(parseClock('24:00')).toBeNull();
    expect(parseClock('12:60')).toBeNull();
    expect(parseClock('brak')).toBeNull();
  });
});

describe('scheduleAdvanceSteps', () => {
  it('computes the start time for each step from the serving time', () => {
    const schedule = scheduleAdvanceSteps(
      [{ text: 'Zamarynuj', leadTimeMinutes: 120 }],
      18 * 60,
    );

    expect(schedule).toEqual([
      { text: 'Zamarynuj', leadTimeMinutes: 120, startMinutes: 16 * 60, dayOffset: 0 },
    ]);
  });

  it('wraps an overnight lead onto the previous day', () => {
    const [soak] = scheduleAdvanceSteps(
      [{ text: 'Namocz fasolę', leadTimeMinutes: 720 }],
      6 * 60,
    );

    expect(formatClock(soak.startMinutes)).toBe('18:00');
    expect(soak.dayOffset).toBe(-1);
  });
});
