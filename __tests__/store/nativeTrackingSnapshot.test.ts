/** @format */

const mockSet = jest.fn();
const mockSyncTrackingConfig = jest.fn();

jest.mock('@/store/mmkv', () => ({
  storage: {
    set: (...args: unknown[]) => mockSet(...args),
  },
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
}));

jest.mock('@/specs/keeptTurboModuleClient', () => ({
  getKeeptTurboModule: jest.fn(),
}));

jest.mock('@/store/platformTrackingSnapshot', () => jest.requireActual('@/store/platformTrackingSnapshot.android'));

import { getKeeptTurboModule } from '@/specs/keeptTurboModuleClient';
import { buildAndroidTrackingSnapshot } from '@/store/androidTrackingSnapshot';
import { appLimitsStore } from '@/store/appLimitsStore';
import { resetNativeTrackingSnapshotSyncForTests, syncNativeTrackingSnapshot } from '@/store/nativeTrackingSnapshot';
import { NATIVE_TRACKING_SNAPSHOT_KEY } from '@/store/persistSchema';
import { selectedAppsStore } from '@/store/selectedAppsStore';

const mockGetKeeptTurboModule = getKeeptTurboModule as jest.MockedFunction<typeof getKeeptTurboModule>;

describe('nativeTrackingSnapshot (Android)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetNativeTrackingSnapshotSyncForTests();
    selectedAppsStore.setState({ apps: [] });
    appLimitsStore.setState({ limitsByAppKey: {} });
    mockGetKeeptTurboModule.mockReturnValue({ syncTrackingConfig: mockSyncTrackingConfig } as never);
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

    const snapshotJson = JSON.stringify(buildAndroidTrackingSnapshot());
    expect(mockSyncTrackingConfig).toHaveBeenCalledWith(snapshotJson);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('falls back to MMKV when the turbo module is unavailable', () => {
    mockGetKeeptTurboModule.mockReturnValue(null);

    syncNativeTrackingSnapshot();

    expect(mockSet).toHaveBeenCalledWith(NATIVE_TRACKING_SNAPSHOT_KEY, JSON.stringify(buildAndroidTrackingSnapshot()));
    expect(mockSyncTrackingConfig).not.toHaveBeenCalled();
  });
});
