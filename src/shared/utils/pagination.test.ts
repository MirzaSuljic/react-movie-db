import { describe, expect, it } from 'vitest';

import { pageSlots, toPage } from './pagination';

describe('pageSlots', () => {
  it('shows every page when there are only a few', () => {
    expect(pageSlots(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('keeps seven slots with gaps around the current page', () => {
    expect(pageSlots(2, 14)).toEqual([1, 2, 3, 4, 5, 'gap', 14]);
    expect(pageSlots(7, 14)).toEqual([1, 'gap', 6, 7, 8, 'gap', 14]);
    expect(pageSlots(13, 14)).toEqual([1, 'gap', 10, 11, 12, 13, 14]);
    for (let page = 1; page <= 14; page++) {
      expect(pageSlots(page, 14).length).toBe(7);
    }
  });
});

describe('toPage', () => {
  it('falls back to page 1', () => {
    expect(toPage(null)).toBe(1);
    expect(toPage('abc')).toBe(1);
    expect(toPage('0')).toBe(1);
    expect(toPage('3')).toBe(3);
  });
});
