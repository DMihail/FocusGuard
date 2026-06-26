/** @format */

import { useEffect } from 'react';

import { prefetchInstalledApps } from '@/domain/installedAppsCatalog';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';

/** Warms native catalogs during onboarding / permissions so later screens open instantly. */
export const usePrefetchNativeCatalogs = (): void => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();

  useEffect(() => {
    if (!hasCoreStoresHydrated) {
      return;
    }

    prefetchInstalledApps();
  }, [hasCoreStoresHydrated]);
};
