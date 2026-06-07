import { reconcileSelectedAppsWithInstalled, syncSelectedAppsMetadata } from '@/domain/reconcileSelectedApps';
import { createManageApp, mockManageApps } from '@/testing/fixtures/manageApps';

describe('reconcileSelectedAppsWithInstalled', () => {
  it('keeps persisted apps when the install catalog is empty', () => {
    const selected = [mockManageApps[0]];

    expect(reconcileSelectedAppsWithInstalled(selected, [])).toEqual(selected);
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

    expect(reconcileSelectedAppsWithInstalled(selected, installed)).toEqual(installed);
    expect(syncSelectedAppsMetadata(selected, installed)).toEqual(installed);
  });

  it('leaves uninstalled selections untouched', () => {
    const selected = [mockManageApps[0]];
    const installed = [mockManageApps[1]];

    expect(reconcileSelectedAppsWithInstalled(selected, installed)).toEqual(selected);
    expect(syncSelectedAppsMetadata(selected, installed)).toBeNull();
  });
});
