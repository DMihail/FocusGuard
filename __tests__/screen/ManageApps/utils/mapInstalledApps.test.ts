/** @format */

import { mapInstalledApps } from '@/screen/ManageApps/utils/mapInstalledApps';
import { mockInstallApps, mockManageApps } from '@/testing/fixtures/manageApps';

describe('mapInstalledApps', () => {
  it('maps native install apps to manage app shape', () => {
    expect(mapInstalledApps(mockInstallApps)).toEqual(mockManageApps);
  });
});
