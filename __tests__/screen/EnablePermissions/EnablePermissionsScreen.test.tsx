/** @format */

jest.mock('@/domain/permissions', () => ({
  ...jest.requireActual('@/domain/permissions/permissionIds.android'),
  ...jest.requireActual('@/domain/permissions/permissionStatus.android'),
}));

jest.mock('@/screen/EnablePermissions/data/permissions', () =>
  jest.requireActual('@/screen/EnablePermissions/data/permissions.android'),
);

import type React from 'react';

import {
  cleanupTestTrees,
  flushVirtualizedListTimers,
  flushVirtualizedListWork,
  renderTestTree,
  runTestAct,
} from '../../helpers/testRenderer';

const mockNavigate = jest.fn();
const mockCheckForPermission = jest.fn();
const mockCheckForSystemAlertWindowPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockCheckForIgnoreBatteryOptimizationsPermission = jest.fn();
const mockCheckForManifestMonitorPermissions = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();
const mockRequestSystemAlertWindowPermission = jest.fn();
const mockRequestNotificationsPermission = jest.fn();
const mockRequestIgnoreBatteryOptimizationsPermission = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const { useEffect } = require('react');
    useEffect(() => callback(), [callback]);
  },
}));

jest.mock('../../../source/navigation', () => ({
  useRootNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

let triggerPermissionsChanged: (() => void) | undefined;
const mockRemovePermissionsListener = jest.fn();

jest.mock('@/specs/keeptTurboModuleApi.android', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForSystemAlertWindowPermission: (...args: unknown[]) => mockCheckForSystemAlertWindowPermission(...args),
  checkForNotificationsPermission: (...args: unknown[]) => mockCheckForNotificationsPermission(...args),
  checkForIgnoreBatteryOptimizationsPermission: (...args: unknown[]) =>
    mockCheckForIgnoreBatteryOptimizationsPermission(...args),
  checkForManifestMonitorPermissions: (...args: unknown[]) => mockCheckForManifestMonitorPermissions(...args),
  requestUsageStatsPermission: (...args: unknown[]) => mockRequestUsageStatsPermission(...args),
  requestSystemAlertWindowPermission: (...args: unknown[]) => mockRequestSystemAlertWindowPermission(...args),
  requestNotificationsPermission: (...args: unknown[]) => mockRequestNotificationsPermission(...args),
  requestIgnoreBatteryOptimizationsPermission: (...args: unknown[]) =>
    mockRequestIgnoreBatteryOptimizationsPermission(...args),
  subscribePermissionsChanged: (listener: () => void) => {
    triggerPermissionsChanged = listener;
    return { remove: mockRemovePermissionsListener };
  },
}));

jest.mock('@/specs', () => jest.requireMock('@/specs/keeptTurboModuleApi.android'));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => <View {...props}>{children}</View>,
  };
});

jest.mock('../../../source/screen/EnablePermissions/hooks/usePermissionCardAnimation', () => ({
  usePermissionCardAnimation: (_id: string, status: 'granted' | 'pending') => ({
    grantedOverlayStyle: {},
    pendingIconStyle: {},
    grantedIconStyle: {},
    badgeStyle: {},
    grantButtonStyle: {},
    isGranted: status === 'granted',
  }),
}));

jest.mock('@/hooks/usePrefetchNativeCatalogs', () => ({
  usePrefetchNativeCatalogs: jest.fn(),
}));

import { resetUsageAccessUiLatchForTests } from '@/domain/permissions/permissionStatus.android';
import { invalidatePermissionSnapshot } from '@/domain/permissionSnapshot';
import { EnablePermissionsScreen } from '@/screen/EnablePermissions/EnablePermissionsScreen';

const grantAllNativePermissions = () => {
  mockCheckForPermission.mockReturnValue(true);
  mockCheckForSystemAlertWindowPermission.mockReturnValue(true);
  mockCheckForNotificationsPermission.mockReturnValue(true);
  mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
  mockCheckForManifestMonitorPermissions.mockReturnValue(true);
};

describe('EnablePermissionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    triggerPermissionsChanged = undefined;
    resetUsageAccessUiLatchForTests();
    invalidatePermissionSnapshot();
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
  });

  afterEach(async () => {
    flushVirtualizedListTimers();
    cleanupTestTrees();
    jest.useRealTimers();
    await flushVirtualizedListWork();
  });

  it('keeps Continue disabled until all permissions are granted', () => {
    const tree = renderTestTree(<EnablePermissionsScreen />);
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);
  });

  it('opens overlay settings when Display Over Apps grant is pressed', () => {
    const tree = renderTestTree(<EnablePermissionsScreen />);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ accessibilityLabel: 'Allow Display over other apps' }).props.onPress();
    });

    expect(mockRequestSystemAlertWindowPermission).toHaveBeenCalledTimes(1);
    expect(mockRequestUsageStatsPermission).not.toHaveBeenCalled();
  });

  it('opens notification settings when Notifications grant is pressed', () => {
    const tree = renderTestTree(<EnablePermissionsScreen />);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ accessibilityLabel: 'Allow Notifications' }).props.onPress();
    });

    expect(mockRequestNotificationsPermission).toHaveBeenCalledTimes(1);
    expect(mockRequestUsageStatsPermission).not.toHaveBeenCalled();
  });

  it('opens system settings on grant and syncs status on permissions changed event', () => {
    const tree = renderTestTree(<EnablePermissionsScreen />);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ accessibilityLabel: 'Allow Usage access' }).props.onPress();
    });

    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);
    expect(tree.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(true);

    grantAllNativePermissions();

    runTestAct(() => {
      triggerPermissionsChanged?.();
    });
    flushVirtualizedListTimers();

    expect(tree.root.findByProps({ accessibilityLabel: 'Continue' }).props.disabled).toBe(false);
  });

  it('removes permissions listener on unmount', () => {
    renderTestTree(<EnablePermissionsScreen />);
    flushVirtualizedListTimers();

    cleanupTestTrees();

    expect(mockRemovePermissionsListener).toHaveBeenCalled();
  });

  it('navigates to Dashboard when Continue is pressed and all permissions are granted', () => {
    grantAllNativePermissions();

    const tree = renderTestTree(<EnablePermissionsScreen />);
    flushVirtualizedListTimers();

    runTestAct(() => {
      tree.root.findByProps({ accessibilityLabel: 'Continue' }).props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
  });
});
