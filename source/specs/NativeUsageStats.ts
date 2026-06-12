import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

import type { InstallApp, MonitorServiceStartResult, PackageUsage } from './types';

export type { InstallApp, MonitorServiceFailureReason, MonitorServiceStartResult, PackageUsage } from './types';

export type PermissionsChangedEvent = {
  changedAtMs: number;
};

type MonitorServiceStartResultCodegen = {
  started: boolean;
  reason?: string;
};

export interface Spec extends TurboModule {
  readonly onPermissionsChanged: EventEmitter<PermissionsChangedEvent>;
  checkForPermission(): boolean;
  checkForSystemAlertWindowPermission(): boolean;
  checkForNotificationsPermission(): boolean;
  checkForIgnoreBatteryOptimizationsPermission(): boolean;
  checkForManifestMonitorPermissions(): boolean;
  startMonitorService(): MonitorServiceStartResultCodegen;
  stopMonitorService(): void;
  isMonitorServiceRunning(): boolean;
  requestUsageStatsPermission(): void;
  requestSystemAlertWindowPermission(): void;
  requestNotificationsPermission(): void;
  openNotificationsSettings(): void;
  requestIgnoreBatteryOptimizationsPermission(): void;
  getPackagesUsageToday(packageNames: string[]): Promise<PackageUsage[]>;
  getInstalledApplications(): Promise<InstallApp[]>;
  getAppDisplayName(): string;
  getAppVersion(): string;
  invalidateNativeCatalogCaches(): void;
}

const usageStats = TurboModuleRegistry.get<Spec>('NativeUsageStats');

const MONITOR_SERVICE_NOT_STARTED: MonitorServiceStartResult = {
  started: false,
  reason: 'manifest_permissions_missing',
};

export const checkForPermission = (): boolean => usageStats?.checkForPermission() ?? false;

export const checkForSystemAlertWindowPermission = (): boolean =>
  usageStats?.checkForSystemAlertWindowPermission() ?? false;

export const checkForNotificationsPermission = (): boolean => usageStats?.checkForNotificationsPermission() ?? false;

export const checkForIgnoreBatteryOptimizationsPermission = (): boolean =>
  usageStats?.checkForIgnoreBatteryOptimizationsPermission() ?? false;

export const checkForManifestMonitorPermissions = (): boolean =>
  usageStats?.checkForManifestMonitorPermissions() ?? false;

export const startMonitorService = (): MonitorServiceStartResult => {
  const result = usageStats?.startMonitorService();

  if (!result) {
    return MONITOR_SERVICE_NOT_STARTED;
  }

  return result as MonitorServiceStartResult;
};

export const stopMonitorService = (): void => {
  usageStats?.stopMonitorService();
};

export const isMonitorServiceRunning = (): boolean => usageStats?.isMonitorServiceRunning() ?? false;

export const requestUsageStatsPermission = (): void => {
  usageStats?.requestUsageStatsPermission();
};

export const requestSystemAlertWindowPermission = (): void => {
  usageStats?.requestSystemAlertWindowPermission();
};

export const requestNotificationsPermission = (): void => {
  usageStats?.requestNotificationsPermission();
};

export const openNotificationsSettings = (): void => {
  usageStats?.openNotificationsSettings();
};

export const requestIgnoreBatteryOptimizationsPermission = (): void => {
  usageStats?.requestIgnoreBatteryOptimizationsPermission();
};

export const getPackagesUsageToday = async (packageNames: readonly string[]): Promise<PackageUsage[]> =>
  (await usageStats?.getPackagesUsageToday([...packageNames])) ?? [];

export const getInstalledApplications = async (): Promise<InstallApp[]> =>
  (await usageStats?.getInstalledApplications()) ?? [];

export const getAppDisplayName = (): string => usageStats?.getAppDisplayName()?.trim() ?? '';

export const getAppVersion = (): string => usageStats?.getAppVersion()?.trim() ?? '';

export const invalidateNativeCatalogCaches = (): void => {
  usageStats?.invalidateNativeCatalogCaches();
};

export const subscribePermissionsChanged = (listener: () => void): { remove: () => void } => {
  const subscription = usageStats?.onPermissionsChanged(() => {
    listener();
  });

  return {
    remove: () => {
      subscription?.remove();
    },
  };
};
