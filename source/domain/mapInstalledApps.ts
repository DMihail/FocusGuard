/** @format */

import type { ManageApp } from '@/domain/types';
import type { InstallApp } from '@/specs';

export const mapInstalledApps = (apps: InstallApp[]): ManageApp[] =>
  apps.map((app) => ({
    packageName: app.packageName,
    appName: app.appName,
    appImage: app.appImage,
    category: app.category,
    categoryLabel: app.category,
  }));
