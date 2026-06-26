/** @format */

import { AppState } from 'react-native';

import ReactTestRenderer from 'react-test-renderer';

const mockRestoreMonitoringSession = jest.fn();

jest.mock('@/store/monitoringStore', () => ({
  monitoringStore: {
    persist: {
      hasHydrated: jest.fn(() => true),
    },
  },
  restoreMonitoringSession: (...args: unknown[]) => mockRestoreMonitoringSession(...args),
}));

import { useMonitoringServiceSync } from '@/navigation/hooks/useMonitoringServiceSync';
import { __resetAppForegroundBusForTests } from '@/runtime/appForegroundBus';

const TestHarness = ({ enabled }: { enabled: boolean }) => {
  useMonitoringServiceSync(enabled);
  return null;
};

describe('useMonitoringServiceSync', () => {
  let appStateListener: ((state: string) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    __resetAppForegroundBusForTests();
    appStateListener = undefined;

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

  it('restores monitoring when the app becomes active and sync is enabled', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });

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
});
