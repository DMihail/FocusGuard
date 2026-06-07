import type { ManageApp } from '@/screen/ManageApps/types';

const hasSameMetadata = (left: ManageApp, right: ManageApp): boolean =>
  left.appName === right.appName &&
  left.appImage === right.appImage &&
  left.category === right.category &&
  left.categoryLabel === right.categoryLabel;

export const reconcileSelectedAppsWithInstalled = (
  selectedApps: ManageApp[],
  installedApps: ManageApp[],
): ManageApp[] => {
  if (selectedApps.length === 0 || installedApps.length === 0) {
    return selectedApps;
  }

  const installedByPackage = new Map(installedApps.map((app) => [app.packageName, app]));

  return selectedApps.map((selected) => installedByPackage.get(selected.packageName) ?? selected);
};

export const syncSelectedAppsMetadata = (selectedApps: ManageApp[], installedApps: ManageApp[]): ManageApp[] | null => {
  if (selectedApps.length === 0 || installedApps.length === 0) {
    return null;
  }

  const installedByPackage = new Map(installedApps.map((app) => [app.packageName, app]));
  let changed = false;

  const nextApps = selectedApps.map((selected) => {
    const installed = installedByPackage.get(selected.packageName);

    if (!installed || hasSameMetadata(selected, installed)) {
      return selected;
    }

    changed = true;
    return installed;
  });

  return changed ? nextApps : null;
};
