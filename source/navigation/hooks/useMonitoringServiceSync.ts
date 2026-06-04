/** @format */

import { useCallback, useEffect } from 'react';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { isMonitorServiceRunning } from '@/specs';
import { monitoringStore } from '@/store';

/** Keeps `isMonitoring` in sync when the foreground service was stopped outside the app. */
export const useMonitoringServiceSync = (isEnabled: boolean): void => {
  const sync = useCallback(() => {
    if (!isEnabled) {
      return;
    }

    if (!isMonitorServiceRunning() && monitoringStore.getState().isMonitoring) {
      monitoringStore.setState({ isMonitoring: false });
    }
  }, [isEnabled]);

  useEffect(() => {
    sync();
  }, [sync]);

  useAppStateOnActive(sync);
};
