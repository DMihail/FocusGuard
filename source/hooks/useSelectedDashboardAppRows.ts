/** @format */

import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { pickLimitsForSelectedApps, pickUsageForSelectedApps } from '@/store/utils/pickSelectedAppSlices';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

/** Selected-app usage rows without refresh lifecycle side effects. */
export const useSelectedDashboardAppRows = (): DashboardAppRow[] => {
  const selectedApps = selectedAppsStore((state) => state.apps);
  const selectedAppKeys = useMemo(() => selectedApps.map((app) => getManageAppKey(app)), [selectedApps]);
  const usageByPackage = trackedUsageStore(
    useShallow((state) => pickUsageForSelectedApps(state.usageByPackage, selectedAppKeys)),
  );
  const limitsByAppKey = appLimitsStore(
    useShallow((state) => pickLimitsForSelectedApps(state.limitsByAppKey, selectedAppKeys)),
  );

  return useMemo(
    () => buildDashboardAppRows(selectedApps, limitsByAppKey, usageByPackage),
    [limitsByAppKey, selectedApps, usageByPackage],
  );
};
