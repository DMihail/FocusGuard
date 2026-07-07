/** @format */

import { createLazyScreen } from './createLazyScreen';

/** Secondary stack screens — loaded on first navigation, not on app start. */
export const ManageAppsScreen = createLazyScreen(
  () => import('@/screen/ManageApps/ManageAppsScreen'),
  'ManageAppsScreen',
);

export const TrackedAppsScreen = createLazyScreen(
  () => import('@/screen/TrackedApps/TrackedAppsScreen'),
  'TrackedAppsScreen',
);

export const StatisticsScreen = createLazyScreen(
  () => import('@/screen/Statistics/StatisticsScreen'),
  'StatisticsScreen',
);

export const ConfigureLimitsScreen = createLazyScreen(
  () => import('@/screen/ConfigureLimits/ConfigureLimitsScreen'),
  'ConfigureLimitsScreen',
);

export const SettingsScreen = createLazyScreen(() => import('@/screen/Settings/SettingsScreen'), 'SettingsScreen');

export const LegalDocumentScreen = createLazyScreen(
  () => import('@/screen/Legal/LegalDocumentScreen'),
  'LegalDocumentScreen',
);
