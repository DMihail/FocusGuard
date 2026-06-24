import { useEffect, useRef } from 'react';

import { useIsFocused } from '@react-navigation/native';

import { logDevWarning } from '@/utils/logDevWarning';
import { getLocalDayKey, getMsUntilNextLocalMidnight } from '@/utils/usage/localDayKey';

const DAY_CHECK_INTERVAL_MS = 60_000;

/** Refreshes usage when the local calendar day changes while the screen stays open. */
export const useLocalDayChangeRefresh = (refresh: () => void | Promise<void>): void => {
  const isFocused = useIsFocused();
  const dayKeyRef = useRef(getLocalDayKey());

  useEffect(() => {
    if (!isFocused) {
      return undefined;
    }

    const runIfDayChanged = () => {
      const nextDayKey = getLocalDayKey();

      if (nextDayKey === dayKeyRef.current) {
        return;
      }

      dayKeyRef.current = nextDayKey;
      Promise.resolve(refresh()).catch(logDevWarning);
    };

    const intervalId = setInterval(runIfDayChanged, DAY_CHECK_INTERVAL_MS);

    let midnightTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleMidnightCheck = () => {
      midnightTimeoutId = setTimeout(() => {
        runIfDayChanged();
        scheduleMidnightCheck();
      }, getMsUntilNextLocalMidnight() + 50);
    };

    scheduleMidnightCheck();

    return () => {
      clearInterval(intervalId);

      if (midnightTimeoutId !== undefined) {
        clearTimeout(midnightTimeoutId);
      }
    };
  }, [isFocused, refresh]);
};
