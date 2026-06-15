/** @format */

import { mapInstalledApps } from '@/domain/mapInstalledApps';
import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';

describe('mapInstalledApps', () => {
  it('maps native install apps to manage app rows', () => {
    expect(mapInstalledApps(mockInstallApps)).toEqual(mockManageApps);
  });

  it('maps optional tokenId from native payloads', () => {
    expect(
      mapInstalledApps([
        {
          packageName: 'ios-token-0',
          tokenId: 'ios-token-0',
          appName: 'Selected App 1',
          appImage: '',
          category: 'Other',
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        packageName: 'ios-token-0',
        tokenId: 'ios-token-0',
        appName: 'Selected App 1',
      }),
    ]);
  });
});
