/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { mockSelectedApps } from '@/testing/fixtures/dashboard';

const mockUseCoreStoresHydrated = jest.fn(() => true);
const mockUseRefreshWhenVisible = jest.fn();
const mockUseLocalDayChangeRefresh = jest.fn();
const mockRefreshUsage = jest.fn(() => Promise.resolve());
const mockSeedUsageFromCache = jest.fn();

jest.mock('@/hooks/useCoreStoresHydrated', () => ({
  useCoreStoresHydrated: () => mockUseCoreStoresHydrated(),
}));

jest.mock('@/hooks/useRefreshWhenVisible', () => ({
  useRefreshWhenVisible: (refresh: () => void) => mockUseRefreshWhenVisible(refresh),
}));

jest.mock('@/hooks/useLocalDayChangeRefresh', () => ({
  useLocalDayChangeRefresh: (refresh: () => void) => mockUseLocalDayChangeRefresh(refresh),
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true,
}));

jest.mock('@/store', () => {
  const actual = jest.requireActual('@/store');

  return {
    ...actual,
    selectedAppsStore: Object.assign(
      (selector: (state: { apps: typeof mockSelectedApps }) => unknown) => selector({ apps: mockSelectedApps }),
      { getState: () => ({ apps: mockSelectedApps }) },
    ),
    appLimitsStore: (selector: (state: { limitsByAppKey: Record<string, never> }) => unknown) =>
      selector({ limitsByAppKey: {} }),
  };
});

jest.mock('@/store/trackedUsageStore', () => {
  const actual = jest.requireActual('@/store/trackedUsageStore');

  return {
    ...actual,
    trackedUsageStore: Object.assign(
      (selector: (state: { usageByPackage: Record<string, number>; isRefreshingUsage: boolean }) => unknown) =>
        selector({ usageByPackage: {}, isRefreshingUsage: false }),
      {
        getState: () => ({
          refreshUsage: mockRefreshUsage,
          seedUsageFromCache: mockSeedUsageFromCache,
        }),
      },
    ),
  };
});

import { SelectedDashboardAppRowsProvider } from '@/context/SelectedDashboardAppRowsProvider';
import { resetTrackedAppRowsLifecycleForTests, useTrackedAppRows } from '@/hooks/useTrackedAppRows';

type HarnessProps = {
  onReady: (value: ReturnType<typeof useTrackedAppRows>) => void;
};

const UseTrackedAppRowsHarness = ({ onReady }: HarnessProps) => {
  const value = useTrackedAppRows();
  const onReadyRef = useRef(onReady);

  onReadyRef.current = onReady;

  useEffect(() => {
    onReadyRef.current(value);
  }, [value]);

  return null;
};

const renderTrackedAppRowsHarness = (onReady: (value: ReturnType<typeof useTrackedAppRows>) => void) =>
  ReactTestRenderer.create(
    <SelectedDashboardAppRowsProvider>
      <UseTrackedAppRowsHarness onReady={onReady} />
    </SelectedDashboardAppRowsProvider>,
  );

describe('useTrackedAppRows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTrackedAppRowsLifecycleForTests();
    mockUseCoreStoresHydrated.mockReturnValue(true);
  });

  const flushEffects = async () => {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  it('seeds cache and soft-refreshes usage after core stores hydrate', async () => {
    act(() => {
      renderTrackedAppRowsHarness(() => undefined);
    });

    await flushEffects();

    expect(mockSeedUsageFromCache).toHaveBeenCalledTimes(1);
    expect(mockRefreshUsage).toHaveBeenCalledWith(
      mockSelectedApps.map((app) => app.packageName),
      false,
    );
  });

  it('skips usage refresh while core stores are not hydrated', async () => {
    mockUseCoreStoresHydrated.mockReturnValue(false);

    act(() => {
      renderTrackedAppRowsHarness(() => undefined);
    });

    await flushEffects();

    expect(mockSeedUsageFromCache).not.toHaveBeenCalled();
    expect(mockRefreshUsage).not.toHaveBeenCalled();
  });

  it('wires focus refresh as soft and day rollover as forced', async () => {
    act(() => {
      renderTrackedAppRowsHarness(() => undefined);
    });

    await flushEffects();

    const focusRefresh = mockUseRefreshWhenVisible.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;
    const dayChangeRefresh = mockUseLocalDayChangeRefresh.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;

    expect(focusRefresh).toBeDefined();
    expect(dayChangeRefresh).toBeDefined();

    mockRefreshUsage.mockClear();

    await act(async () => {
      await focusRefresh?.();
      await dayChangeRefresh?.();
    });

    expect(mockRefreshUsage).toHaveBeenNthCalledWith(
      1,
      mockSelectedApps.map((app) => app.packageName),
      false,
    );
    expect(mockRefreshUsage).toHaveBeenNthCalledWith(
      2,
      mockSelectedApps.map((app) => app.packageName),
      true,
    );
  });

  it('skips lifecycle refresh when lifecycle is disabled', async () => {
    const LifecycleDisabledHarness = () => {
      useTrackedAppRows({ lifecycle: false });
      return null;
    };

    act(() => {
      ReactTestRenderer.create(
        <SelectedDashboardAppRowsProvider>
          <LifecycleDisabledHarness />
        </SelectedDashboardAppRowsProvider>,
      );
    });

    await flushEffects();

    expect(mockSeedUsageFromCache).not.toHaveBeenCalled();
    expect(mockRefreshUsage).not.toHaveBeenCalled();
  });
});
