/** @format */

import { Platform } from 'react-native';

const mockCheckForPermission = jest.fn();
const mockCheckForSystemAlertWindowPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();
const mockCheckForIgnoreBatteryOptimizationsPermission = jest.fn();
const mockCheckForManifestMonitorPermissions = jest.fn();

jest.mock('@/specs', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForSystemAlertWindowPermission: (...args: unknown[]) => mockCheckForSystemAlertWindowPermission(...args),
  checkForNotificationsPermission: (...args: unknown[]) => mockCheckForNotificationsPermission(...args),
  checkForIgnoreBatteryOptimizationsPermission: (...args: unknown[]) =>
    mockCheckForIgnoreBatteryOptimizationsPermission(...args),
  checkForManifestMonitorPermissions: (...args: unknown[]) => mockCheckForManifestMonitorPermissions(...args),
}));

import { invalidatePermissionSnapshot } from '@/domain/permissionSnapshot';
import { resolveEntryRoute } from '@/navigation/resolveEntryRoute';

describe('resolveEntryRoute', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    jest.clearAllMocks();
    invalidatePermissionSnapshot();
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    mockCheckForPermission.mockReturnValue(false);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(false);
    mockCheckForNotificationsPermission.mockReturnValue(false);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(false);
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('returns Onboarding when onboarding is not confirmed', () => {
    expect(resolveEntryRoute(false)).toBe('Onboarding');
  });

  it('returns EnablePermissions when onboarding is confirmed but permissions are missing', () => {
    expect(resolveEntryRoute(true)).toBe('EnablePermissions');
  });

  it('returns Dashboard when onboarding is confirmed and all permissions are granted', () => {
    mockCheckForPermission.mockReturnValue(true);
    mockCheckForSystemAlertWindowPermission.mockReturnValue(true);
    mockCheckForNotificationsPermission.mockReturnValue(true);
    mockCheckForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
    mockCheckForManifestMonitorPermissions.mockReturnValue(true);

    expect(resolveEntryRoute(true)).toBe('Dashboard');
  });
});
