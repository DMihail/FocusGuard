/** @format */

import { useCoreStoresHydrated } from '@/hooks/useCoreStoresHydrated';
import { useSelectedDashboardAppRows } from '@/hooks/useSelectedDashboardAppRows';
import { useUsageHistorySync } from '@/hooks/useUsageHistorySync';

type GlobalUsageHistorySyncProps = {
  enabled: boolean;
};

/** Single app-wide writer for daily usage history snapshots. */
export const GlobalUsageHistorySync = ({ enabled }: GlobalUsageHistorySyncProps) => {
  const hasCoreStoresHydrated = useCoreStoresHydrated();
  const appRows = useSelectedDashboardAppRows();

  useUsageHistorySync(appRows, enabled && hasCoreStoresHydrated);

  return null;
};
