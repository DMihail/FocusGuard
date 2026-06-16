/** @format */

import { useEffect } from 'react';

import { prefetchInstalledApps } from '@/domain/installedAppsCatalog';
import { prefetchUsageStats } from '@/domain/usageStatsCatalog';
import { selectedAppsStore } from '@/store';

/** Warms native catalogs during onboarding / permissions so later screens open instantly. */
export const usePrefetchNativeCatalogs = (): void => {
  useEffect(() => {
    const prefetch = (): void => {
      prefetchInstalledApps();
      prefetchUsageStats();
    };

    if (selectedAppsStore.persist?.hasHydrated()) {
      prefetch();
      return;
    }

    return selectedAppsStore.persist?.onFinishHydration(prefetch);
  }, []);
};
