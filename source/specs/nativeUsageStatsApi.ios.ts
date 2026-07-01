import type { Spec } from './NativeUsageStats.ios';
import { getNativeUsageStats } from './nativeUsageStatsClient.ios';
import type {
  InstallApp,
  LocalDayChangedEvent,
  MonitorServiceStartResult,
  MonitorServiceStateChangedEvent,
  PackageUsage,
} from './types';

export type {
  InstallApp,
  LocalDayChangedEvent,
  MonitorServiceStartResult,
  MonitorServiceStateChangedEvent,
  PackageUsage,
} from './types';

type PermissionsChangedEvent = Readonly<{
  changedAtMs: number;
}>;

const getModule = (): Spec | null => getNativeUsageStats();

const MONITOR_NOT_STARTED: MonitorServiceStartResult = {
  started: false,
  reason: 'screen_time_unauthorized',
};

type NativeEventHub<T> = {
  bootstrap: () => void;
  subscribe: (listener: (event: T) => void) => { remove: () => void };
};

const createNativeEventHub = <T>(registerNativeListener: (listener: (event: T) => void) => void): NativeEventHub<T> => {
  const listeners = new Set<(event: T) => void>();
  let hasNativeSubscription = false;

  const bootstrap = (): void => {
    if (hasNativeSubscription) {
      return;
    }

    registerNativeListener((event) => {
      for (const listener of listeners) {
        listener(event);
      }
    });
    hasNativeSubscription = true;
  };

  return {
    bootstrap,
    subscribe: (listener) => {
      bootstrap();
      listeners.add(listener);

      return {
        remove: () => {
          listeners.delete(listener);
        },
      };
    },
  };
};

const permissionsChangedHub = createNativeEventHub<PermissionsChangedEvent>((listener) => {
  getModule()?.onPermissionsChanged?.(listener);
});

const localDayChangedHub = createNativeEventHub<LocalDayChangedEvent>((listener) => {
  getModule()?.onLocalDayChanged?.(listener);
});

const monitorServiceStateHub = createNativeEventHub<MonitorServiceStateChangedEvent>((listener) => {
  getModule()?.onMonitorServiceStateChanged?.(listener);
});

export const bootstrapNativeUsageEvents = (): void => {
  permissionsChangedHub.bootstrap();
  localDayChangedHub.bootstrap();
  monitorServiceStateHub.bootstrap();
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

export const subscribePermissionsChanged = (listener: () => void): { remove: () => void } =>
  permissionsChangedHub.subscribe(() => {
    listener();
  });

export const subscribeLocalDayChanged = (listener: (event: LocalDayChangedEvent) => void): { remove: () => void } =>
  localDayChangedHub.subscribe(listener);

export const subscribeMonitorServiceStateChanged = (
  listener: (event: MonitorServiceStateChangedEvent) => void,
): { remove: () => void } => monitorServiceStateHub.subscribe(listener);
