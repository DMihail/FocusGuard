/** @format */

import { useEffect, useEffectEvent, useMemo } from 'react';

import { usageHistoryStore } from '@/store';
import { buildAppRowsSnapshotKey } from '@/utils/usage/appRowsSnapshotKey';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';
import { getLocalDayKey } from '@/utils/usage/localDayKey';
import { buildTodayHistoryEntry } from '@/utils/usage/statistics';

/** Persists today's usage snapshot for statistics charts. */
export const useUsageHistorySync = (appRows: DashboardAppRow[], enabled = true): void => {
  const snapshotKey = useMemo(() => (enabled ? buildAppRowsSnapshotKey(appRows) : ''), [appRows, enabled]);
  const recordCurrentRows = useEffectEvent(() => {
    const dayKey = getLocalDayKey();
    const entry = buildTodayHistoryEntry(appRows);

    if (!entry) {
      usageHistoryStore.getState().clearDay(dayKey);
      return;
    }

    usageHistoryStore.getState().recordDay(dayKey, entry);
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    recordCurrentRows();
  }, [enabled, snapshotKey]);
};
