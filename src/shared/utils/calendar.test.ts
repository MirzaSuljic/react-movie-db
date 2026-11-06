import { describe, expect, it } from 'vitest';

import { dayLabel, monthGrid, monthRange, shiftMonth, toMonth } from './calendar';

describe('calendar helpers', () => {
  it('fills whole Monday-to-Sunday weeks around the month', () => {
    const days = monthGrid('2026-11', '2026-11-05');
    expect(days.length).toBe(42);
    expect(days[0]).toEqual({ date: '2026-10-26', day: 26, inMonth: false, isToday: false });
    expect(days.at(-1)?.date).toBe('2026-12-06');
    expect(days.filter(d => d.inMonth).length).toBe(30);
    expect(days.filter(d => d.isToday).map(d => d.date)).toEqual(['2026-11-05']);
  });

  it('moves between months across years', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
  });

  it('knows the last day of the month, leap years included', () => {
    expect(monthRange('2028-02')).toEqual(['2028-02-01', '2028-02-29']);
    expect(monthRange('2026-11')).toEqual(['2026-11-01', '2026-11-30']);
  });

  it('accepts only valid ?month= values', () => {
    expect(toMonth('2027-03')).toBe('2027-03');
    expect(toMonth('2026-13')).not.toBe('2026-13');
    expect(toMonth('abc')).toMatch(/^\d{4}-\d{2}$/);
  });

  it('labels days in full', () => {
    expect(dayLabel('2026-11-14')).toBe('Saturday 14 November');
  });
});
