import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

import type { InstallApp, PackageUsage } from './types';

type PermissionsChangedEventCodegen = Readonly<{
  changedAtMs: number;
}>;

type LocalDayChangedEventCodegen = Readonly<{
  dayKey: string;
  changedAtMs: number;
}>;

type MonitorServiceStateChangedEventCodegen = Readonly<{
  isRunning: boolean;
  changedAtMs: number;
}>;

type MonitorServiceStartResultCodegen = {
  started: boolean;
  reason?: string;
};

export type { LocalDayChangedEvent, MonitorServiceStateChangedEvent } from './types';

export interface Spec extends TurboModule {
  readonly onPermissionsChanged: EventEmitter<PermissionsChangedEventCodegen>;
  readonly onLocalDayChanged: EventEmitter<LocalDayChangedEventCodegen>;
  readonly onMonitorServiceStateChanged: EventEmitter<MonitorServiceStateChangedEventCodegen>;
  checkForPermission(): boolean;
  checkForNotificationsPermission(): boolean;
  startMonitorService(): MonitorServiceStartResultCodegen;
  stopMonitorService(): void;
  isMonitorServiceRunning(): boolean;
  requestUsageStatsPermission(): void;
  requestNotificationsPermission(): void;
  openNotificationsSettings(): void;
  getPackagesUsageToday(packageNames: string[]): Promise<PackageUsage[]>;
  getInstalledApplications(): Promise<InstallApp[]>;
  getAppDisplayName(): string;
  getAppVersion(): string;
  invalidateNativeCatalogCaches(): void;
  syncTrackingConfig(snapshotJson: string): void;
  requestScreenTimeAuthorization(): Promise<boolean>;
  presentFamilyActivityPicker(): Promise<InstallApp[]>;
}

// Required by React Native codegen — must live in the same file as `Spec`.
export default TurboModuleRegistry.get<Spec>('KeeptTurboModule');
