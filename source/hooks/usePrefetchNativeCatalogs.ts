/** @format */

import { useEffect } from 'react';

import { prefetchInstalledApps } from '@/domain/installedAppsCatalog';
import { prefetchUsageStats } from '@/domain/usageStatsCatalog';

/** Warms native catalogs during onboarding / permissions so later screens open instantly. */
export const usePrefetchNativeCatalogs = (): void => {
  useEffect(() => {
    prefetchInstalledApps();
    prefetchUsageStats();
  }, []);
};
