import { Platform, TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeUsageStats';

/** Android requires the Turbo Module; iOS uses a soft lookup for the monitoring stub. */
export const getNativeUsageStats = (): Spec | null => {
  if (Platform.OS === 'android') {
    return TurboModuleRegistry.getEnforcing<Spec>('NativeUsageStats');
  }

  return TurboModuleRegistry.get<Spec>('NativeUsageStats');
};
