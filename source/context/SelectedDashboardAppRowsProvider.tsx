/** @format */

import React, { createContext, type ReactNode, useContext, useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { getManageAppKey } from '@/domain/appKey';
import { appLimitsStore, selectedAppsStore, trackedUsageStore } from '@/store';
import { pickLimitsForSelectedApps, pickUsageForSelectedApps } from '@/store/utils/pickSelectedAppSlices';
import { buildDashboardAppRows, type DashboardAppRow } from '@/utils/usage/dashboardStats';

const SelectedDashboardAppRowsContext = createContext<DashboardAppRow[] | null>(null);

const useBuildSelectedDashboardAppRows = (): DashboardAppRow[] => {
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

type SelectedDashboardAppRowsProviderProps = {
  children: ReactNode;
};

/** Single Zustand subscription set for dashboard usage rows across stacked screens. */
export const SelectedDashboardAppRowsProvider = ({ children }: SelectedDashboardAppRowsProviderProps) => {
  const appRows = useBuildSelectedDashboardAppRows();

  return (
    <SelectedDashboardAppRowsContext.Provider value={appRows}>{children}</SelectedDashboardAppRowsContext.Provider>
  );
};

export const useSelectedDashboardAppRows = (): DashboardAppRow[] => {
  const appRows = useContext(SelectedDashboardAppRowsContext);

  if (appRows === null) {
    throw new Error('useSelectedDashboardAppRows must be used within SelectedDashboardAppRowsProvider');
  }

  return appRows;
};
