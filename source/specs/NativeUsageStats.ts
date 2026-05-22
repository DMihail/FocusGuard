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
  checkForSystemAlertWindowPermission(): boolean;
  checkForNotificationsPermission(): boolean;
  checkForIgnoreBatteryOptimizationsPermission(): boolean;
  /** Install-time manifest permissions (FGS, boot receiver) — not user-grantable. */
  checkForManifestMonitorPermissions(): boolean;
  startMonitorService(): void;
  requestUsageStatsPermission(): void;
  requestSystemAlertWindowPermission(): void;
  requestNotificationsPermission(): void;
  openNotificationsSettings(): void;
  requestIgnoreBatteryOptimizationsPermission(): void;
  getAppsUsageStats(): AppUsageStat[];
  getInstalledApplications(): InstallApp[];
}

const usageStats = TurboModuleRegistry.get<Spec>('NativeUsageStats');

export const checkForPermission = (): boolean => usageStats?.checkForPermission() ?? false;

export const checkForSystemAlertWindowPermission = (): boolean =>
  usageStats?.checkForSystemAlertWindowPermission() ?? false;

export const checkForNotificationsPermission = (): boolean => usageStats?.checkForNotificationsPermission() ?? false;

export const checkForIgnoreBatteryOptimizationsPermission = (): boolean =>
  usageStats?.checkForIgnoreBatteryOptimizationsPermission() ?? false;

export const checkForManifestMonitorPermissions = (): boolean =>
  usageStats?.checkForManifestMonitorPermissions() ?? false;

export const startMonitorService = (): void => {
  usageStats?.startMonitorService();
};

export const requestUsageStatsPermission = (): void => {
  usageStats?.requestUsageStatsPermission();
};

export const requestSystemAlertWindowPermission = (): void => {
  usageStats?.requestSystemAlertWindowPermission();
};

export const requestNotificationsPermission = (): void => {
  usageStats?.requestNotificationsPermission();
};

export const openNotificationsSettings = (): void => {
  usageStats?.openNotificationsSettings();
};

export const requestIgnoreBatteryOptimizationsPermission = (): void => {
  usageStats?.requestIgnoreBatteryOptimizationsPermission();
};

export const getAppsUsageStats = (): AppUsageStat[] => usageStats?.getAppsUsageStats() ?? [];

export const getInstalledApplications = (): InstallApp[] => usageStats?.getInstalledApplications() ?? [];
