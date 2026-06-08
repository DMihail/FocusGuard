/** @format */

import type { ManageApp } from '@/domain/types';

export type SelectedAppsStore = {
  apps: ManageApp[];
  toggleApp: (app: ManageApp) => void;
  isSelected: (packageName: string) => boolean;
  syncSelectedAppsMetadata: (installedApps: ManageApp[]) => void;
};
