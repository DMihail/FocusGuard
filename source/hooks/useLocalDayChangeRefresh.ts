/** @format */

import { useEffect, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

import { reportError } from '@/crashlytics/reportError';
import { subscribeLocalDayChanged } from '@/specs';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

/** Refreshes usage when the local calendar day changes while the screen stays open. */
export const useLocalDayChangeRefresh = (refresh: () => void | Promise<void>): void => {
  const isFocused = useIsFocused();
  const dayKeyRef = useRef(getLocalDayKey());
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    if (!isFocused) {
      return undefined;
    }

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
  }, [isFocused]);
};
