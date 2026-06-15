/** @format */

const mockCheckForPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();

jest.mock('@/specs/nativeUsageStatsApi.ios', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForSystemAlertWindowPermission: jest.fn(() => false),
  checkForNotificationsPermission: (...args: unknown[]) => mockCheckForNotificationsPermission(...args),
  checkForIgnoreBatteryOptimizationsPermission: jest.fn(() => false),
  requestUsageStatsPermission: (...args: unknown[]) => mockRequestUsageStatsPermission(...args),
  requestSystemAlertWindowPermission: jest.fn(),
  requestNotificationsPermission: jest.fn(),
  requestIgnoreBatteryOptimizationsPermission: jest.fn(),
}));

import {
  areRequiredPermissionsGranted,
  readPermissionStatuses,
  requestPermissionById,
} from '@/domain/permissions/permissionStatus.ios';

describe('permissionStatus.ios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
  });

  it('reads iOS permission statuses from native checks', () => {
    mockCheckForNotificationsPermission.mockReturnValue(true);

    expect(readPermissionStatuses()).toEqual({
      'usage-access': 'pending',
      notifications: 'granted',
      'display-over-apps': 'granted',
      'battery-optimization': 'granted',
    });
    expect(mockCheckForPermission).toHaveBeenCalled();
  });

  it('requires Screen Time authorization on iOS', () => {
    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(false);

    mockCheckForPermission.mockReturnValue(true);
    expect(areRequiredPermissionsGranted(readPermissionStatuses())).toBe(true);
  });

  it('requests usage access permission on iOS for usage-access', () => {
    requestPermissionById('usage-access');
    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);
  });
});
