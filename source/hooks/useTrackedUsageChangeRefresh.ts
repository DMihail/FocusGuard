/** @format */

import { useCallback, useRef } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { reportError } from '@/crashlytics/reportError';
import { subscribeTrackedUsageChanged } from '@/specs';

/** Soft-refreshes usage while the screen is focused and native monitoring emits live deltas. */
export const useTrackedUsageChangeRefresh = (refresh: () => void | Promise<void>, enabled = true): void => {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useFocusEffect(
    useCallback(() => {
      if (!enabled) {
        return undefined;
      }

      const subscription = subscribeTrackedUsageChanged(() => {
        Promise.resolve(refreshRef.current()).catch(reportError);
      });

      return () => {
        subscription.remove();
      };
    }, [enabled]),
  );
};
