/** @format */

import { AppState } from 'react-native';

import type React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();
const mockGetCurrentRoute = jest.fn();
const mockAreAllPermissionsGranted = jest.fn();
const mockCreateStaticNavigation = jest.fn();

let appStateListener: ((state: string) => void) | undefined;
const mockOnboardingState = {
  hasHydrated: false,
  isConfirm: false,
  setIsConfirm: jest.fn(),
  setHasHydrated: jest.fn(),
};

jest.mock('../../source/navigation/resolveEntryRoute', () => ({
  resolveEntryRoute: (isConfirm: boolean) => (isConfirm ? 'Dashboard' : 'Onboarding'),
}));

jest.mock('../../source/domain/permissionSnapshot', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
  invalidatePermissionSnapshot: jest.fn(),
  getPermissionStatuses: jest.fn(() => ({
    'usage-access': 'granted',
    'display-over-apps': 'granted',
    notifications: 'granted',
    'battery-optimization': 'granted',
  })),
}));

jest.mock('../../source/store/mmkv', () => ({
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
  storage: {
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
  },
}));

jest.mock('../../source/store/nativeTrackingSnapshot', () => ({
  startNativeTrackingSnapshotSync: jest.fn(() => jest.fn()),
}));

jest.mock('../../source/specs', () => ({
  isMonitorServiceRunning: jest.fn(() => false),
}));

jest.mock('../../source/hooks/useCoreStoresHydrated', () => ({
  useCoreStoresHydrated: () => mockOnboardingState.hasHydrated,
}));

jest.mock('../../source/hooks/usePrefetchNativeCatalogs', () => ({
  usePrefetchNativeCatalogs: jest.fn(),
}));

jest.mock('../../source/store/onboardingStore', () => {
  const onboardingStore = Object.assign(
    (selector: (state: typeof mockOnboardingState) => unknown) => selector(mockOnboardingState),
    {
      getState: () => mockOnboardingState,
    },
  );

  return { onboardingStore };
});

jest.mock('../../source/navigation/RootStack', () => ({
  createRootStack: jest.fn(() => ({ screens: {} })),
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    createStaticNavigation: (...args: unknown[]) => {
      mockCreateStaticNavigation(...args);
      return React.forwardRef(
        (
          _: unknown,
          ref: React.Ref<{ navigate: typeof mockNavigate; getCurrentRoute: typeof mockGetCurrentRoute }>,
        ) => {
          React.useImperativeHandle(ref, () => ({
            navigate: mockNavigate,
            getCurrentRoute: mockGetCurrentRoute,
          }));

          return <View testID="navigation-root" />;
        },
      );
    },
  };
});

jest.spyOn(AppState, 'addEventListener').mockImplementation((event, listener) => {
  if (event === 'change') {
    appStateListener = listener as (state: string) => void;
  }
  return { remove: jest.fn() };
});

import { RootNavigationGate } from '@/navigation/RootNavigationGate';

let testRenderer: ReactTestRenderer.ReactTestRenderer | undefined;

describe('RootNavigationGate', () => {
  afterEach(() => {
    if (testRenderer) {
      ReactTestRenderer.act(() => {
        testRenderer?.unmount();
      });
      testRenderer = undefined;
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    appStateListener = undefined;
    mockOnboardingState.hasHydrated = false;
    mockOnboardingState.isConfirm = false;
    mockAreAllPermissionsGranted.mockReturnValue(true);
    mockGetCurrentRoute.mockReturnValue({ name: 'Dashboard' });
  });

  it('shows loader until store is hydrated', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      testRenderer = ReactTestRenderer.create(<RootNavigationGate />);
      tree = testRenderer;
    });

    expect(tree!.root.findByProps({ testID: 'app-loader' })).toBeDefined();
    expect(tree!.root.findAllByProps({ testID: 'navigation-root' })).toHaveLength(0);
  });

  it('renders navigation with resolved initial route after hydration', () => {
    mockOnboardingState.hasHydrated = true;
    mockOnboardingState.isConfirm = true;

    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      testRenderer = ReactTestRenderer.create(<RootNavigationGate />);
      tree = testRenderer;
    });

    expect(tree!.root.findByProps({ testID: 'navigation-root' })).toBeDefined();
    expect(mockCreateStaticNavigation).toHaveBeenCalled();
  });

  it('redirects to EnablePermissions when app becomes active and permissions are missing', () => {
    mockOnboardingState.hasHydrated = true;
    mockOnboardingState.isConfirm = true;
    mockAreAllPermissionsGranted.mockReturnValue(false);
    mockGetCurrentRoute.mockReturnValue({ name: 'Dashboard' });

    ReactTestRenderer.act(() => {
      testRenderer = ReactTestRenderer.create(<RootNavigationGate />);
    });

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(mockNavigate).toHaveBeenCalledWith('EnablePermissions');
  });
});
