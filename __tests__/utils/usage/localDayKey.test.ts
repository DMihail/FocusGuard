import { getLocalDayKey, getMsUntilNextLocalMidnight } from '@/utils/usage/localDayKey';

describe('localDayKey', () => {
  it('builds a stable key from the local calendar date', () => {
    expect(getLocalDayKey(new Date(2026, 5, 22, 15, 30))).toBe('2026-6-22');
  });

  it('computes milliseconds until the next local midnight', () => {
    const noon = new Date(2026, 5, 22, 12, 0, 0, 0);

    expect(getMsUntilNextLocalMidnight(noon)).toBe(12 * 60 * 60 * 1000);
  });
});
