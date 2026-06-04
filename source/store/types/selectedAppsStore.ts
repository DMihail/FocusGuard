/** @format */

import type { ManageApp } from '@/screen/ManageApps/types';

export type SelectedAppsStore = {
  apps: ManageApp[];
  toggleApp: (app: ManageApp) => void;
  isSelected: (packageName: string) => boolean;
};
