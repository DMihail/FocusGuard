/** @format */

const mockPermissionsChangedSubscription = { remove: jest.fn() };
let capturedPermissionsChangedListener: ((event: { changedAtMs: number }) => void) | undefined;

const mockUsageStats = {
  onPermissionsChanged: jest.fn((listener: (event: { changedAtMs: number }) => void) => {
    capturedPermissionsChangedListener = listener;
    return mockPermissionsChangedSubscription;
  }),
  checkForPermission: jest.fn(),
  checkForSystemAlertWindowPermission: jest.fn(),
  checkForNotificationsPermission: jest.fn(),
  checkForIgnoreBatteryOptimizationsPermission: jest.fn(),
  checkForManifestMonitorPermissions: jest.fn(),
  startMonitorService: jest.fn(),
  stopMonitorService: jest.fn(),
  requestUsageStatsPermission: jest.fn(),
  requestSystemAlertWindowPermission: jest.fn(),
  requestNotificationsPermission: jest.fn(),
  openNotificationsSettings: jest.fn(),
  requestIgnoreBatteryOptimizationsPermission: jest.fn(),
  getPackagesUsageToday: jest.fn(),
  getInstalledApplications: jest.fn(),
  getAppDisplayName: jest.fn(),
  getAppVersion: jest.fn(),
  isMonitorServiceRunning: jest.fn(),
  invalidateNativeCatalogCaches: jest.fn(),
  syncTrackingConfig: jest.fn(),
};

jest.unmock('@/specs/nativeUsageStatsClient.android');

jest.mock('@/specs/nativeUsageStatsClient.android', () => ({
  getNativeUsageStats: jest.fn(() => mockUsageStats),
}));

type NativeUsageStatsApi = typeof import('@/specs/nativeUsageStatsApi.android');

const loadSpecs = (): NativeUsageStatsApi => {
  jest.resetModules();
  jest.unmock('@/specs/nativeUsageStatsClient.android');
  jest.mock('@/specs/nativeUsageStatsClient.android', () => ({
    getNativeUsageStats: jest.fn(() => mockUsageStats),
  }));
  return require('@/specs/nativeUsageStatsApi.android');
};

describe('nativeUsageStatsApi.android', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedPermissionsChangedListener = undefined;
    mockUsageStats.checkForPermission.mockReturnValue(false);
    mockUsageStats.getPackagesUsageToday.mockResolvedValue([]);
    mockUsageStats.getInstalledApplications.mockResolvedValue([]);
    mockUsageStats.isMonitorServiceRunning.mockReturnValue(false);
    mockUsageStats.getAppDisplayName.mockReturnValue('Keept');
    mockUsageStats.getAppVersion.mockReturnValue('1.0.0');
    mockUsageStats.startMonitorService.mockReturnValue({ started: true });
  });

  it('delegates native module calls when the turbo module is available', async () => {
    mockUsageStats.checkForPermission.mockReturnValue(true);
    mockUsageStats.isMonitorServiceRunning.mockReturnValue(true);

    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(true);
    expect(specs.isMonitorServiceRunning()).toBe(true);
    expect(specs.startMonitorService()).toEqual({ started: true });
    specs.stopMonitorService();
    await expect(specs.getInstalledApplications()).resolves.toEqual([]);
    expect(mockUsageStats.startMonitorService).toHaveBeenCalledTimes(1);
    expect(mockUsageStats.stopMonitorService).toHaveBeenCalledTimes(1);
  });

  it('throws when the turbo module is unavailable', () => {
    jest.resetModules();
    jest.unmock('@/specs/nativeUsageStatsClient.android');
    jest.mock('@/specs/nativeUsageStatsClient.android', () => ({
      getNativeUsageStats: jest.fn(() => {
        throw new Error('NativeUsageStats not found');
      }),
    }));
    const specs = require('@/specs/nativeUsageStatsApi.android') as NativeUsageStatsApi;

    expect(() => specs.checkForPermission()).toThrow('NativeUsageStats not found');
  });

  it('subscribes to onPermissionsChanged events', () => {
    const listener = jest.fn();
    const specs = loadSpecs();

    const subscription = specs.subscribePermissionsChanged(listener);

    expect(mockUsageStats.onPermissionsChanged).toHaveBeenCalledTimes(1);

    capturedPermissionsChangedListener?.({ changedAtMs: 42 });
    expect(listener).toHaveBeenCalledWith({ changedAtMs: 42 });

    subscription.remove();
    expect(mockPermissionsChangedSubscription.remove).toHaveBeenCalledTimes(1);
  });
});
