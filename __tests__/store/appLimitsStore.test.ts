/** @format */

jest.mock('@/store/mmkv', () => ({
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
}));

import { appLimitsStore, DEFAULT_APP_LIMITS, normalizeAppLimits } from '@/store/appLimitsStore';

describe('appLimitsStore', () => {
  beforeEach(() => {
    appLimitsStore.setState({ limitsByPackage: {} });
  });

  it('returns default limits for unknown packages', () => {
    expect(appLimitsStore.getState().getLimits('com.unknown')).toEqual(DEFAULT_APP_LIMITS);
  });

  it('stores and retrieves per-app limits', () => {
    appLimitsStore.getState().setLimits('com.test', {
      warningMinutes: 30,
      hardBlockMinutes: 90,
      strictMode: true,
    });

    expect(appLimitsStore.getState().getLimits('com.test')).toEqual({
      warningMinutes: 30,
      hardBlockMinutes: 90,
      strictMode: true,
    });
  });

  it('normalizes hard block to be at least warning threshold', () => {
    expect(
      normalizeAppLimits({
        warningMinutes: 60,
        hardBlockMinutes: 30,
        strictMode: false,
      }),
    ).toEqual({
      warningMinutes: 60,
      hardBlockMinutes: 60,
      strictMode: false,
    });
  });
});
