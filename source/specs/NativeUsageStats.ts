/** @format */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type AppUsageStat = Readonly<{
  packageName: string;
  appName: string;
  appImage: string;
  category: string;
  totalTimeForeground: number;
  lastTimeUsed: number;
}>;

export type InstallApp = Readonly<{
  packageName: string;
  appName: string;
  appImage: string;
  category: string;
}>;

export interface Spec extends TurboModule {
  checkForPermission(): boolean;
  checkForQueryAllPackagesPermission(): boolean;
  checkForDisplayOverAppsPermission(): boolean;
  checkForSystemAlertWindowPermission(): boolean;
  checkForNotificationsPermission(): boolean;
  requestUsageStatsPermission(): void;
  requestDisplayOverAppsPermission(): void;
  requestSystemAlertWindowPermission(): void;
  requestNotificationsPermission(): void;
  getAppsUsageStats(): AppUsageStat[];
  getInstalledApplications(): InstallApp[];
}

const usageStats = TurboModuleRegistry.get<Spec>('NativeUsageStats');

export const checkForPermission = (): boolean => usageStats?.checkForPermission() ?? false;

export const checkForQueryAllPackagesPermission = (): boolean =>
  usageStats?.checkForQueryAllPackagesPermission() ?? false;

export const checkForDisplayOverAppsPermission = (): boolean =>
  usageStats?.checkForDisplayOverAppsPermission() ?? false;

export const checkForSystemAlertWindowPermission = (): boolean =>
  usageStats?.checkForSystemAlertWindowPermission() ?? false;

export const checkForNotificationsPermission = (): boolean => usageStats?.checkForNotificationsPermission() ?? false;

export const requestUsageStatsPermission = (): void => {
  usageStats?.requestUsageStatsPermission();
};

export const requestDisplayOverAppsPermission = (): void => {
  usageStats?.requestDisplayOverAppsPermission();
};

export const requestSystemAlertWindowPermission = (): void => {
  usageStats?.requestSystemAlertWindowPermission();
};

export const requestNotificationsPermission = (): void => {
  usageStats?.requestNotificationsPermission();
};

export const getAppsUsageStats = (): AppUsageStat[] => usageStats?.getAppsUsageStats() ?? [];

export const getInstalledApplications = (): InstallApp[] => usageStats?.getInstalledApplications() ?? [];
