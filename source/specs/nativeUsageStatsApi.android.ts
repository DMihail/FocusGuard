import { createNativeEventHub } from './createNativeEventHub';
import type {
  LocalDayChangedEvent,
  MonitorServiceStateChangedEvent,
  PermissionsChangedEvent,
  Spec,
} from './NativeUsageStats.android';
import { getNativeUsageStats } from './nativeUsageStatsClient.android';
import type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

export type {
  InstallApp,
  LocalDayChangedEvent,
  MonitorServiceStartResult,
  MonitorServiceStateChangedEvent,
  PackageUsage,
  PermissionsChangedEvent,
} from './types';

const getModule = (): Spec => getNativeUsageStats();

const permissionsChangedHub = createNativeEventHub<PermissionsChangedEvent>((listener) => {
  getModule().onPermissionsChanged(listener);
});

const localDayChangedHub = createNativeEventHub<LocalDayChangedEvent>((listener) => {
  getModule().onLocalDayChanged(listener);
});

const monitorServiceStateHub = createNativeEventHub<MonitorServiceStateChangedEvent>((listener) => {
  getModule().onMonitorServiceStateChanged(listener);
});

/** Registers Turbo Module event callbacks before React mounts any screen. */
export const bootstrapNativeUsageEvents = (): void => {
  permissionsChangedHub.bootstrap();
  localDayChangedHub.bootstrap();
  monitorServiceStateHub.bootstrap();
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
): { remove: () => void } => permissionsChangedHub.subscribe(listener);

export const subscribeLocalDayChanged = (listener: (event: LocalDayChangedEvent) => void): { remove: () => void } =>
  localDayChangedHub.subscribe(listener);

export const subscribeMonitorServiceStateChanged = (
  listener: (event: MonitorServiceStateChangedEvent) => void,
): { remove: () => void } => monitorServiceStateHub.subscribe(listener);
