/** @format */

import { useCallback, useRef } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { reportError } from '@/crashlytics/reportError';
import { subscribeTrackedUsageChanged } from '@/specs';

/** Soft-refreshes usage while the screen is focused and native monitoring emits live deltas. */
export const useTrackedUsageChangeRefresh = (refresh: () => void | Promise<void>, enabled = true): void => {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  const inFlightRef = useRef<Promise<void> | null>(null);
  const hasPendingRef = useRef(false);

  const run = useCallback(() => {
    if (inFlightRef.current) {
      hasPendingRef.current = true;
      return;
    }

    const execute = async () => {
      await refreshRef.current();
    };

    inFlightRef.current = Promise.resolve()
      .then(execute)
      .catch(reportError)
      .finally(() => {
        inFlightRef.current = null;

        if (hasPendingRef.current) {
          hasPendingRef.current = false;
          run();
        }
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return undefined;
      }

      const subscription = subscribeTrackedUsageChanged(() => {
        run();
      });

      return () => {
        subscription.remove();
      };
    }, [enabled, run]),
  );
};
