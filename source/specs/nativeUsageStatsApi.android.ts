import type { PermissionsChangedEvent, Spec } from './NativeUsageStats.android';
import { getNativeUsageStats } from './nativeUsageStatsClient.android';
import type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

export type { PermissionsChangedEvent } from './types';
export type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

const getModule = (): Spec => getNativeUsageStats();

const permissionsChangedListeners = new Set<(event: PermissionsChangedEvent) => void>();
let hasNativePermissionsChangedSubscription = false;

const ensureNativePermissionsChangedSubscription = (): void => {
  if (hasNativePermissionsChangedSubscription) {
    return;
  }

  getModule().onPermissionsChanged((event) => {
    for (const listener of permissionsChangedListeners) {
      listener(event);
    }
  });
  hasNativePermissionsChangedSubscription = true;
};

/** Registers the Turbo Module event callback before React mounts any screen. */
export const bootstrapPermissionsChangedEvents = (): void => {
  ensureNativePermissionsChangedSubscription();
};

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
  ensureNativePermissionsChangedSubscription();
  permissionsChangedListeners.add(listener);

  return {
    remove: () => {
      permissionsChangedListeners.delete(listener);
    },
  };
};
