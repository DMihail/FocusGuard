/** @format */

import { useCallback, useRef } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { subscribeLocalDayChanged } from '@/specs';
import { runCoalescedLocalDayChangeRefresh } from '@/store/usageDayChangeCoordinator';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

/** Refreshes usage when the local calendar day changes while the screen stays open. */
export const useLocalDayChangeRefresh = (refresh: () => void | Promise<void>): void => {
  const isFocused = useIsFocused();
  const dayKeyRef = useRef(getLocalDayKey());
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  const refreshIfDayChanged = useCallback(() => {
    const currentDayKey = getLocalDayKey();
    if (currentDayKey === dayKeyRef.current) {
      return;
    }

    dayKeyRef.current = currentDayKey;
    runCoalescedLocalDayChangeRefresh(currentDayKey, () => refreshRef.current());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshIfDayChanged();

      const subscription = subscribeLocalDayChanged((event) => {
        if (event.dayKey === dayKeyRef.current) {
          return;
        }

        dayKeyRef.current = event.dayKey;
        runCoalescedLocalDayChangeRefresh(event.dayKey, () => refreshRef.current());
      });

      return () => {
        subscription.remove();
      };
    }, [refreshIfDayChanged]),
  );

  useAppStateOnActive(
    useCallback(() => {
      if (isFocused) {
        refreshIfDayChanged();
      }
    }, [isFocused, refreshIfDayChanged]),
  );
};
