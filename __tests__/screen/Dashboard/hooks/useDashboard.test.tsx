/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { mockAppUsageStats, mockSelectedApps, mockUsageByPackage } from '@/testing/fixtures/dashboard';
import { mockManageApps } from '@/testing/fixtures/manageApps';

const mockGetAppsUsageStats = jest.fn(() => mockAppUsageStats);

const mockSyncSelectedAppsMetadata = jest.fn();

const mockStoreState = {
  apps: [...mockSelectedApps],
  limitsByPackage: {} as Record<string, unknown>,
  getLimits: jest.fn(() => ({ warningMinutes: 45, hardBlockMinutes: 60, strictMode: false })),
  isMonitoring: false,
  toggle: jest.fn(),
  syncSelectedAppsMetadata: mockSyncSelectedAppsMetadata,
};

jest.mock('@/specs', () => ({
  getAppsUsageStats: () => mockGetAppsUsageStats(),
  getPackageUsageToday: jest.fn(() => 0),
}));

jest.mock('@/domain/installedAppsCatalog', () => {
  const actual = jest.requireActual('@/domain/installedAppsCatalog');

  return {
    ...actual,
    loadInstalledApps: jest.fn(() => Promise.resolve([])),
  };
});

jest.mock('@/store', () => ({
  selectedAppsStore: Object.assign(
    (selector: (state: typeof mockStoreState) => unknown) => selector({ ...mockStoreState, apps: mockStoreState.apps }),
    { getState: () => mockStoreState },
  ),
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

import { invalidateUsageStatsCache } from '@/domain/usageStatsCatalog';
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
    invalidateUsageStatsCache();
    mockStoreState.apps = [...mockSelectedApps];
    mockStoreState.isMonitoring = false;
    mockGetAppsUsageStats.mockReturnValue(mockAppUsageStats);
  });

  const flushUsageLoad = async () => {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  it('loads usage stats and builds app rows from selected ManageApps fixtures', async () => {
    let result!: ReturnType<typeof useDashboard>;

    act(() => {
      ReactTestRenderer.create(<UseDashboardHarness onReady={(value) => (result = value)} />);
    });
    await flushUsageLoad();

    expect(mockGetAppsUsageStats).toHaveBeenCalled();
    expect(result.appRows).toHaveLength(mockSelectedApps.length);

    const socialChat = result.appRows.find((row) => row.packageName === mockManageApps[0].packageName);
    const puzzleGame = result.appRows.find((row) => row.packageName === mockManageApps[1].packageName);

    expect(socialChat?.appName).toBe('Social Chat');
    expect(socialChat?.usedMs).toBe(mockUsageByPackage['com.social.chat']);
    expect(puzzleGame?.appName).toBe('Puzzle Game');
    expect(puzzleGame?.usedMs).toBe(mockUsageByPackage['com.game.puzzle']);
    expect(result.appRows[0]?.packageName).toBe('com.game.puzzle');
    expect(result.summary.focusScore).toBe(50);
  });

  it('refreshes usage on pull-to-refresh', async () => {
    let latest!: ReturnType<typeof useDashboard>;

    act(() => {
      ReactTestRenderer.create(<UseDashboardHarness onReady={(value) => (latest = value)} />);
    });
    await flushUsageLoad();

    const callsBefore = mockGetAppsUsageStats.mock.calls.length;

    await act(async () => {
      latest.onRefresh();
      await Promise.resolve();
    });

    expect(mockGetAppsUsageStats.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(latest.refreshing).toBe(false);
  });
});
