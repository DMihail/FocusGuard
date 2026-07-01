/** @format */

import { useCallback, useEffect } from 'react';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { subscribeMonitorServiceStateChanged } from '@/specs';
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

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    const subscription = subscribeMonitorServiceStateChanged((event) => {
      if (!monitoringStore.persist.hasHydrated()) {
        return;
      }

      if (!event.isRunning && monitoringStore.getState().isMonitoring) {
        restoreMonitoringSession();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isEnabled]);
};
