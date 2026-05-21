/** @format */

import type { InstallApp } from '../../specs';
import type { ManageApp } from '../../screen/ManageApps/types';

export const createManageApp = (overrides: Partial<ManageApp> = {}): ManageApp => ({
  packageName: 'com.example',
  appName: 'Example',
  appImage: '',
  category: 'Game',
  categoryLabel: 'Game',
  ...overrides,
});

export const mockInstallApps: InstallApp[] = [
  {
    packageName: 'com.social.chat',
    appName: 'Social Chat',
    appImage: '',
    category: 'Social',
  },
  {
    packageName: 'com.game.puzzle',
    appName: 'Puzzle Game',
    appImage: '',
    category: 'Game',
  },
  {
    packageName: 'com.news.reader',
    appName: 'News Reader',
    appImage: '',
    category: 'News',
  },
];

export const mockManageApps: ManageApp[] = mockInstallApps.map((app) => ({
  packageName: app.packageName,
  appName: app.appName,
  appImage: app.appImage,
  category: app.category,
  categoryLabel: app.category,
}));
