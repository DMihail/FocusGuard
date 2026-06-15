/** @format */

import { Platform } from 'react-native';

const mockSet = jest.fn();
const mockSyncTrackingConfig = jest.fn();

jest.mock('@/store/mmkv', () => ({
  storage: {
    set: (...args: unknown[]) => mockSet(...args),
  },
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
}));

jest.mock('@/specs/nativeUsageStatsClient', () => ({
  getNativeUsageStats: jest.fn(),
}));

import { getNativeUsageStats } from '@/specs/nativeUsageStatsClient';
import { appLimitsStore } from '@/store/appLimitsStore';
import { buildNativeTrackingSnapshot, syncNativeTrackingSnapshot } from '@/store/nativeTrackingSnapshot';
import { NATIVE_TRACKING_SNAPSHOT_KEY } from '@/store/persistSchema';
import { selectedAppsStore } from '@/store/selectedAppsStore';

const mockGetNativeUsageStats = getNativeUsageStats as jest.MockedFunction<typeof getNativeUsageStats>;

describe('nativeTrackingSnapshot', () => {
  const originalPlatform = Platform.OS;

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: 'android' });
    jest.clearAllMocks();
    selectedAppsStore.setState({ apps: [] });
    appLimitsStore.setState({ limitsByPackage: {} });
    mockGetNativeUsageStats.mockReturnValue({ syncTrackingConfig: mockSyncTrackingConfig } as never);
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', { configurable: true, value: originalPlatform });
  });

  it('writes a flat snapshot through syncTrackingConfig when the turbo module is available', () => {
    selectedAppsStore.setState({
      apps: [
        {
          packageName: 'com.example.app',
          appName: 'Example',
          appImage: '',
          category: 'Other',
          categoryLabel: 'Other',
        },
      ],
    });
    appLimitsStore.getState().setLimits('com.example.app', {
      warningMinutes: 30,
      hardBlockMinutes: 45,
      strictMode: true,
    });

    syncNativeTrackingSnapshot();

    const snapshotJson = JSON.stringify(buildNativeTrackingSnapshot());
    expect(mockSyncTrackingConfig).toHaveBeenCalledWith(snapshotJson);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('falls back to MMKV when the turbo module is unavailable', () => {
    mockGetNativeUsageStats.mockReturnValue(null);

    syncNativeTrackingSnapshot();

    expect(mockSet).toHaveBeenCalledWith(NATIVE_TRACKING_SNAPSHOT_KEY, JSON.stringify(buildNativeTrackingSnapshot()));
    expect(mockSyncTrackingConfig).not.toHaveBeenCalled();
  });
});
