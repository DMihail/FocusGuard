import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeUsageStats.android';

export const getNativeUsageStats = (): Spec => TurboModuleRegistry.getEnforcing<Spec>('NativeUsageStats');
