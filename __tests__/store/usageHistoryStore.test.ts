/** @format */

import { resetUsageHistoryForTests, usageHistoryStore } from '@/store/usageHistoryStore';

describe('usageHistoryStore', () => {
  beforeEach(() => {
    resetUsageHistoryForTests();
  });

  it('skips persist when the daily entry is unchanged', () => {
    const entry = {
      totalUsedMs: 1_000,
      totalSavedMs: 2_000,
      focusScore: 80,
      usageByAppKey: { 'com.example.app': 1_000 },
    };

    usageHistoryStore.getState().recordDay('2026-6-22', entry);
    usageHistoryStore.getState().recordDay('2026-6-22', { ...entry });

    expect(Object.keys(usageHistoryStore.getState().byDay)).toHaveLength(1);
  });

  it('removes a day entry when cleared', () => {
    const entry = {
      totalUsedMs: 1_000,
      totalSavedMs: 2_000,
      focusScore: 80,
      usageByAppKey: { 'com.example.app': 1_000 },
    };

    usageHistoryStore.getState().recordDay('2026-6-22', entry);
    usageHistoryStore.getState().clearDay('2026-6-22');

    expect(usageHistoryStore.getState().byDay['2026-6-22']).toBeUndefined();
  });

  it('keeps the newest days when pruning history', () => {
    for (let day = 1; day <= 125; day += 1) {
      usageHistoryStore.getState().recordDay(`2026-1-${day}`, {
        totalUsedMs: day,
        totalSavedMs: 0,
        focusScore: 50,
        usageByAppKey: {},
      });
    }

    const dayKeys = Object.keys(usageHistoryStore.getState().byDay);

    expect(dayKeys).toHaveLength(120);
    expect(dayKeys).not.toContain('2026-1-1');
    expect(dayKeys).toContain('2026-1-125');
  });
});
