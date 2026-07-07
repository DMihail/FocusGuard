/** @format */

import React, { useEffect, useRef } from 'react';

import ReactTestRenderer, { act } from 'react-test-renderer';

import { mockSelectedApps } from '@/testing/fixtures/dashboard';

const mockUseCoreStoresHydrated = jest.fn(() => true);
const mockUseScreenRefresh = jest.fn();
const mockRefreshUsage = jest.fn(() => Promise.resolve());
const mockSeedUsageFromCache = jest.fn();

jest.mock('@/context/CoreStoresHydrationProvider', () => ({
  useCoreStoresHydrated: () => mockUseCoreStoresHydrated(),
}));

jest.mock('@/hooks/useScreenRefresh', () => ({
  useScreenRefresh: (...args: unknown[]) => mockUseScreenRefresh(...args),
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
import { useTrackedAppRows } from '@/hooks/useTrackedAppRows';

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
    mockUseCoreStoresHydrated.mockReturnValue(true);
  });

  const flushEffects = async () => {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  it('seeds cache after core stores hydrate without a duplicate mount refresh', async () => {
    act(() => {
      renderTrackedAppRowsHarness(() => undefined);
    });

    await flushEffects();

    expect(mockSeedUsageFromCache).toHaveBeenCalledTimes(1);
    expect(mockRefreshUsage).not.toHaveBeenCalled();
  });

  it('seeds cache independently for each hook instance', async () => {
    const DualHarness = () => {
      useTrackedAppRows();
      useTrackedAppRows();
      return null;
    };

    act(() => {
      ReactTestRenderer.create(
        <SelectedDashboardAppRowsProvider>
          <DualHarness />
        </SelectedDashboardAppRowsProvider>,
      );
    });

    await flushEffects();

    expect(mockSeedUsageFromCache).toHaveBeenCalledTimes(2);
    expect(mockRefreshUsage).not.toHaveBeenCalled();
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

  it('wires soft and hard refresh through useScreenRefresh', async () => {
    act(() => {
      renderTrackedAppRowsHarness(() => undefined);
    });

    await flushEffects();

    expect(mockUseScreenRefresh).toHaveBeenCalledTimes(1);

    const refreshSoft = mockUseScreenRefresh.mock.calls[0]?.[0] as (() => Promise<void>) | undefined;
    const refreshHard = mockUseScreenRefresh.mock.calls[0]?.[1] as (() => Promise<void>) | undefined;

    expect(refreshSoft).toBeDefined();
    expect(refreshHard).toBeDefined();

    mockRefreshUsage.mockClear();

    await act(async () => {
      await refreshSoft?.();
      await refreshHard?.();
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
