import { subscribeAppForeground } from '@/runtime/appForegroundBus';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

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

const getModule = (): Spec | null => getNativeUsageStats();

const MONITOR_NOT_STARTED: MonitorServiceStartResult = {
  started: false,
  reason: 'screen_time_unauthorized',
};

const localDayChangedListeners = new Set<(event: LocalDayChangedEvent) => void>();
const monitorServiceStateListeners = new Set<(event: MonitorServiceStateChangedEvent) => void>();

let hasNativeLocalDayChangedSubscription = false;
let hasNativeMonitorServiceStateSubscription = false;

const ensureNativeLocalDayChangedSubscription = (): void => {
  if (hasNativeLocalDayChangedSubscription) {
    return;
  }

  getModule()?.onLocalDayChanged?.((event) => {
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

  getModule()?.onMonitorServiceStateChanged?.((event) => {
    for (const listener of monitorServiceStateListeners) {
      listener(event);
    }
  });
  hasNativeMonitorServiceStateSubscription = true;
};

export const bootstrapNativeUsageEvents = (): void => {
  ensureNativeLocalDayChangedSubscription();
  ensureNativeMonitorServiceStateSubscription();
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

export const subscribeLocalDayChanged = (listener: (event: LocalDayChangedEvent) => void): { remove: () => void } => {
  ensureNativeLocalDayChangedSubscription();
  localDayChangedListeners.add(listener);

  let lastDayKey = getLocalDayKey();
  const removeForeground = subscribeAppForeground(() => {
    const nextDayKey = getLocalDayKey();
    if (nextDayKey === lastDayKey) {
      return;
    }

    lastDayKey = nextDayKey;
    listener({ dayKey: nextDayKey, changedAtMs: Date.now() });
  });

  return {
    remove: () => {
      localDayChangedListeners.delete(listener);
      removeForeground();
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
