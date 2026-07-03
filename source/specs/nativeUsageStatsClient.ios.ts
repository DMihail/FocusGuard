import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeKeeptTurboModule.ios';

export const getNativeUsageStats = (): Spec | null => TurboModuleRegistry.get<Spec>('KeeptTurboModule');
