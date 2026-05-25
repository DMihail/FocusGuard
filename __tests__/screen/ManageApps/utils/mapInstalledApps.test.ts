/** @format */

import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';
import { mapInstalledApps } from '@/screen/ManageApps/utils/mapInstalledApps';

describe('mapInstalledApps', () => {
  it('maps native install apps to manage app shape', () => {
    expect(mapInstalledApps(mockInstallApps)).toEqual(mockManageApps);
  });
});
