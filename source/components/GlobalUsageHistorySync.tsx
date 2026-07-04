/** @format */

import { useCoreStoresHydrated } from '@/context/CoreStoresHydrationProvider';
import { useSelectedDashboardAppRows } from '@/context/SelectedDashboardAppRowsProvider';
import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { useUsageHistorySync } from '@/hooks/useUsageHistorySync';
import { usageHistoryStore } from '@/store';

/** Single app-wide writer for daily usage history snapshots. */
export const GlobalUsageHistorySync = () => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const hasUsageHistoryHydrated = usePersistHydrated(usageHistoryStore);
  const appRows = useSelectedDashboardAppRows();

  useUsageHistorySync(appRows, hasCoreStoresHydrated && hasUsageHistoryHydrated);

  return null;
};
