/** @format */

import { Platform } from 'react-native';

const mockCheckForPermission = jest.fn();
const mockCheckForDisplayOverAppsPermission = jest.fn();
const mockCheckForNotificationsPermission = jest.fn();

jest.mock('../../source/specs', () => ({
  checkForPermission: (...args: unknown[]) => mockCheckForPermission(...args),
  checkForDisplayOverAppsPermission: (...args: unknown[]) => mockCheckForDisplayOverAppsPermission(...args),
  checkForNotificationsPermission: (...args: unknown[]) => mockCheckForNotificationsPermission(...args),
}));

import { resolveEntryRoute } from '../../source/navigation/resolveEntryRoute';

describe('resolveEntryRoute', () => {
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

  it('returns Onboarding when onboarding is not confirmed', () => {
    expect(resolveEntryRoute(false)).toBe('Onboarding');
  });

  it('returns EnablePermissions when onboarding is confirmed but permissions are missing', () => {
    expect(resolveEntryRoute(true)).toBe('EnablePermissions');
  });

  it('returns Dashboard when onboarding is confirmed and all permissions are granted', () => {
    mockCheckForPermission.mockReturnValue(true);
    mockCheckForDisplayOverAppsPermission.mockReturnValue(true);
    mockCheckForNotificationsPermission.mockReturnValue(true);

    expect(resolveEntryRoute(true)).toBe('Dashboard');
  });
});
