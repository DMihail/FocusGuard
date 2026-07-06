import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeKeeptTurboModule.android';

export const getKeeptTurboModule = (): Spec => TurboModuleRegistry.getEnforcing<Spec>('KeeptTurboModule');
