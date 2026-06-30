/** @format */

import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { useSelectedDashboardAppRows } from '@/hooks/useSelectedDashboardAppRows';

import { useUsageHistorySync } from './useUsageHistorySync';

/** Single app-wide writer for daily usage history snapshots. */
export const useGlobalUsageHistorySync = (enabled: boolean): void => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const appRows = useSelectedDashboardAppRows();

  useUsageHistorySync(appRows, enabled && hasCoreStoresHydrated);
};
