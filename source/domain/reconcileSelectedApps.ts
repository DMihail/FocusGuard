import type { ManageApp } from '@/domain/types';

import { getManageAppKey } from './appKey';

const hasSameMetadata = (left: ManageApp, right: ManageApp): boolean =>
  left.appName === right.appName &&
  left.appImage === right.appImage &&
  left.category === right.category &&
  left.categoryLabel === right.categoryLabel;

export const syncSelectedAppsMetadata = (selectedApps: ManageApp[], installedApps: ManageApp[]): ManageApp[] | null => {
  if (selectedApps.length === 0 || installedApps.length === 0) {
    return null;
  }

  const installedByKey = new Map(installedApps.map((app) => [getManageAppKey(app), app]));
  let changed = false;

  const nextApps = selectedApps.map((selected) => {
    const installed = installedByKey.get(getManageAppKey(selected));

    if (!installed || hasSameMetadata(selected, installed)) {
      return selected;
    }

    changed = true;
    return installed;
  });

  return changed ? nextApps : null;
};
