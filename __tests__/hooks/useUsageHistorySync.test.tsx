/** @format */

import React from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { useUsageHistorySync } from '@/hooks/useUsageHistorySync';
import { resetUsageHistoryForTests, usageHistoryStore } from '@/store/usageHistoryStore';
import { mockDashboardAppRows } from '@/testing/fixtures/dashboard';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

const UsageHistorySyncHarness = ({ appRows }: { appRows: typeof mockDashboardAppRows }) => {
  useUsageHistorySync(appRows);
  return null;
};

describe('useUsageHistorySync', () => {
  beforeEach(() => {
    resetUsageHistoryForTests();
  });

  it('clears today snapshot when no apps are selected', () => {
    const todayKey = getLocalDayKey();

    usageHistoryStore.getState().recordDay(todayKey, {
      totalUsedMs: 30 * 60_000,
      totalSavedMs: 30 * 60_000,
      focusScore: 50,
      usageByAppKey: { 'com.social.chat': 30 * 60_000 },
    });

    act(() => {
      ReactTestRenderer.create(<UsageHistorySyncHarness appRows={[]} />);
    });

    expect(usageHistoryStore.getState().byDay[todayKey]).toBeUndefined();
  });

  it('records today snapshot when apps are selected', () => {
    const todayKey = getLocalDayKey();

    act(() => {
      ReactTestRenderer.create(<UsageHistorySyncHarness appRows={mockDashboardAppRows} />);
    });

    expect(usageHistoryStore.getState().byDay[todayKey]).toMatchObject({
      totalUsedMs: expect.any(Number),
      focusScore: expect.any(Number),
    });
  });

  it('clears today snapshot when selected apps are removed', () => {
    const todayKey = getLocalDayKey();
    let tree!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      tree = ReactTestRenderer.create(<UsageHistorySyncHarness appRows={mockDashboardAppRows} />);
    });

    expect(usageHistoryStore.getState().byDay[todayKey]).toBeDefined();

    act(() => {
      tree.update(<UsageHistorySyncHarness appRows={[]} />);
    });

    expect(usageHistoryStore.getState().byDay[todayKey]).toBeUndefined();
  });
});
