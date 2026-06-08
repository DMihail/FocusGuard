/** @format */

import { mapInstalledApps } from '@/domain/mapInstalledApps';
import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';

describe('mapInstalledApps', () => {
  it('maps native install apps to manage app rows', () => {
    expect(mapInstalledApps(mockInstallApps)).toEqual(mockManageApps);
  });
});
