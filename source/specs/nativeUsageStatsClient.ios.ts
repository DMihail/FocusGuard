import { TurboModuleRegistry } from 'react-native';

import type { Spec } from './NativeUsageStats';

/** iOS uses a soft lookup so the app can run before native Screen Time is wired. */
export const getNativeUsageStats = (): Spec | null => TurboModuleRegistry.get<Spec>('NativeUsageStats');
