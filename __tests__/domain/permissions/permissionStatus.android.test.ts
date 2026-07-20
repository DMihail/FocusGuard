/** @format */

import { mockMmkvStorage } from '../../helpers/mockMmkvStorage';

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
  resetUsageAccessUiLatchForTests,
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
  mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
};

const grantAllCardChecks = () => {
  grantRequiredChecks();
  mockCheckForNotificationsPermission.mockReturnValue(true);
};

describe('permissionStatus.android', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMmkvStorage.clear();
    resetUsageAccessUiLatchForTests();
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(false);
  });

  it('reads pending statuses when native checks fail', () => {
    expect(readPermissionStatuses()).toEqual(allPending);
  });

  it('requires manifest monitor permissions for areAllPermissionsGranted', () => {
    grantRequiredChecks();
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);
    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(true);

    grantRequiredChecks();
    mockCheckForManifestMonitorPermissions.mockReturnValue(false);
    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(false);
  });

  it('does not require notifications permission to continue', () => {
    grantRequiredChecks();
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);

    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(true);
    expect(readPermissionStatuses().notifications).toBe('pending');
  });

  it('does not require battery optimization to continue', () => {
    grantRequiredChecks();
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);

    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(true);
    expect(readPermissionStatuses()['battery-optimization']).toBe('pending');
  });

  it('reads granted statuses when visible checks pass', () => {
    grantAllCardChecks();
    expect(readPermissionStatuses()).toEqual(allGranted);
  });

  it('shows usage-access pending when native reports revoked and persistence was cleared', () => {
    grantAllCardChecks();
    readPermissionStatuses();

    mockCheckForPermission.mockReturnValue(false);
    mockMmkvStorage.remove('usage-access-granted-v1');

    expect(readPermissionStatuses()['usage-access']).toBe('pending');
    expect(mockMmkvStorage.getBoolean('usage-access-granted-v1')).toBe(false);
  });

  it('keeps usage-access granted when native flickers but persistence remains', () => {
    grantAllCardChecks();
    readPermissionStatuses();

    mockCheckForPermission.mockReturnValue(false);

    expect(readPermissionStatuses()['usage-access']).toBe('granted');
  });

  it('pins usage-access latch before opening another permission settings screen', () => {
    grantAllCardChecks();
    readPermissionStatuses();

    mockCheckForPermission.mockReturnValue(false);
    requestPermissionById('battery-optimization');

    expect(mockCheckForPermission).toHaveBeenCalled();
    expect(readPermissionStatuses()['usage-access']).toBe('granted');
    expect(mockRequestIgnoreBatteryOptimizationsPermission).toHaveBeenCalledTimes(1);
  });

  it('clears the usage-access latch when the user re-opens usage settings', () => {
    grantAllCardChecks();
    readPermissionStatuses();

    mockCheckForPermission.mockReturnValue(false);
    requestPermissionById('usage-access');

    expect(readPermissionStatuses()['usage-access']).toBe('pending');
    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);
  });
});
