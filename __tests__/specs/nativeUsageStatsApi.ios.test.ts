/** @format */

const mockUsageStats = {
  checkForPermission: jest.fn(),
  checkForNotificationsPermission: jest.fn(),
  startMonitorService: jest.fn(),
  stopMonitorService: jest.fn(),
  isMonitorServiceRunning: jest.fn(),
  requestUsageStatsPermission: jest.fn(),
  requestNotificationsPermission: jest.fn(),
  openNotificationsSettings: jest.fn(),
  getPackagesUsageToday: jest.fn(),
  getInstalledApplications: jest.fn(),
  getAppDisplayName: jest.fn(),
  getAppVersion: jest.fn(),
  invalidateNativeCatalogCaches: jest.fn(),
  syncTrackingConfig: jest.fn(),
  requestScreenTimeAuthorization: jest.fn(),
  presentFamilyActivityPicker: jest.fn(),
};

jest.unmock('@/specs/nativeUsageStatsClient');

jest.mock('@/specs/nativeUsageStatsClient', () => ({
  getNativeUsageStats: jest.fn(() => mockUsageStats),
}));

import { presentFamilyActivityPicker, subscribePermissionsChanged } from '@/specs/nativeUsageStatsApi.ios';

describe('nativeUsageStatsApi.ios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsageStats.presentFamilyActivityPicker.mockResolvedValue([]);
    mockUsageStats.requestScreenTimeAuthorization.mockResolvedValue(true);
  });

  it('exposes the Screen Time picker API', async () => {
    await expect(presentFamilyActivityPicker()).resolves.toEqual([]);
  });

  it('does not wire Android-only permission change events', () => {
    const listener = jest.fn();
    const subscription = subscribePermissionsChanged(listener);

    expect(listener).not.toHaveBeenCalled();
    subscription.remove();
  });
});
