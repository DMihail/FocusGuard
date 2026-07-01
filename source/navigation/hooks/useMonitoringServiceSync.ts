/** @format */

import { useCallback, useEffect } from 'react';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { subscribeMonitorServiceStateChanged } from '@/specs';
import { monitoringStore, restoreMonitoringSession } from '@/store/monitoringStore';
import { scheduleMicrotask } from '@/utils/scheduleMicrotask';

let reconcileScheduled = false;

const scheduleMonitoringReconcile = (): void => {
  if (reconcileScheduled) {
    return;
  }

  reconcileScheduled = true;
  scheduleMicrotask(() => {
    reconcileScheduled = false;
    restoreMonitoringSession();
  });
};

/** Reconciles the persisted focus session when the app returns to the foreground. */
export const useMonitoringServiceSync = (isEnabled: boolean): void => {
  const sync = useCallback(() => {
    if (!isEnabled || !monitoringStore.persist.hasHydrated()) {
      return;
    }

    scheduleMonitoringReconcile();
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
        scheduleMonitoringReconcile();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isEnabled]);
};

/** @internal */
export const resetMonitoringReconcileSchedulerForTests = (): void => {
  reconcileScheduled = false;
};
