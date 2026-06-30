/** @format */

import { useSelectedDashboardAppRows } from '@/context/SelectedDashboardAppRowsProvider';
import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { useUsageHistorySync } from '@/hooks/useUsageHistorySync';
import { usageHistoryStore } from '@/store';

type GlobalUsageHistorySyncProps = {
  enabled: boolean;
};

/** Single app-wide writer for daily usage history snapshots. */
export const GlobalUsageHistorySync = ({ enabled }: GlobalUsageHistorySyncProps) => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const hasUsageHistoryHydrated = usePersistHydrated(usageHistoryStore);
  const appRows = useSelectedDashboardAppRows();

  useUsageHistorySync(appRows, enabled && hasCoreStoresHydrated && hasUsageHistoryHydrated);

  return null;
};
