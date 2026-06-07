/** @format */

import type { ManageApp } from '@/screen/ManageApps/types';

const hasSameMetadata = (left: ManageApp, right: ManageApp): boolean =>
  left.appName === right.appName &&
  left.appImage === right.appImage &&
  left.category === right.category &&
  left.categoryLabel === right.categoryLabel;

/** Applies fresh install-catalog metadata to persisted selections by package name. */
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

export const hasSelectedAppsMetadataDrift = (selectedApps: ManageApp[], installedApps: ManageApp[]): boolean => {
  const installedByPackage = new Map(installedApps.map((app) => [app.packageName, app]));

  return selectedApps.some((selected) => {
    const installed = installedByPackage.get(selected.packageName);

    return installed !== undefined && !hasSameMetadata(selected, installed);
  });
};
