/** @format */

import type { ManageApp } from '@/domain/types';

export type SelectedAppsStore = {
  apps: ManageApp[];
  toggleApp: (app: ManageApp) => void;
  replaceApps: (apps: ManageApp[]) => void;
  syncSelectedAppsMetadata: (installedApps: ManageApp[]) => void;
};
