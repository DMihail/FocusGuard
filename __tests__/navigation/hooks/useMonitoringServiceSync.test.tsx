/** @format */

import { AppState } from 'react-native';

import ReactTestRenderer from 'react-test-renderer';

const mockRestoreMonitoringSession = jest.fn();
const mockGetMonitoringState = jest.fn(() => ({ isMonitoring: false }));

jest.mock('@/store/monitoringStore', () => ({
  monitoringStore: {
    persist: {
      hasHydrated: jest.fn(() => true),
      onFinishHydration: jest.fn(() => jest.fn()),
    },
    getState: () => mockGetMonitoringState(),
  },
  restoreMonitoringSession: (...args: unknown[]) => mockRestoreMonitoringSession(...args),
}));

let monitorServiceStateListener: ((event: { isRunning: boolean }) => void) | undefined;

jest.mock('@/specs', () => ({
  subscribeMonitorServiceStateChanged: (listener: (event: { isRunning: boolean }) => void) => {
    monitorServiceStateListener = listener;
    return { remove: jest.fn() };
  },
}));

import {
  resetMonitoringReconcileSchedulerForTests,
  useMonitoringServiceSync,
} from '@/navigation/hooks/useMonitoringServiceSync';
import { __resetAppForegroundBusForTests } from '@/runtime/appForegroundBus';

const TestHarness = ({ enabled }: { enabled: boolean }) => {
  useMonitoringServiceSync(enabled);
  return null;
};

describe('useMonitoringServiceSync', () => {
  let appStateListener: ((state: string) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    resetMonitoringReconcileSchedulerForTests();
    __resetAppForegroundBusForTests();
    monitorServiceStateListener = undefined;
    mockGetMonitoringState.mockReturnValue({ isMonitoring: false });
    appStateListener = undefined;

    const monitoringStoreMock = jest.requireMock('@/store/monitoringStore') as {
      monitoringStore: {
        persist: {
          hasHydrated: jest.Mock;
          onFinishHydration: jest.Mock;
        };
      };
    };
    monitoringStoreMock.monitoringStore.persist.hasHydrated.mockReturnValue(true);
    monitoringStoreMock.monitoringStore.persist.onFinishHydration.mockImplementation(() => jest.fn());

    jest.spyOn(AppState, 'addEventListener').mockImplementation((event, listener) => {
      if (event === 'change') {
        appStateListener = listener as (state: string) => void;
      }
      return { remove: jest.fn() };
    });
  });

  afterEach(() => {
    __resetAppForegroundBusForTests();
    jest.restoreAllMocks();
  });

  it('restores monitoring on mount when already hydrated', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });

    expect(mockRestoreMonitoringSession).toHaveBeenCalledTimes(1);
  });

  it('restores monitoring after persist hydration finishes', () => {
    let onFinishHydration: (() => void) | undefined;
    const monitoringStoreMock = jest.requireMock('@/store/monitoringStore') as {
      monitoringStore: {
        persist: {
          hasHydrated: jest.Mock;
          onFinishHydration: jest.Mock;
        };
      };
    };

    monitoringStoreMock.monitoringStore.persist.hasHydrated.mockReturnValue(false);
    monitoringStoreMock.monitoringStore.persist.onFinishHydration = jest.fn((listener: () => void) => {
      onFinishHydration = listener;
      return jest.fn();
    });

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });

    expect(mockRestoreMonitoringSession).not.toHaveBeenCalled();

    ReactTestRenderer.act(() => {
      onFinishHydration?.();
    });

    expect(mockRestoreMonitoringSession).toHaveBeenCalledTimes(1);
  });

  it('restores monitoring when the app becomes active and sync is enabled', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });
    mockRestoreMonitoringSession.mockClear();

    appStateListener?.('active');

    expect(mockRestoreMonitoringSession).toHaveBeenCalledTimes(1);
  });

  it('does nothing when sync is disabled', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled={false} />);
    });

    appStateListener?.('active');

    expect(mockRestoreMonitoringSession).not.toHaveBeenCalled();
  });

  it('restores monitoring when native reports the service stopped while monitoring is enabled', () => {
    mockGetMonitoringState.mockReturnValue({ isMonitoring: true });

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });
    mockRestoreMonitoringSession.mockClear();

    ReactTestRenderer.act(() => {
      monitorServiceStateListener?.({ isRunning: false });
    });

    expect(mockRestoreMonitoringSession).toHaveBeenCalledTimes(1);
  });
});
