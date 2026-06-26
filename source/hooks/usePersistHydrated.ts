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
    (onStoreChange) => {
      const unsubscribe = store.persist?.onFinishHydration(onStoreChange) ?? (() => undefined);

      if (store.persist?.hasHydrated()) {
        onStoreChange();
      }

      return unsubscribe;
    },
    () => store.persist?.hasHydrated() ?? serverFallback,
    () => serverFallback,
  );
