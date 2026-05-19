/** @format */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type AppUsageStat = Readonly<{
  packageName: string;
  appName: string;
  appImage: string;
  totalTimeForeground: number;
  lastTimeUsed: number;
}>;

export type InstallApp = Readonly<{
  packageName: string;
  appName: string;
  appImage: string;
}>;

export interface Spec extends TurboModule {
  checkForPermission(): boolean;
  checkForQueryAllPackagesPermission(): boolean;
  requestUsageStatsPermission(): void;
  getAppsUsageStats(): AppUsageStat[];
  getInstalledApplications(): InstallApp[];
}

const usageStats = TurboModuleRegistry.get<Spec>('NativeUsageStats');

export const checkForPermission = (): boolean => usageStats?.checkForPermission() ?? false;

export const checkForQueryAllPackagesPermission = (): boolean =>
  usageStats?.checkForQueryAllPackagesPermission() ?? false;

export const requestUsageStatsPermission = (): void => {
  usageStats?.requestUsageStatsPermission();
};

export const getAppsUsageStats = (): AppUsageStat[] => usageStats?.getAppsUsageStats() ?? [];

export const getInstalledApplications = (): InstallApp[] => usageStats?.getInstalledApplications() ?? [];
