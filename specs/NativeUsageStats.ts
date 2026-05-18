/** @format */

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  checkForPermission(): boolean;
  requestUsageStatsPermission(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('UsageStats');
