/** @format */

import { createNativeEventHub } from './createNativeEventHub';
import { getKeeptTurboModule } from './keeptTurboModuleClient.android';
import type { Spec } from './NativeKeeptTurboModule.android';
import type {
  InstallApp,
  LocalDayChangedEvent,
  MonitorServiceStartResult,
  MonitorServiceStateChangedEvent,
  PackageUsage,
  PermissionsChangedEvent,
  TrackedUsageChangedEvent,
} from './types';

export type {
  InstallApp,
  LocalDayChangedEvent,
  MonitorServiceStartResult,
  MonitorServiceStateChangedEvent,
  PackageUsage,
  PermissionsChangedEvent,
  TrackedUsageChangedEvent,
} from './types';

const getModule = (): Spec => getKeeptTurboModule();

const createModuleEventHub = <T>(register: (module: Spec, listener: (event: T) => void) => void) =>
  createNativeEventHub<T>((listener) => {
    try {
      register(getModule(), listener);
      return true;
    } catch {
      return false;
    }
  });

const permissionsChangedHub = createModuleEventHub<PermissionsChangedEvent>((module, listener) => {
  module.onPermissionsChanged(listener);
});

const localDayChangedHub = createModuleEventHub<LocalDayChangedEvent>((module, listener) => {
  module.onLocalDayChanged(listener);
});

const monitorServiceStateHub = createModuleEventHub<MonitorServiceStateChangedEvent>((module, listener) => {
  module.onMonitorServiceStateChanged(listener);
});

const trackedUsageChangedHub = createModuleEventHub<TrackedUsageChangedEvent>((module, listener) => {
  module.onTrackedUsageChanged(listener);
});

/** Registers Turbo Module event callbacks before React mounts any screen. */
export const bootstrapKeeptTurboModuleEvents = (): void => {
  permissionsChangedHub.bootstrap();
  localDayChangedHub.bootstrap();
  monitorServiceStateHub.bootstrap();
  trackedUsageChangedHub.bootstrap();
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

export const invalidateNativeInstalledAppsCache = (): void => {
  getModule().invalidateNativeInstalledAppsCache();
};

export const invalidateNativeUsageCache = (): void => {
  getModule().invalidateNativeUsageCache();
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

export const subscribeTrackedUsageChanged = (
  listener: (event: TrackedUsageChangedEvent) => void,
): { remove: () => void } => trackedUsageChangedHub.subscribe(listener);
