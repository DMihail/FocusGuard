/** @format */

import { useCallback } from 'react';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { monitoringStore, restoreMonitoringSession } from '@/store/monitoringStore';

/** Reconciles the persisted focus session when the app returns to the foreground. */
export const useMonitoringServiceSync = (isEnabled: boolean): void => {
  const sync = useCallback(() => {
    if (!isEnabled || !monitoringStore.persist.hasHydrated()) {
      return;
    }

    restoreMonitoringSession();
  }, [isEnabled]);

  useAppStateOnActive(sync);
};
