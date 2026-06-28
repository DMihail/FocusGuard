/** @format */

import { useEffect, useMemo, useRef } from 'react';

import { usageHistoryStore } from '@/store/usageHistoryStore';
import { buildAppRowsSnapshotKey } from '@/utils/usage/appRowsSnapshotKey';
import type { DashboardAppRow } from '@/utils/usage/dashboardStats';
import { getLocalDayKey } from '@/utils/usage/localDayKey';
import { buildTodayHistoryEntry } from '@/utils/usage/statistics';

/** Persists today's usage snapshot for statistics charts. */
export const useUsageHistorySync = (appRows: DashboardAppRow[]): void => {
  const snapshotKey = useMemo(() => buildAppRowsSnapshotKey(appRows), [appRows]);
  const appRowsRef = useRef(appRows);
  appRowsRef.current = appRows;

  useEffect(() => {
    const entry = buildTodayHistoryEntry(appRowsRef.current);

    if (!entry) {
      return;
    }

    usageHistoryStore.getState().recordDay(getLocalDayKey(), entry);
  }, [snapshotKey]);
};
