/** @format */

import { useCallback, useEffect } from 'react';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { monitoringStore, restoreMonitoringSession } from '@/store/monitoringStore';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

/** Restores or reconciles the persisted focus session after hydration and app resume. */
export const useMonitoringServiceSync = (isEnabled: boolean): void => {
  const sync = useCallback(() => {
    if (!isEnabled || !monitoringStore.persist.hasHydrated()) {
      return;
    }

    restoreMonitoringSession();
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const unsubscribeHydration = monitoringStore.persist.onFinishHydration(sync);
    scheduleAfterInteractions(sync);

    return unsubscribeHydration;
  }, [isEnabled, sync]);

  useAppStateOnActive(sync);
};
