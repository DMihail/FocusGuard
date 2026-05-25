/** @format */

import type { InstallApp } from '@/specs';
import type { ManageApp } from '../types';

export const mapInstalledApps = (apps: InstallApp[]): ManageApp[] =>
  apps.map((app) => ({
    packageName: app.packageName,
    appName: app.appName,
    appImage: app.appImage,
    category: app.category,
    categoryLabel: app.category,
  }));
