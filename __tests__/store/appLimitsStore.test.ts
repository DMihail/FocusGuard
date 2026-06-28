/** @format */

jest.mock('@/store/mmkv', () => ({
  zustandStorage: require('../helpers/mockZustandMmkv').mockZustandStorage,
}));

import { appLimitsStore, normalizeAppLimits } from '@/store/appLimitsStore';

describe('appLimitsStore', () => {
  beforeEach(() => {
    appLimitsStore.setState({ limitsByAppKey: {} });
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
