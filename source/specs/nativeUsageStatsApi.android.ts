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

const permissionsChangedListeners = new Set<(event: PermissionsChangedEvent) => void>();
const localDayChangedListeners = new Set<(event: LocalDayChangedEvent) => void>();
const monitorServiceStateListeners = new Set<(event: MonitorServiceStateChangedEvent) => void>();

let hasNativePermissionsChangedSubscription = false;
let hasNativeLocalDayChangedSubscription = false;
let hasNativeMonitorServiceStateSubscription = false;

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

const ensureNativeLocalDayChangedSubscription = (): void => {
  if (hasNativeLocalDayChangedSubscription) {
    return;
  }

  getModule().onLocalDayChanged((event) => {
    for (const listener of localDayChangedListeners) {
      listener(event);
    }
  });
  hasNativeLocalDayChangedSubscription = true;
};

const ensureNativeMonitorServiceStateSubscription = (): void => {
  if (hasNativeMonitorServiceStateSubscription) {
    return;
  }

  getModule().onMonitorServiceStateChanged((event) => {
    for (const listener of monitorServiceStateListeners) {
      listener(event);
    }
  });
  hasNativeMonitorServiceStateSubscription = true;
};

/** Registers Turbo Module event callbacks before React mounts any screen. */
export const bootstrapNativeUsageEvents = (): void => {
  ensureNativePermissionsChangedSubscription();
  ensureNativeLocalDayChangedSubscription();
  ensureNativeMonitorServiceStateSubscription();
};

/** @deprecated Use bootstrapNativeUsageEvents */
export const bootstrapPermissionsChangedEvents = (): void => {
  bootstrapNativeUsageEvents();
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

export const subscribeLocalDayChanged = (listener: (event: LocalDayChangedEvent) => void): { remove: () => void } => {
  ensureNativeLocalDayChangedSubscription();
  localDayChangedListeners.add(listener);

  return {
    remove: () => {
      localDayChangedListeners.delete(listener);
    },
  };
};

export const subscribeMonitorServiceStateChanged = (
  listener: (event: MonitorServiceStateChangedEvent) => void,
): { remove: () => void } => {
  ensureNativeMonitorServiceStateSubscription();
  monitorServiceStateListeners.add(listener);

  return {
    remove: () => {
      monitorServiceStateListeners.delete(listener);
    },
  };
};
