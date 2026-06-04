/** @format */

import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';

import type { AppUsageStat, InstallApp } from './types';

export type { AppUsageStat, InstallApp } from './types';

/**
 * Turbo Module spec for `NativeUsageStats`.
 *
 * Exposes Android-specific APIs for permission management, usage statistics,
 * and the background monitoring service to the JS layer.
 */
export interface Spec extends TurboModule {
  /** @returns `true` if Usage Stats access is granted. */
  checkForPermission(): boolean;
  /** @returns `true` if the app can draw overlays (API 23+). */
  checkForSystemAlertWindowPermission(): boolean;
  /** @returns `true` if `POST_NOTIFICATIONS` is granted (API 33+, always `true` below). */
  checkForNotificationsPermission(): boolean;
  /** @returns `true` if the app is excluded from battery optimizations (API 23+). */
  checkForIgnoreBatteryOptimizationsPermission(): boolean;
  /** @returns `true` if all install-time manifest permissions (FGS, boot receiver) are granted. */
  checkForManifestMonitorPermissions(): boolean;
  /** Starts `FocusGuardMonitorService` as a foreground service with `TrackingEngine`. */
  startMonitorService(): void;
  /** Stops `FocusGuardMonitorService`, its `TrackingEngine`, and removes the notification. */
  stopMonitorService(): void;
  /** @returns `true` while the monitor foreground service is running. */
  isMonitorServiceRunning(): boolean;
  /** Opens the system Usage Stats settings screen. */
  requestUsageStatsPermission(): void;
  /** Opens the system overlay permission screen (API 23+). */
  requestSystemAlertWindowPermission(): void;
  /** Requests `POST_NOTIFICATIONS` runtime permission (API 33+). */
  requestNotificationsPermission(): void;
  /** Opens the system notification settings for this app. */
  openNotificationsSettings(): void;
  /** Requests the user to disable battery optimizations (API 23+). */
  requestIgnoreBatteryOptimizationsPermission(): void;
  /** @returns per-app foreground usage stats for the current local day, sorted by time descending. */
  getAppsUsageStats(): AppUsageStat[];
  /** @returns all launchable apps on the device (excluding this app). */
  getInstalledApplications(): InstallApp[];
}

const usageStats = TurboModuleRegistry.get<Spec>('NativeUsageStats');

/** @returns `true` if Usage Stats access is granted. */
export const checkForPermission = (): boolean => usageStats?.checkForPermission() ?? false;

/** @returns `true` if the app can draw overlays on top of other apps. */
export const checkForSystemAlertWindowPermission = (): boolean =>
  usageStats?.checkForSystemAlertWindowPermission() ?? false;

/** @returns `true` if `POST_NOTIFICATIONS` is granted. */
export const checkForNotificationsPermission = (): boolean => usageStats?.checkForNotificationsPermission() ?? false;

/** @returns `true` if the app is excluded from battery optimizations. */
export const checkForIgnoreBatteryOptimizationsPermission = (): boolean =>
  usageStats?.checkForIgnoreBatteryOptimizationsPermission() ?? false;

/** @returns `true` if all manifest permissions required by the monitor service are granted. */
export const checkForManifestMonitorPermissions = (): boolean =>
  usageStats?.checkForManifestMonitorPermissions() ?? false;

/** Starts the background monitoring service with `TrackingEngine`. */
export const startMonitorService = (): void => {
  usageStats?.startMonitorService();
};

/** Stops the background monitoring service and removes the notification. */
export const stopMonitorService = (): void => {
  usageStats?.stopMonitorService();
};

/** @returns `true` while the monitor foreground service is running. */
export const isMonitorServiceRunning = (): boolean => usageStats?.isMonitorServiceRunning() ?? false;

/** Opens the system Usage Stats settings screen. */
export const requestUsageStatsPermission = (): void => {
  usageStats?.requestUsageStatsPermission();
};

/** Opens the system overlay permission screen. */
export const requestSystemAlertWindowPermission = (): void => {
  usageStats?.requestSystemAlertWindowPermission();
};

/** Requests the `POST_NOTIFICATIONS` runtime permission. */
export const requestNotificationsPermission = (): void => {
  usageStats?.requestNotificationsPermission();
};

/** Opens the system notification settings for this app. */
export const openNotificationsSettings = (): void => {
  usageStats?.openNotificationsSettings();
};

/** Requests the user to disable battery optimizations. */
export const requestIgnoreBatteryOptimizationsPermission = (): void => {
  usageStats?.requestIgnoreBatteryOptimizationsPermission();
};

/** @returns per-app foreground usage stats for the current local day, sorted by time descending. */
export const getAppsUsageStats = (): AppUsageStat[] => usageStats?.getAppsUsageStats() ?? [];

/** @returns all launchable apps installed on the device (excluding this app). */
export const getInstalledApplications = (): InstallApp[] => usageStats?.getInstalledApplications() ?? [];
