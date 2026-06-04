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

  it('delegates checkForPermission to the native module', () => {
    mockUsageStats.checkForPermission.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(true);
    expect(mockUsageStats.checkForPermission).toHaveBeenCalledTimes(1);
  });

  it('delegates requestUsageStatsPermission to the native module', () => {
    const specs = loadSpecs();

    specs.requestUsageStatsPermission();
    expect(mockUsageStats.requestUsageStatsPermission).toHaveBeenCalledTimes(1);
  });

  it('delegates SYSTEM_ALERT_WINDOW permission checks and requests', () => {
    mockUsageStats.checkForSystemAlertWindowPermission.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForSystemAlertWindowPermission()).toBe(true);
    specs.requestSystemAlertWindowPermission();
    expect(mockUsageStats.requestSystemAlertWindowPermission).toHaveBeenCalledTimes(1);
  });

  it('delegates battery optimization permission checks and requests', () => {
    mockUsageStats.checkForIgnoreBatteryOptimizationsPermission.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForIgnoreBatteryOptimizationsPermission()).toBe(true);
    specs.requestIgnoreBatteryOptimizationsPermission();
    expect(mockUsageStats.requestIgnoreBatteryOptimizationsPermission).toHaveBeenCalledTimes(1);
  });

  it('delegates manifest monitor permission checks', () => {
    mockUsageStats.checkForManifestMonitorPermissions.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForManifestMonitorPermissions()).toBe(true);
    expect(mockUsageStats.checkForManifestMonitorPermissions).toHaveBeenCalledTimes(1);
  });

  it('delegates startMonitorService to the native module', () => {
    const specs = loadSpecs();

    specs.startMonitorService();
    expect(mockUsageStats.startMonitorService).toHaveBeenCalledTimes(1);
  });

  it('delegates stopMonitorService to the native module', () => {
    const specs = loadSpecs();

    specs.stopMonitorService();
    expect(mockUsageStats.stopMonitorService).toHaveBeenCalledTimes(1);
  });

  it('delegates notifications permission checks and requests', () => {
    mockUsageStats.checkForNotificationsPermission.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForNotificationsPermission()).toBe(true);
    specs.requestNotificationsPermission();
    expect(mockUsageStats.requestNotificationsPermission).toHaveBeenCalledTimes(1);
    specs.openNotificationsSettings();
    expect(mockUsageStats.openNotificationsSettings).toHaveBeenCalledTimes(1);
  });

  it('returns usage stats from the native module', () => {
    const stats = [
      {
        packageName: 'com.app',
        appName: 'App',
        appImage: '',
        category: 'Social',
        totalTimeForeground: 1,
        lastTimeUsed: 2,
      },
    ];
    mockUsageStats.getAppsUsageStats.mockReturnValue(stats);
    const specs = loadSpecs();

    expect(specs.getAppsUsageStats()).toEqual(stats);
  });

  it('returns installed applications from the native module', () => {
    const apps = [{ packageName: 'com.app', appName: 'App', appImage: 'data:image/png;base64,x', category: 'Game' }];
    mockUsageStats.getInstalledApplications.mockReturnValue(apps);
    const specs = loadSpecs();

    expect(specs.getInstalledApplications()).toEqual(apps);
  });

  it('delegates isMonitorServiceRunning to the native module', () => {
    mockUsageStats.isMonitorServiceRunning.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.isMonitorServiceRunning()).toBe(true);
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
    expect(() => specs.requestUsageStatsPermission()).not.toThrow();
    expect(() => specs.requestSystemAlertWindowPermission()).not.toThrow();
    expect(() => specs.requestIgnoreBatteryOptimizationsPermission()).not.toThrow();
    expect(() => specs.startMonitorService()).not.toThrow();
    expect(() => specs.stopMonitorService()).not.toThrow();
    expect(() => specs.requestNotificationsPermission()).not.toThrow();
    expect(() => specs.openNotificationsSettings()).not.toThrow();
    expect(specs.isMonitorServiceRunning()).toBe(false);
  });
});
