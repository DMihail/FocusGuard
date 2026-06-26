import { subscribeAppForeground } from '@/runtime/appForegroundBus';

import type { Spec } from './NativeUsageStats.ios';
import { getNativeUsageStats } from './nativeUsageStatsClient.ios';
import type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

export type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

const getModule = (): Spec | null => getNativeUsageStats();

const MONITOR_NOT_STARTED: MonitorServiceStartResult = {
  started: false,
  reason: 'screen_time_unauthorized',
};

export const checkForPermission = (): boolean => getModule()?.checkForPermission() ?? false;

export const checkForNotificationsPermission = (): boolean => getModule()?.checkForNotificationsPermission() ?? false;

export const startMonitorService = (): MonitorServiceStartResult => {
  const result = getModule()?.startMonitorService();
  return result ? (result as MonitorServiceStartResult) : MONITOR_NOT_STARTED;
};

export const stopMonitorService = (): void => {
  getModule()?.stopMonitorService();
};

export const isMonitorServiceRunning = (): boolean => getModule()?.isMonitorServiceRunning() ?? false;

export const requestUsageStatsPermission = (): void => {
  getModule()?.requestUsageStatsPermission();
};

export const requestNotificationsPermission = (): void => {
  getModule()?.requestNotificationsPermission();
};

export const openNotificationsSettings = (): void => {
  getModule()?.openNotificationsSettings();
};

export const getPackagesUsageToday = async (packageNames: readonly string[]): Promise<PackageUsage[]> =>
  (await getModule()?.getPackagesUsageToday([...packageNames])) ?? [];

export const getInstalledApplications = async (): Promise<InstallApp[]> =>
  (await getModule()?.getInstalledApplications()) ?? [];

export const getAppDisplayName = (): string => getModule()?.getAppDisplayName()?.trim() ?? '';

export const getAppVersion = (): string => getModule()?.getAppVersion()?.trim() ?? '';

export const invalidateNativeCatalogCaches = (): void => {
  getModule()?.invalidateNativeCatalogCaches();
};

export const syncTrackingConfig = (snapshotJson: string): void => {
  getModule()?.syncTrackingConfig(snapshotJson);
};

export const presentFamilyActivityPicker = async (): Promise<InstallApp[]> =>
  (await getModule()?.presentFamilyActivityPicker()) ?? [];

export const subscribePermissionsChanged = (listener: () => void): { remove: () => void } => {
  const remove = subscribeAppForeground(listener);
  return { remove };
};
