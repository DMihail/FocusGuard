/** @format */

import { useEffect } from 'react';

import { prefetchInstalledApps } from '@/domain/installedAppsCatalog';
import { prefetchUsageStats } from '@/domain/usageStatsCatalog';
import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { selectedAppsStore } from '@/store';

/** Warms native catalogs during onboarding / permissions so later screens open instantly. */
export const usePrefetchNativeCatalogs = (): void => {
  const hasSelectedAppsHydrated = usePersistHydrated(selectedAppsStore);

  useEffect(() => {
    if (!hasSelectedAppsHydrated) {
      return;
    }

    prefetchInstalledApps();
    prefetchUsageStats();
  }, [hasSelectedAppsHydrated]);
};
