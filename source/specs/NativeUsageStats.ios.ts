import { TurboModuleRegistry } from 'react-native';

import type { TurboModule } from 'react-native';

import type { InstallApp, PackageUsage } from './types';

type MonitorServiceStartResultCodegen = {
  started: boolean;
  reason?: string;
};

export interface Spec extends TurboModule {
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
export default TurboModuleRegistry.get<Spec>('NativeUsageStats');
