/** @format */

const mockSet = jest.fn();

jest.mock('@/store/mmkv', () => ({
  storage: {
    set: (...args: unknown[]) => mockSet(...args),
  },
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
}));

import { appLimitsStore } from '@/store/appLimitsStore';
import { buildNativeTrackingSnapshot, syncNativeTrackingSnapshot } from '@/store/nativeTrackingSnapshot';
import { NATIVE_TRACKING_SNAPSHOT_KEY } from '@/store/persistSchema';
import { selectedAppsStore } from '@/store/selectedAppsStore';

describe('nativeTrackingSnapshot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    selectedAppsStore.setState({ apps: [] });
    appLimitsStore.setState({ limitsByPackage: {} });
  });

  it('writes a flat snapshot with tracked apps and limits', () => {
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

    expect(mockSet).toHaveBeenCalledWith(NATIVE_TRACKING_SNAPSHOT_KEY, JSON.stringify(buildNativeTrackingSnapshot()));
  });
});
