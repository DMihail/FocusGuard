import { syncSelectedAppsMetadata } from '@/domain/reconcileSelectedApps';
import { createManageApp, mockManageApps } from '@/testing/fixtures/manageApps';

describe('syncSelectedAppsMetadata', () => {
  it('returns null when the install catalog is empty', () => {
    const selected = [mockManageApps[0]];

    expect(syncSelectedAppsMetadata(selected, [])).toBeNull();
  });

  it('replaces stale metadata with the install catalog entry for the same package', () => {
    const selected = [
      createManageApp({
        packageName: 'com.social.chat',
        appName: 'Old Chat Name',
        appImage: 'file://old.png',
        category: 'Social',
        categoryLabel: 'Social',
      }),
    ];
    const installed = [mockManageApps[0]];

    expect(syncSelectedAppsMetadata(selected, installed)).toEqual(installed);
  });

  it('leaves uninstalled selections untouched', () => {
    const selected = [mockManageApps[0]];
    const installed = [mockManageApps[1]];

    expect(syncSelectedAppsMetadata(selected, installed)).toBeNull();
  });
});
