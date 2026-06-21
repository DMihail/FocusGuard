import type { PermissionsChangedEvent, Spec } from './NativeUsageStats.android';
import { getNativeUsageStats } from './nativeUsageStatsClient.android';
import type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

export type { PermissionsChangedEvent } from './types';
export type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

const getModule = (): Spec => getNativeUsageStats();

export const checkForPermission = (): boolean => getModule().checkForPermission();

export const checkForSystemAlertWindowPermission = (): boolean => getModule().checkForSystemAlertWindowPermission();

export const checkForNotificationsPermission = (): boolean => getModule().checkForNotificationsPermission();

export const checkForIgnoreBatteryOptimizationsPermission = (): boolean =>
  getModule().checkForIgnoreBatteryOptimizationsPermission();

export const checkForManifestMonitorPermissions = (): boolean => getModule().checkForManifestMonitorPermissions();

export const startMonitorService = (): MonitorServiceStartResult =>
  getModule().startMonitorService() as MonitorServiceStartResult;

export const stopMonitorService = (): void => {
  getModule().stopMonitorService();
};

export const isMonitorServiceRunning = (): boolean => getModule().isMonitorServiceRunning();

export const requestUsageStatsPermission = (): void => {
  getModule().requestUsageStatsPermission();
};

export const requestSystemAlertWindowPermission = (): void => {
  getModule().requestSystemAlertWindowPermission();
};

export const requestNotificationsPermission = (): void => {
  getModule().requestNotificationsPermission();
};

export const openNotificationsSettings = (): void => {
  getModule().openNotificationsSettings();
};

export const requestIgnoreBatteryOptimizationsPermission = (): void => {
  getModule().requestIgnoreBatteryOptimizationsPermission();
};

export const getPackagesUsageToday = async (packageNames: readonly string[]): Promise<PackageUsage[]> =>
  (await getModule().getPackagesUsageToday([...packageNames])) ?? [];

export const getInstalledApplications = async (): Promise<InstallApp[]> =>
  (await getModule().getInstalledApplications()) ?? [];

export const getAppDisplayName = (): string => getModule().getAppDisplayName()?.trim() ?? '';

export const getAppVersion = (): string => getModule().getAppVersion()?.trim() ?? '';

export const invalidateNativeCatalogCaches = (): void => {
  getModule().invalidateNativeCatalogCaches();
};

export const syncTrackingConfig = (snapshotJson: string): void => {
  getModule().syncTrackingConfig(snapshotJson);
};

export const subscribePermissionsChanged = (
  listener: (event: PermissionsChangedEvent) => void,
): { remove: () => void } => {
  const subscription = getModule().onPermissionsChanged((event) => {
    listener(event);
  });

  return {
    remove: () => {
      subscription.remove();
    },
  };
};
