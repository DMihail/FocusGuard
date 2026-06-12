/** @format */

const mockPermissionsChangedSubscription = { remove: jest.fn() };
let capturedPermissionsChangedListener: (() => void) | undefined;

const mockUsageStats = {
  onPermissionsChanged: jest.fn((listener: () => void) => {
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
};

const mockGet = jest.fn();

jest.mock('react-native', () => ({
  TurboModuleRegistry: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

type NativeUsageStatsModule = typeof import('../../source/specs/NativeUsageStats');

const loadSpecs = (): NativeUsageStatsModule => {
  jest.resetModules();
  return require('../../source/specs/NativeUsageStats');
};

describe('NativeUsageStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedPermissionsChangedListener = undefined;
    mockGet.mockReturnValue(mockUsageStats);
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

  it('returns safe defaults when native module is unavailable', async () => {
    mockGet.mockReturnValue(null);
    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(false);
    expect(specs.checkForSystemAlertWindowPermission()).toBe(false);
    expect(specs.checkForIgnoreBatteryOptimizationsPermission()).toBe(false);
    expect(specs.checkForManifestMonitorPermissions()).toBe(false);
    expect(specs.checkForNotificationsPermission()).toBe(false);
    await expect(specs.getPackagesUsageToday(['com.example.app'])).resolves.toEqual([]);
    await expect(specs.getInstalledApplications()).resolves.toEqual([]);
    expect(specs.isMonitorServiceRunning()).toBe(false);
    expect(specs.startMonitorService()).toEqual({
      started: false,
      reason: 'manifest_permissions_missing',
    });
    expect(specs.getAppDisplayName()).toBe('');
    expect(specs.getAppVersion()).toBe('');
    expect(() => specs.requestUsageStatsPermission()).not.toThrow();
    expect(() => specs.stopMonitorService()).not.toThrow();
  });

  it('subscribes to codegen onPermissionsChanged events', () => {
    const listener = jest.fn();
    const specs = loadSpecs();

    const subscription = specs.subscribePermissionsChanged(listener);

    expect(mockUsageStats.onPermissionsChanged).toHaveBeenCalledTimes(1);

    capturedPermissionsChangedListener?.();
    expect(listener).toHaveBeenCalledTimes(1);

    subscription.remove();
    expect(mockPermissionsChangedSubscription.remove).toHaveBeenCalledTimes(1);
  });
});
