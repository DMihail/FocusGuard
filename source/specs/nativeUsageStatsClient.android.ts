import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeUsageStats';

/** Android requires the Turbo Module at runtime. */
export const getNativeUsageStats = (): Spec | null => TurboModuleRegistry.getEnforcing<Spec>('NativeUsageStats');
