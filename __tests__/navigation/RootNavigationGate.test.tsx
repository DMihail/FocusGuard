/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AppState } from 'react-native';

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

jest.mock('../../source/navigation/components/AppLoader', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    AppLoader: () => <View testID="app-loader" />,
  };
});

jest.mock('../../source/navigation/resolveEntryRoute', () => ({
  resolveEntryRoute: (isConfirm: boolean) => (isConfirm ? 'Dashboard' : 'Onboarding'),
}));

jest.mock('../../source/screen/EnablePermissions/utils/permissionStatus', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
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
      return React.forwardRef((_: unknown, ref: React.Ref<{ navigate: typeof mockNavigate; getCurrentRoute: typeof mockGetCurrentRoute }>) => {
        React.useImperativeHandle(ref, () => ({
          navigate: mockNavigate,
          getCurrentRoute: mockGetCurrentRoute,
        }));

        return <View testID="navigation-root" />;
      });
    },
  };
});

jest.spyOn(AppState, 'addEventListener').mockImplementation((_, listener) => {
  appStateListener = listener as (state: string) => void;
  return { remove: jest.fn() };
});

import { RootNavigationGate } from '@/navigation/RootNavigationGate';

describe('RootNavigationGate', () => {
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
      tree = ReactTestRenderer.create(<RootNavigationGate />);
    });

    expect(tree!.root.findByProps({ testID: 'app-loader' })).toBeDefined();
    expect(tree!.root.findAllByProps({ testID: 'navigation-root' })).toHaveLength(0);
  });

  it('renders navigation with resolved initial route after hydration', () => {
    mockOnboardingState.hasHydrated = true;
    mockOnboardingState.isConfirm = true;

    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<RootNavigationGate />);
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
      ReactTestRenderer.create(<RootNavigationGate />);
    });

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(mockNavigate).toHaveBeenCalledWith('EnablePermissions');
  });
});
