/** @format */

jest.unmock('@/specs/nativeUsageStatsClient');

const mockAndroidGet = jest.fn();
const mockAndroidGetEnforcing = jest.fn();

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
  TurboModuleRegistry: {
    get: (...args: unknown[]) => mockAndroidGet(...args),
    getEnforcing: (...args: unknown[]) => mockAndroidGetEnforcing(...args),
  },
}));

describe('nativeUsageStatsClient.android', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockAndroidGetEnforcing.mockReturnValue({ checkForPermission: () => true });
  });

  it('uses getEnforcing on Android', () => {
    const { getNativeUsageStats } = require('../../source/specs/nativeUsageStatsClient.android');

    expect(getNativeUsageStats()?.checkForPermission()).toBe(true);
    expect(mockAndroidGetEnforcing).toHaveBeenCalledWith('NativeUsageStats');
    expect(mockAndroidGet).not.toHaveBeenCalled();
  });
});
