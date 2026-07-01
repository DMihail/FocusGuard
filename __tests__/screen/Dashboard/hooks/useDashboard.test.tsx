/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { mockSelectedApps, mockUsageByPackage } from '@/testing/fixtures/dashboard';
import { mockManageApps } from '@/testing/fixtures/manageApps';

const mockGetPackagesUsageToday = jest.fn(async (packageNames: readonly string[]) =>
  packageNames.map((packageName) => ({
    packageName,
    usageMs: mockUsageByPackage[packageName as keyof typeof mockUsageByPackage] ?? 0,
  })),
);

const mockSyncSelectedAppsMetadata = jest.fn();

const mockStoreState = {
  apps: [...mockSelectedApps],
  limitsByAppKey: {} as Record<string, unknown>,
  isMonitoring: false,
  toggle: jest.fn(),
  syncSelectedAppsMetadata: mockSyncSelectedAppsMetadata,
};

jest.mock('@/specs', () => ({
  getPackagesUsageToday: (packageNames: readonly string[]) => mockGetPackagesUsageToday(packageNames),
  invalidateNativeCatalogCaches: jest.fn(),
  subscribeLocalDayChanged: jest.fn(() => ({ remove: jest.fn() })),
  subscribeMonitorServiceStateChanged: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('@/domain/installedAppsCatalog', () => {
  const actual = jest.requireActual('@/domain/installedAppsCatalog');

  return {
    ...actual,
    loadInstalledApps: jest.fn(() => Promise.resolve([])),
  };
});

jest.mock('@/store', () => {
  const actual = jest.requireActual('@/store');

  return {
    ...actual,
    selectedAppsStore: Object.assign(
      (selector: (state: typeof mockStoreState) => unknown) =>
        selector({ ...mockStoreState, apps: mockStoreState.apps }),
      { getState: () => mockStoreState },
    ),
    appLimitsStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
    monitoringStore: Object.assign(
      (selector: (state: { isMonitoring: boolean; toggle: jest.Mock }) => unknown) =>
        selector({ isMonitoring: mockStoreState.isMonitoring, toggle: mockStoreState.toggle }),
      {
        getState: () => ({
          isMonitoring: mockStoreState.isMonitoring,
          toggle: mockStoreState.toggle,
        }),
      },
    ),
  };
});

jest.mock('@/navigation/hooks/useNavigateToConfigureLimits', () => ({
  useNavigateToConfigureLimits: () => jest.fn(),
}));

jest.mock('@react-navigation/native', () => {
  const { useEffect: mockUseEffect } = require('react');

  return {
    useFocusEffect: (callback: () => void) => {
      mockUseEffect(callback, [callback]);
    },
    useIsFocused: () => true,
  };
});

jest.mock('@/hooks/useAppStateOnActive', () => ({
  useAppStateOnActive: jest.fn(),
}));

jest.mock('@/hooks/usePrefetchNativeCatalogs', () => ({
  usePrefetchNativeCatalogs: jest.fn(),
}));

import { SelectedDashboardAppRowsProvider } from '@/context/SelectedDashboardAppRowsProvider';
import { invalidateUsageStatsCache } from '@/domain/usageStatsCatalog';
import { useDashboard } from '@/screen/Dashboard/hooks/useDashboard';
import { resetTrackedUsageSeedForTests, trackedUsageStore } from '@/store/trackedUsageStore';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useDashboard>) => void;
};

const UseDashboardHarness = ({ onReady }: HarnessProps) => {
  const value = useDashboard();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  }, [value]);

  return null;
};

const renderDashboardHarness = (onReady: (value: ReturnType<typeof useDashboard>) => void) =>
  ReactTestRenderer.create(
    <SelectedDashboardAppRowsProvider>
      <UseDashboardHarness onReady={onReady} />
    </SelectedDashboardAppRowsProvider>,
  );

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    invalidateUsageStatsCache();
    resetTrackedUsageSeedForTests();
    act(() => {
      trackedUsageStore.setState({ usageByPackage: {} });
    });
    mockStoreState.apps = [...mockSelectedApps];
    mockStoreState.isMonitoring = false;
    mockGetPackagesUsageToday.mockImplementation(async (packageNames: readonly string[]) =>
      packageNames.map((packageName) => ({
        packageName,
        usageMs: mockUsageByPackage[packageName as keyof typeof mockUsageByPackage] ?? 0,
      })),
    );
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
      renderDashboardHarness((value) => (result = value));
    });
    await flushUsageLoad();

    expect(mockGetPackagesUsageToday).toHaveBeenCalled();
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
      renderDashboardHarness((value) => (latest = value));
    });
    await flushUsageLoad();

    const callsBefore = mockGetPackagesUsageToday.mock.calls.length;

    await act(async () => {
      latest.refreshControl?.props.onRefresh();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockGetPackagesUsageToday.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(latest.refreshControl?.props.refreshing).toBe(false);
  });
});
