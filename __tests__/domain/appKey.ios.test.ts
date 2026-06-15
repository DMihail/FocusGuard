/** @format */

import { getManageAppKey } from '@/domain/appKey.ios';

describe('appKey.ios', () => {
  it('prefers tokenId over packageName', () => {
    expect(
      getManageAppKey({
        packageName: 'legacy-alias',
        tokenId: 'ios-token-0',
        appName: 'App',
        appImage: '',
        category: 'Other',
        categoryLabel: 'Other',
      }),
    ).toBe('ios-token-0');
  });

  it('falls back to packageName when tokenId is missing', () => {
    expect(
      getManageAppKey({
        packageName: 'ios-token-1',
        appName: 'App',
        appImage: '',
        category: 'Other',
        categoryLabel: 'Other',
      }),
    ).toBe('ios-token-1');
  });
});
