/** @format */

import { useCallback, useEffect, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

import { subscribeAppForeground } from '@/runtime/appForegroundBus';
import { subscribeLocalDayChanged } from '@/specs';
import { logDevWarning } from '@/utils/logDevWarning';
import { getLocalDayKey } from '@/utils/usage/localDayKey';

/** Refreshes usage when the local calendar day changes while the screen stays open. */
export const useLocalDayChangeRefresh = (refresh: () => void | Promise<void>): void => {
  const isFocused = useIsFocused();
  const dayKeyRef = useRef(getLocalDayKey());
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  const runIfDayChanged = useCallback(() => {
    const nextDayKey = getLocalDayKey();

    if (nextDayKey === dayKeyRef.current) {
      return;
    }

    dayKeyRef.current = nextDayKey;
    Promise.resolve(refreshRef.current()).catch(logDevWarning);
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return undefined;
    }

    const nativeSubscription = subscribeLocalDayChanged((event) => {
      if (event.dayKey === dayKeyRef.current) {
        return;
      }

      dayKeyRef.current = event.dayKey;
      Promise.resolve(refreshRef.current()).catch(logDevWarning);
    });

    const unsubscribeForeground = subscribeAppForeground(runIfDayChanged);

    return () => {
      nativeSubscription.remove();
      unsubscribeForeground();
    };
  }, [isFocused, runIfDayChanged]);
};
