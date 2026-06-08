/** @format */

import { useInstalledAppsCatalog } from './useInstalledAppsCatalog';
import { useManageAppsFilters } from './useManageAppsFilters';
import { useManageAppsSelection } from './useManageAppsSelection';

/** Composes catalog loading, list filters, and selection state for Manage Apps. */
export const useManageApps = () => {
  const { installedApps, isLoadingApps, refreshInstalledApps } = useInstalledAppsCatalog();
  const filters = useManageAppsFilters({ installedApps });
  const selection = useManageAppsSelection();

  return {
    ...filters,
    isLoadingApps,
    refreshInstalledApps,
    ...selection,
  };
};
