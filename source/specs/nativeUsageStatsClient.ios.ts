import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeUsageStats.ios';

export const getNativeUsageStats = (): Spec | null => TurboModuleRegistry.get<Spec>('NativeUsageStats');
