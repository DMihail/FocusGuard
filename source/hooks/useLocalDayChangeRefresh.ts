/** @format */

import { useCallback, useRef } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { reportError } from '@/crashlytics/reportError';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { subscribeLocalDayChanged } from '@/specs';
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
    Promise.resolve(refreshRef.current()).catch(reportError);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshIfDayChanged();

      const subscription = subscribeLocalDayChanged((event) => {
        if (event.dayKey === dayKeyRef.current) {
          return;
        }

        dayKeyRef.current = event.dayKey;
        Promise.resolve(refreshRef.current()).catch(reportError);
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
