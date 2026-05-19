/** @format */

const mockUsageStats = {
  checkForPermission: jest.fn(),
  checkForQueryAllPackagesPermission: jest.fn(),
  requestUsageStatsPermission: jest.fn(),
  getAppsUsageStats: jest.fn(),
  getInstalledApplications: jest.fn(),
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
    mockUsageStats.checkForQueryAllPackagesPermission.mockReturnValue(false);
    mockUsageStats.getAppsUsageStats.mockReturnValue([]);
    mockUsageStats.getInstalledApplications.mockReturnValue([]);
  });

  it('delegates checkForPermission to the native module', () => {
    mockUsageStats.checkForPermission.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(true);
    expect(mockUsageStats.checkForPermission).toHaveBeenCalledTimes(1);
  });

  it('delegates checkForQueryAllPackagesPermission to the native module', () => {
    mockUsageStats.checkForQueryAllPackagesPermission.mockReturnValue(true);
    const specs = loadSpecs();

    expect(specs.checkForQueryAllPackagesPermission()).toBe(true);
    expect(mockUsageStats.checkForQueryAllPackagesPermission).toHaveBeenCalledTimes(1);
  });

  it('delegates requestUsageStatsPermission to the native module', () => {
    const specs = loadSpecs();

    specs.requestUsageStatsPermission();
    expect(mockUsageStats.requestUsageStatsPermission).toHaveBeenCalledTimes(1);
  });

  it('returns usage stats from the native module', () => {
    const stats = [{ packageName: 'com.app', appName: 'App', appImage: '', totalTimeForeground: 1, lastTimeUsed: 2 }];
    mockUsageStats.getAppsUsageStats.mockReturnValue(stats);
    const specs = loadSpecs();

    expect(specs.getAppsUsageStats()).toEqual(stats);
  });

  it('returns installed applications from the native module', () => {
    const apps = [{ packageName: 'com.app', appName: 'App', appImage: 'data:image/png;base64,x' }];
    mockUsageStats.getInstalledApplications.mockReturnValue(apps);
    const specs = loadSpecs();

    expect(specs.getInstalledApplications()).toEqual(apps);
  });

  it('returns safe defaults when native module is unavailable', () => {
    mockGet.mockReturnValue(null);
    const specs = loadSpecs();

    expect(specs.checkForPermission()).toBe(false);
    expect(specs.checkForQueryAllPackagesPermission()).toBe(false);
    expect(specs.getAppsUsageStats()).toEqual([]);
    expect(specs.getInstalledApplications()).toEqual([]);
    expect(() => specs.requestUsageStatsPermission()).not.toThrow();
  });
});
