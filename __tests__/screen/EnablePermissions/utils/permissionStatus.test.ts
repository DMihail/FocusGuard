/** @format */

import { Platform } from 'react-native';

const mockCheckForPermission = jest.fn();
const mockCheckForDisplayOverAppsPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockRequestUsageStatsPermission = jest.fn();
const mockRequestDisplayOverAppsPermission = jest.fn();
const mockRequestNotificationsPermission = jest.fn();

jest.mock('../../../../source/specs', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForDisplayOverAppsPermission: (...args: unknown[]) => mockCheckForDisplayOverAppsPermission(...args),
  checkForNotificationsPermission: (...args: unknown[]) => mockCheckForNotificationsPermission(...args),
  requestUsageStatsPermission: (...args: unknown[]) => mockRequestUsageStatsPermission(...args),
  requestDisplayOverAppsPermission: (...args: unknown[]) => mockRequestDisplayOverAppsPermission(...args),
  requestNotificationsPermission: (...args: unknown[]) => mockRequestNotificationsPermission(...args),
}));

import {
  areAllPermissionsGranted,
  readPermissionStatuses,
  requestPermissionById,
} from '../../../../source/screen/EnablePermissions/utils/permissionStatus';

describe('permissionStatus utils', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForDisplayOverAppsPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('reads pending statuses when native checks fail', () => {
    expect(readPermissionStatuses()).toEqual({
      'usage-access': 'pending',
      'display-over-apps': 'pending',
      notifications: 'pending',
    });
  });

  it('reports all permissions granted only when every native check passes', () => {
    expect(areAllPermissionsGranted()).toBe(false);

    mockCheckForPermission.mockReturnValue(true);
    mockCheckForDisplayOverAppsPermission.mockReturnValue(true);
    mockCheckForNotificationsPermission.mockReturnValue(true);

    expect(areAllPermissionsGranted()).toBe(true);
  });

  it('reads granted statuses when native checks pass', () => {
    mockCheckForPermission.mockReturnValue(true);
    mockCheckForDisplayOverAppsPermission.mockReturnValue(true);
    mockCheckForNotificationsPermission.mockReturnValue(true);

    expect(readPermissionStatuses()).toEqual({
      'usage-access': 'granted',
      'display-over-apps': 'granted',
      notifications: 'granted',
    });
  });

  it('requests usage access settings for usage-access', () => {
    requestPermissionById('usage-access');
    expect(mockRequestUsageStatsPermission).toHaveBeenCalledTimes(1);
  });

  it('requests overlay settings for display-over-apps', () => {
    requestPermissionById('display-over-apps');
    expect(mockRequestDisplayOverAppsPermission).toHaveBeenCalledTimes(1);
  });

  it('requests notification permission for notifications', () => {
    requestPermissionById('notifications');
    expect(mockRequestNotificationsPermission).toHaveBeenCalledTimes(1);
  });

  it('returns all granted on non-Android platforms without calling native checks', () => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'ios' });

    expect(readPermissionStatuses()).toEqual({
      'usage-access': 'granted',
      'display-over-apps': 'granted',
      notifications: 'granted',
    });
    expect(mockCheckForPermission).not.toHaveBeenCalled();

    requestPermissionById('usage-access');
    expect(mockRequestUsageStatsPermission).not.toHaveBeenCalled();
  });
});
