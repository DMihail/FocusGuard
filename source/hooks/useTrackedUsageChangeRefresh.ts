/** @format */

import { useCallback, useRef } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { subscribeTrackedUsageChanged } from '@/specs';

import { useCoalescedAsyncRunner } from './useCoalescedAsyncRunner';

/** Soft-refreshes usage while the screen is focused and native monitoring emits live deltas. */
export const useTrackedUsageChangeRefresh = (refresh: () => void | Promise<void>, enabled = true): void => {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  const run = useCoalescedAsyncRunner(() => refreshRef.current());

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
