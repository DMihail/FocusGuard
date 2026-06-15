import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeUsageStats.android';

export const getNativeUsageStats = (): Spec | null => TurboModuleRegistry.getEnforcing<Spec>('NativeUsageStats');
