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

/** Sole owner of monitor-session restore: after hydrate (cold start), foreground, and native stop. */
export const useMonitoringServiceSync = (isEnabled: boolean): void => {
  const sync = useCallback(() => {
    if (!isEnabled || !monitoringStore.persist.hasHydrated()) {
      return;
    }

    scheduleMonitoringReconcile();
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }

    if (monitoringStore.persist.hasHydrated()) {
      scheduleMonitoringReconcile();
      return undefined;
    }

    return monitoringStore.persist.onFinishHydration(() => {
      scheduleMonitoringReconcile();
    });
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
