import type { PermissionsChangedEvent, Spec } from './NativeUsageStats';
import { getNativeUsageStats } from './nativeUsageStatsClient';
import type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

export type { PermissionsChangedEvent } from './NativeUsageStats';
export type { InstallApp, MonitorServiceFailureReason, MonitorServiceStartResult, PackageUsage } from './types';

const getModule = (): Spec | null => getNativeUsageStats();

const MONITOR_SERVICE_NOT_STARTED: MonitorServiceStartResult = {
  started: false,
  reason: 'manifest_permissions_missing',
};

export const checkForPermission = (): boolean => getModule()?.checkForPermission() ?? false;

export const checkForSystemAlertWindowPermission = (): boolean =>
  getModule()?.checkForSystemAlertWindowPermission() ?? false;

export const checkForNotificationsPermission = (): boolean => getModule()?.checkForNotificationsPermission() ?? false;

export const checkForIgnoreBatteryOptimizationsPermission = (): boolean =>
  getModule()?.checkForIgnoreBatteryOptimizationsPermission() ?? false;

export const checkForManifestMonitorPermissions = (): boolean =>
  getModule()?.checkForManifestMonitorPermissions() ?? false;

export const startMonitorService = (): MonitorServiceStartResult => {
  const result = getModule()?.startMonitorService();

  if (!result) {
    return MONITOR_SERVICE_NOT_STARTED;
  }

  return result as MonitorServiceStartResult;
};

export const stopMonitorService = (): void => {
  getModule()?.stopMonitorService();
};

export const isMonitorServiceRunning = (): boolean => getModule()?.isMonitorServiceRunning() ?? false;

export const requestUsageStatsPermission = (): void => {
  getModule()?.requestUsageStatsPermission();
};

export const requestSystemAlertWindowPermission = (): void => {
  getModule()?.requestSystemAlertWindowPermission();
};

export const requestNotificationsPermission = (): void => {
  getModule()?.requestNotificationsPermission();
};

export const openNotificationsSettings = (): void => {
  getModule()?.openNotificationsSettings();
};

export const requestIgnoreBatteryOptimizationsPermission = (): void => {
  getModule()?.requestIgnoreBatteryOptimizationsPermission();
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

export const subscribePermissionsChanged = (
  listener: (event: PermissionsChangedEvent) => void,
): { remove: () => void } => {
  const subscription = getModule()?.onPermissionsChanged((event) => {
    listener(event);
  });

  return {
    remove: () => {
      subscription?.remove();
    },
  };
};
