/**
 * Ambient types for RN codegen deep imports.
 * Strict TypeScript API (0.87+) blocks `react-native/Libraries/*` unless
 * `react-native-legacy-deep-imports` is enabled; codegen still requires this path.
 */
declare module 'react-native/Libraries/Types/CodegenTypes' {
  import type { EventSubscription } from 'react-native';

  export type EventEmitter<T> = (handler: (arg: T) => void | Promise<void>) => EventSubscription;

  export type Double = number;
  export type Float = number;
  export type Int32 = number;
  export type UnsafeObject = object;
  export type UnsafeMixed = unknown;
}
