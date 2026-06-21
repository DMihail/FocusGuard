import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

import type { InstallApp, PackageUsage } from './types';

type PermissionsChangedEventCodegen = Readonly<{
  changedAtMs: number;
}>;

type MonitorServiceStartResultCodegen = {
  started: boolean;
  reason?: string;
};

export type { PermissionsChangedEvent } from './types';

export interface Spec extends TurboModule {
  readonly onPermissionsChanged: EventEmitter<PermissionsChangedEventCodegen>;
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
  syncTrackingConfig(snapshotJson: string): void;
}

// Required by React Native codegen — must live in the same file as `Spec`.
export default TurboModuleRegistry.getEnforcing<Spec>('NativeUsageStats');
