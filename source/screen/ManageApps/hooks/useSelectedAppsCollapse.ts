import { useCallback, useLayoutEffect, useState } from 'react';

import type { ManageApp } from '@/domain/types';

/**
 * Retains the last selected apps while the accordion closes so chips do not
 * vanish before the height animation finishes.
 */
export const useSelectedAppsCollapse = (apps: ManageApp[]) => {
  const isExpanded = apps.length > 0;
  const [retainedApps, setRetainedApps] = useState<ManageApp[]>([]);
  const visibleApps = isExpanded ? apps : retainedApps;
  const showContent = visibleApps.length > 0;

  const handleCollapseEnd = useCallback(() => {
    setRetainedApps([]);
  }, []);

  useLayoutEffect(() => {
    if (!isExpanded) {
      return;
    }

    setRetainedApps(apps);
  }, [apps, isExpanded]);

  return { visibleApps, showContent, isExpanded, handleCollapseEnd };
};
