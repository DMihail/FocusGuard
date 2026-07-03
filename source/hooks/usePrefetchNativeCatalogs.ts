/** @format */

import { useEffect } from 'react';

import { useCoreStoresHydrated } from '@/context/CoreStoresHydrationProvider';
import { prefetchInstalledApps } from '@/domain/installedAppsCatalog';

/** Warms native catalogs after core MMKV stores rehydrate so later screens open instantly. */
export const usePrefetchNativeCatalogs = (): void => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();

  useEffect(() => {
    if (!hasCoreStoresHydrated) {
      return;
    }

    prefetchInstalledApps();
  }, [hasCoreStoresHydrated]);
};
