/** @format */

import { AppState } from 'react-native';

import type React from 'react';
import ReactTestRenderer from 'react-test-renderer';

const mockNavigate = jest.fn();
const mockGetCurrentRoute = jest.fn();
const mockAreAllPermissionsGranted = jest.fn();
const mockInvalidatePermissionSnapshot = jest.fn();

const mockOnboardingState = {
  isConfirm: false,
};

jest.mock('@/store/onboardingStore', () => ({
  onboardingStore: {
    getState: () => mockOnboardingState,
  },
}));

jest.mock('@/domain/permissionSnapshot', () => ({
  areAllPermissionsGranted: () => mockAreAllPermissionsGranted(),
  invalidatePermissionSnapshot: () => mockInvalidatePermissionSnapshot(),
}));

import type { NavigationContainerRef } from '@react-navigation/native';

import { useAppPermissionGuard } from '@/navigation/hooks/useAppPermissionGuard';
import type { RootStackParamList } from '@/navigation/types';
import { __resetAppForegroundBusForTests } from '@/runtime/appForegroundBus';

const navigationRef = {
  current: {
    navigate: mockNavigate,
    getCurrentRoute: mockGetCurrentRoute,
  },
} as unknown as React.RefObject<NavigationContainerRef<RootStackParamList> | null>;

const TestHarness = ({ enabled }: { enabled: boolean }) => {
  useAppPermissionGuard(navigationRef, enabled);
  return null;
};

describe('useAppPermissionGuard', () => {
  let appStateListener: ((state: string) => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    __resetAppForegroundBusForTests();
    appStateListener = undefined;
    mockOnboardingState.isConfirm = true;
    mockAreAllPermissionsGranted.mockReturnValue(false);
    mockGetCurrentRoute.mockReturnValue({ name: 'Dashboard' });

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

  it('redirects to EnablePermissions when onboarding is complete and permissions are missing', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });

    expect(mockNavigate).toHaveBeenCalledWith('EnablePermissions');
  });

  it('re-checks permissions when the app becomes active', () => {
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });
    mockNavigate.mockClear();

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(mockInvalidatePermissionSnapshot).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('EnablePermissions');
  });

  it('does not redirect when permissions are already granted', () => {
    mockAreAllPermissionsGranted.mockReturnValue(true);

    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<TestHarness enabled />);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
