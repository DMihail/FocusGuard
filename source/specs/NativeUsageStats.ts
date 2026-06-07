import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';

import type { AppUsageStat, InstallApp } from './types';

export type { AppUsageStat, InstallApp } from './types';

export interface Spec extends TurboModule {
  checkForPermission(): boolean;
  checkForSystemAlertWindowPermission(): boolean;
  checkForNotificationsPermission(): boolean;
  checkForIgnoreBatteryOptimizationsPermission(): boolean;
  checkForManifestMonitorPermissions(): boolean;
  startMonitorService(): void;
  stopMonitorService(): void;
  isMonitorServiceRunning(): boolean;
  requestUsageStatsPermission(): void;
  requestSystemAlertWindowPermission(): void;
  requestNotificationsPermission(): void;
  openNotificationsSettings(): void;
  requestIgnoreBatteryOptimizationsPermission(): void;
  getAppsUsageStats(): AppUsageStat[];
  getPackageUsageToday(packageName: string): number;
  getInstalledApplications(): InstallApp[];
  getAppDisplayName(): string;
  getAppVersion(): string;
  invalidateNativeCatalogCaches(): void;
  getE2ELaunchArg(key: string): string | null;
  isE2EEnabled(): boolean;
  configureE2EBootstrap(skipOnboarding: boolean, permissionsGranted: boolean, resetStorage: boolean): void;
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

export const stopMonitorService = (): void => {
  usageStats?.stopMonitorService();
};

export const isMonitorServiceRunning = (): boolean => usageStats?.isMonitorServiceRunning() ?? false;

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

export const getPackageUsageToday = (packageName: string): number => usageStats?.getPackageUsageToday(packageName) ?? 0;

export const getInstalledApplications = (): InstallApp[] => usageStats?.getInstalledApplications() ?? [];

export const getAppDisplayName = (): string => usageStats?.getAppDisplayName()?.trim() ?? '';

export const getAppVersion = (): string => usageStats?.getAppVersion()?.trim() ?? '';

export const invalidateNativeCatalogCaches = (): void => {
  usageStats?.invalidateNativeCatalogCaches();
};

export const getE2ELaunchArg = (key: string): string | null => usageStats?.getE2ELaunchArg(key) ?? null;

export const isE2EEnabled = (): boolean => usageStats?.isE2EEnabled() ?? false;

export const configureE2EBootstrap = (
  skipOnboarding: boolean,
  permissionsGranted: boolean,
  resetStorage: boolean,
): void => {
  usageStats?.configureE2EBootstrap(skipOnboarding, permissionsGranted, resetStorage);
};
