/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

const mockGetAppsUsageStats = jest.fn(() => [
  {
    packageName: 'com.test.app',
    appName: 'Test',
    appImage: '',
    category: 'Social',
    totalTimeForeground: 15 * 60_000,
    lastTimeUsed: 0,
  },
]);

const mockStoreState = {
  apps: [
    {
      packageName: 'com.test.app',
      appName: 'Test',
      appImage: '',
      category: 'Social',
      categoryLabel: 'Social',
    },
  ],
  limitsByPackage: {} as Record<string, unknown>,
  getLimits: jest.fn(() => ({ warningMinutes: 45, hardBlockMinutes: 60, strictMode: false })),
  isMonitoring: false,
  toggle: jest.fn(),
};

jest.mock('@/specs/NativeUsageStats', () => ({
  getAppsUsageStats: () => mockGetAppsUsageStats(),
}));

jest.mock('@/store', () => ({
  selectedAppsStore: (selector: (state: typeof mockStoreState) => unknown) =>
    selector({ ...mockStoreState, apps: mockStoreState.apps }),
  appLimitsStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
  monitoringStore: (selector: (state: { isMonitoring: boolean; toggle: jest.Mock }) => unknown) =>
    selector({ isMonitoring: mockStoreState.isMonitoring, toggle: mockStoreState.toggle }),
}));

jest.mock('@/navigation/hooks/useNavigateToConfigureLimits', () => ({
  useNavigateToConfigureLimits: () => jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const { useEffect: mockUseEffect } = require('react');

  return {
    useFocusEffect: (callback: () => void) => {
      mockUseEffect(callback, [callback]);
    },
  };
});

jest.mock('@/hooks/useAppStateOnActive', () => ({
  useAppStateOnActive: jest.fn(),
}));

import { useDashboard } from '@/screen/Dashboard/hooks/useDashboard';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useDashboard>) => void;
};

const UseDashboardHarness = ({ onReady }: HarnessProps) => {
  const value = useDashboard();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  });

  return null;
};

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreState.isMonitoring = false;
  });

  it('loads usage stats and builds app rows', () => {
    let result!: ReturnType<typeof useDashboard>;

    act(() => {
      ReactTestRenderer.create(<UseDashboardHarness onReady={(value) => (result = value)} />);
    });

    expect(mockGetAppsUsageStats).toHaveBeenCalled();
    expect(result.appRows).toHaveLength(1);
    expect(result.appRows[0]?.usedMs).toBe(15 * 60_000);
    expect(result.summary.focusScore).toBeGreaterThan(0);
  });

  it('refreshes usage on pull-to-refresh', () => {
    jest.useFakeTimers();
    let latest!: ReturnType<typeof useDashboard>;

    act(() => {
      ReactTestRenderer.create(<UseDashboardHarness onReady={(value) => (latest = value)} />);
    });

    const callsBefore = mockGetAppsUsageStats.mock.calls.length;

    act(() => {
      latest.onRefresh();
    });

    act(() => {
      jest.runAllTimers();
    });

    expect(mockGetAppsUsageStats.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(latest.refreshing).toBe(false);
    jest.useRealTimers();
  });
});
