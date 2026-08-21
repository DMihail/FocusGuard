import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeKeeptTurboModule.ios';

export const getKeeptTurboModule = (): Spec | null => TurboModuleRegistry.get<Spec>('KeeptTurboModule') ?? null;
