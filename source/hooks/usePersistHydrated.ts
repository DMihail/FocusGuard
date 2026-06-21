/** @format */

import { useSyncExternalStore } from 'react';

type PersistCapableStore = {
  persist?: {
    hasHydrated: () => boolean;
    onFinishHydration: (callback: () => void) => () => void;
  };
};

/** Subscribes to Zustand persist hydration without an extra effect-driven render. */
export const usePersistHydrated = (store: PersistCapableStore, serverFallback = true): boolean =>
  useSyncExternalStore(
    (onStoreChange) => store.persist?.onFinishHydration(onStoreChange) ?? (() => undefined),
    () => store.persist?.hasHydrated() ?? serverFallback,
    () => serverFallback,
  );
