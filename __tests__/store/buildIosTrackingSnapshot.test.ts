/** @format */

const mockApps = [
  {
    tokenId: 'ios-token-0',
    packageName: 'legacy-alias',
    appName: 'App',
    appImage: '',
    category: 'Other',
    categoryLabel: 'Other',
  },
];

jest.mock('@/domain/appKey', () => jest.requireActual('@/domain/appKey.ios'));

jest.mock('@/store/selectedAppsStore', () => ({
  selectedAppsStore: {
    getState: () => ({ apps: mockApps }),
  },
}));

jest.mock('@/store/appLimitsStore', () => ({
  DEFAULT_APP_LIMITS: { warningMinutes: 30, hardBlockMinutes: 60, strictMode: false },
  appLimitsStore: {
    getState: () => ({
      limitsByPackage: {
        'ios-token-0': { warningMinutes: 15, hardBlockMinutes: 30, strictMode: true },
      },
    }),
  },
}));

import { buildIosTrackingSnapshot } from '@/store/iosTrackingSnapshot';

describe('buildIosTrackingSnapshot', () => {
  it('uses tokenId keys for tracked apps and limits', () => {
    expect(buildIosTrackingSnapshot()).toEqual({
      version: 2,
      platform: 'ios',
      authMode: 'individual',
      trackedAppTokenIds: ['ios-token-0'],
      limitsByTokenId: {
        'ios-token-0': { warningMinutes: 15, hardBlockMinutes: 30, strictMode: true },
      },
    });
  });
});
