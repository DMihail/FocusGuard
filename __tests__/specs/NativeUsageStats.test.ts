/** @format */

const mockUsageStats = {
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
  getAppsUsageStats: jest.fn(),
  getInstalledApplications: jest.fn(),
  isMonitorServiceRunning: jest.fn(),
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
    mockGet.mockReturnValue(mockUsageStats);
    mockUsageStats.checkForPermission.mockReturnValue(false);
    mockUsageStats.getAppsUsageStats.mockReturnValue([]);
    mockUsageStats.getInstalledApplications.mockReturnValue([]);
    mockUsageStats.isMonitorServiceRunning.mockReturnValue(false);
  });

  it('delegates native module calls when the turbo module is available', () => {
    mockUsageStats.checkForPermission.mockReturnValue(true);
    mockUsageStats.isMonitorServiceRunning.mockReturnValue(true);

    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(true);
    expect(specs.isMonitorServiceRunning()).toBe(true);
    specs.startMonitorService();
    specs.stopMonitorService();
    expect(mockUsageStats.startMonitorService).toHaveBeenCalledTimes(1);
    expect(mockUsageStats.stopMonitorService).toHaveBeenCalledTimes(1);
  });

  it('returns safe defaults when native module is unavailable', () => {
    mockGet.mockReturnValue(null);
    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(false);
    expect(specs.checkForSystemAlertWindowPermission()).toBe(false);
    expect(specs.checkForIgnoreBatteryOptimizationsPermission()).toBe(false);
    expect(specs.checkForManifestMonitorPermissions()).toBe(false);
    expect(specs.checkForNotificationsPermission()).toBe(false);
    expect(specs.getAppsUsageStats()).toEqual([]);
    expect(specs.getInstalledApplications()).toEqual([]);
    expect(specs.isMonitorServiceRunning()).toBe(false);
    expect(() => specs.requestUsageStatsPermission()).not.toThrow();
    expect(() => specs.startMonitorService()).not.toThrow();
    expect(() => specs.stopMonitorService()).not.toThrow();
  });
});
