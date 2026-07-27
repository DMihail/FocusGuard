/** @format */

const mockCheckForPermission = jest.fn();
const mockCheckForSystemAlertWindowPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockCheckForIgnoreBatteryOptimizationsPermission = jest.fn();
const mockCheckForManifestMonitorPermissions = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();
const mockRequestSystemAlertWindowPermission = jest.fn();
const mockRequestNotificationsPermission = jest.fn();
const mockRequestIgnoreBatteryOptimizationsPermission = jest.fn();

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
}));

import {
  areRequiredPermissionsGranted,
  readPermissionStatuses,
  requestPermissionById,
} from '@/domain/permissions/permissionStatus.android';

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

const grantRequiredChecks = () => {
  mockCheckForPermission.mockReturnValue(true);
  mockCheckForSystemAlertWindowPermission.mockReturnValue(true);
};

describe('permissionStatus.android', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(false);
  });

  it('reads pending statuses when native checks fail', () => {
    expect(readPermissionStatuses()).toEqual(allPending);
  });

  it('reads granted statuses when visible checks pass', () => {
    grantRequiredChecks();
    mockCheckForNotificationsPermission.mockReturnValue(true);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
    expect(readPermissionStatuses()).toEqual(allGranted);
  });

  it('requires usage-access, display-over-apps, and manifest monitor permissions', () => {
    grantRequiredChecks();
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);
    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(true);

    mockCheckForManifestMonitorPermissions.mockReturnValue(false);
    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(false);
  });

  it('does not require notifications or battery optimization to continue', () => {
    grantRequiredChecks();
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);

    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(true);
    expect(readPermissionStatuses().notifications).toBe('pending');
    expect(readPermissionStatuses()['battery-optimization']).toBe('pending');
  });

  it('forwards permission requests to native', () => {
    requestPermissionById('battery-optimization');
    expect(mockRequestIgnoreBatteryOptimizationsPermission).toHaveBeenCalledTimes(1);

    requestPermissionById('usage-access');
    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);

    requestPermissionById('display-over-apps');
    expect(mockRequestSystemAlertWindowPermission).toHaveBeenCalledTimes(1);

    requestPermissionById('notifications');
    expect(mockRequestNotificationsPermission).toHaveBeenCalledTimes(1);
  });
});
