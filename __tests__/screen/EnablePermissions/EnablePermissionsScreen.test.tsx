/** @format */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AppState, Platform } from 'react-native';

const mockNavigate = jest.fn();
const mockCheckForPermission = jest.fn();
const mockCheckForSystemAlertWindowPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockCheckForIgnoreBatteryOptimizationsPermission = jest.fn();
const mockCheckForManifestMonitorPermissions = jest.fn();
const mockStartMonitorService = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();
const mockRequestSystemAlertWindowPermission = jest.fn();
const mockRequestNotificationsPermission = jest.fn();
const mockRequestIgnoreBatteryOptimizationsPermission = jest.fn();
let appStateListener: ((state: string) => void) | undefined;
const mockRemoveAppStateListener = jest.fn();

jest.mock('../../../source/navigation', () => ({
  useRootNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@/specs', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForSystemAlertWindowPermission: (...args: unknown[]) => mockCheckForSystemAlertWindowPermission(...args),
  checkForNotificationsPermission: (...args: unknown[]) => mockCheckForNotificationsPermission(...args),
  checkForIgnoreBatteryOptimizationsPermission: (...args: unknown[]) =>
    mockCheckForIgnoreBatteryOptimizationsPermission(...args),
  checkForManifestMonitorPermissions: (...args: unknown[]) => mockCheckForManifestMonitorPermissions(...args),
  startMonitorService: (...args: unknown[]) => mockStartMonitorService(...args),
  requestUsageStatsPermission: (...args: unknown[]) => mockRequestUsageStatsPermission(...args),
  requestSystemAlertWindowPermission: (...args: unknown[]) => mockRequestSystemAlertWindowPermission(...args),
  requestNotificationsPermission: (...args: unknown[]) => mockRequestNotificationsPermission(...args),
  requestIgnoreBatteryOptimizationsPermission: (...args: unknown[]) =>
    mockRequestIgnoreBatteryOptimizationsPermission(...args),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

jest.mock('../../../source/screen/EnablePermissions/hooks/usePermissionCardAnimation', () => ({
  usePermissionCardAnimation: (status: 'granted' | 'pending') => ({
    cardStyle: {},
    iconBoxStyle: {},
    pendingIconOpacity: status === 'pending' ? 1 : 0,
    grantedIconOpacity: status === 'granted' ? 1 : 0,
    badgeStyle: {},
    grantButtonStyle: {},
    isGranted: status === 'granted',
  }),
}));

jest.spyOn(AppState, 'addEventListener').mockImplementation((_, listener) => {
  appStateListener = listener as (state: string) => void;
  return { remove: mockRemoveAppStateListener };
});

import { EnablePermissionsScreen } from '@/screen/EnablePermissions/EnablePermissionsScreen';

const grantAllNativePermissions = () => {
  mockCheckForPermission.mockReturnValue(true);
  mockCheckForSystemAlertWindowPermission.mockReturnValue(true);
  mockCheckForNotificationsPermission.mockReturnValue(true);
  mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
  mockCheckForManifestMonitorPermissions.mockReturnValue(true);
};

describe('EnablePermissionsScreen', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    appStateListener = undefined;
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('renders header, permission cards, privacy notice, and footer', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    expect(tree!.root.findByProps({ children: 'Enable Permissions' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Usage Access' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Display Over Apps' })).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Notifications' })).toBeDefined();
    expect(
      tree!.root.findByProps({
        children: 'All data stays on your device. We never collect or share your usage information.',
      }),
    ).toBeDefined();
    expect(tree!.root.findByProps({ children: 'Continue' })).toBeDefined();
  });

  it('keeps Continue disabled until all permissions are granted', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);
  });

  it('opens overlay settings when Display Over Apps grant is pressed', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Display Over Apps' }).props.onPress();
    });

    expect(mockRequestSystemAlertWindowPermission).toHaveBeenCalledTimes(1);
    expect(mockRequestUsageStatsPermission).not.toHaveBeenCalled();
  });

  it('opens notification settings when Notifications grant is pressed', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Notifications' }).props.onPress();
    });

    expect(mockRequestNotificationsPermission).toHaveBeenCalledTimes(1);
    expect(mockRequestUsageStatsPermission).not.toHaveBeenCalled();
  });

  it('opens system settings on grant and syncs status on AppState active', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Grant Usage Access' }).props.onPress();
    });

    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);
    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);

    grantAllNativePermissions();

    ReactTestRenderer.act(() => {
      appStateListener?.('active');
    });

    expect(tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(false);
  });

  it('removes AppState listener on unmount', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.unmount();
    });

    expect(mockRemoveAppStateListener).toHaveBeenCalledTimes(1);
  });

  it('navigates to Dashboard when Continue is pressed and all permissions are granted', () => {
    grantAllNativePermissions();

    let tree: ReactTestRenderer.ReactTestRenderer;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<EnablePermissionsScreen />);
    });

    ReactTestRenderer.act(() => {
      tree!.root.findByProps({ accessibilityLabel: 'Continue' }).props.onPress();
    });

    expect(mockStartMonitorService).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });
});
