import { createNativeEventHub } from './createNativeEventHub';
import { getKeeptTurboModule } from './keeptTurboModuleClient.ios';
import type { Spec } from './NativeKeeptTurboModule.ios';
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

const getModule = (): Spec | null => getKeeptTurboModule();

const MONITOR_NOT_STARTED: MonitorServiceStartResult = {
  started: false,
  reason: 'screen_time_unauthorized',
};

const createModuleEventHub = <T>(register: (module: Spec, listener: (event: T) => void) => boolean) =>
  createNativeEventHub<T>((listener) => {
    const module = getModule();
    return module != null && register(module, listener);
  });

const permissionsChangedHub = createModuleEventHub<PermissionsChangedEvent>((module, listener) => {
  if (!module.onPermissionsChanged) {
    return false;
  }
  module.onPermissionsChanged(listener);
  return true;
});

const localDayChangedHub = createModuleEventHub<LocalDayChangedEvent>((module, listener) => {
  if (!module.onLocalDayChanged) {
    return false;
  }
  module.onLocalDayChanged(listener);
  return true;
});

const monitorServiceStateHub = createModuleEventHub<MonitorServiceStateChangedEvent>((module, listener) => {
  if (!module.onMonitorServiceStateChanged) {
    return false;
  }
  module.onMonitorServiceStateChanged(listener);
  return true;
});

const trackedUsageChangedHub = createModuleEventHub<TrackedUsageChangedEvent>((module, listener) => {
  if (!module.onTrackedUsageChanged) {
    return false;
  }
  module.onTrackedUsageChanged(listener);
  return true;
});

export const bootstrapKeeptTurboModuleEvents = (): void => {
  permissionsChangedHub.bootstrap();
  localDayChangedHub.bootstrap();
  monitorServiceStateHub.bootstrap();
  trackedUsageChangedHub.bootstrap();
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

export const invalidateNativeInstalledAppsCache = (): void => {
  getModule()?.invalidateNativeInstalledAppsCache();
};

export const invalidateNativeUsageCache = (): void => {
  getModule()?.invalidateNativeUsageCache();
};

export const syncTrackingConfig = (snapshotJson: string): void => {
  getModule()?.syncTrackingConfig(snapshotJson);
};

export const syncMonitoringState = (snapshotJson: string): void => {
  getModule()?.syncMonitoringState(snapshotJson);
};

export const syncSettingsConfig = (snapshotJson: string): void => {
  getModule()?.syncSettingsConfig(snapshotJson);
};

export const presentFamilyActivityPicker = async (): Promise<InstallApp[]> =>
  (await getModule()?.presentFamilyActivityPicker()) ?? [];

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
