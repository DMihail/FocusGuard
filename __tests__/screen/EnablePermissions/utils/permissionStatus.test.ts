/** @format */

import { Platform } from 'react-native';

const mockCheckForPermission = jest.fn();
const mockCheckForSystemAlertWindowPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockCheckForIgnoreBatteryOptimizationsPermission = jest.fn();
const mockCheckForManifestMonitorPermissions = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();
const mockRequestSystemAlertWindowPermission = jest.fn();
const mockRequestNotificationsPermission = jest.fn();
const mockRequestIgnoreBatteryOptimizationsPermission = jest.fn();

jest.mock('@/specs', () => ({
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
}));

import {
  areAllPermissionsGranted,
  readPermissionStatuses,
  requestPermissionById,
} from '@/screen/EnablePermissions/utils/permissionStatus';

const allPending = {
  'usage-access': 'pending',
  'display-over-apps': 'pending',
  notifications: 'pending',
  'battery-optimization': 'pending',
} as const;

const allGranted = {
  'usage-access': 'granted',
  'display-over-apps': 'granted',
  notifications: 'granted',
  'battery-optimization': 'granted',
} as const;

const grantVisibleChecks = () => {
  mockCheckForPermission.mockReturnValue(true);
  mockCheckForSystemAlertWindowPermission.mockReturnValue(true);
  mockCheckForNotificationsPermission.mockReturnValue(true);
  mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
};

describe('permissionStatus utils', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(false);
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('reads pending statuses when native checks fail', () => {
    expect(readPermissionStatuses()).toEqual(allPending);
  });

  it('requires manifest monitor permissions for areAllPermissionsGranted', () => {
    grantVisibleChecks();
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);
    expect(areAllPermissionsGranted()).toBe(true);

    grantVisibleChecks();
    mockCheckForManifestMonitorPermissions.mockReturnValue(false);
    expect(areAllPermissionsGranted()).toBe(false);
  });

  it('reads granted statuses when visible checks pass', () => {
    grantVisibleChecks();
    expect(readPermissionStatuses()).toEqual(allGranted);
  });

  it('requests battery optimization settings for battery-optimization', () => {
    requestPermissionById('battery-optimization');
    expect(mockRequestIgnoreBatteryOptimizationsPermission).toHaveBeenCalledTimes(1);
  });

  it('returns all granted on non-Android platforms without calling native checks', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });

    expect(readPermissionStatuses()).toEqual(allGranted);
    expect(areAllPermissionsGranted()).toBe(true);
    expect(mockCheckForPermission).not.toHaveBeenCalled();
  });
});
