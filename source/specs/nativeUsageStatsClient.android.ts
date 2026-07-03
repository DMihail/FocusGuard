import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeKeeptTurboModule.android';

export const getNativeUsageStats = (): Spec => TurboModuleRegistry.getEnforcing<Spec>('KeeptTurboModule');
