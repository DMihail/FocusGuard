import { useCallback, useRef } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { reportError } from '@/crashlytics/reportError';

import { useAppStateOnActive } from './useAppStateOnActive';

export type RefreshWhenVisibleOptions = {
  onFocus?: boolean;
  onAppActive?: boolean;
  onlyWhenFocusedOnAppActive?: boolean;
};

/** Refreshes data on screen focus and when the app returns to the foreground. */
export const useRefreshWhenVisible = (
  refresh: () => void | Promise<void>,
  { onFocus = true, onAppActive = true, onlyWhenFocusedOnAppActive = true }: RefreshWhenVisibleOptions = {},
): void => {
  const isFocused = useIsFocused();
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

  const runWhenFocused = useCallback(() => {
    if (!isFocused) {
      return;
    }

    run();
  }, [isFocused, run]);

  useFocusEffect(
    useCallback(() => {
      if (onFocus) {
        run();
      }
    }, [onFocus, run]),
  );

  useAppStateOnActive(
    useCallback(() => {
      if (!onAppActive) {
        return;
      }

      if (onlyWhenFocusedOnAppActive) {
        runWhenFocused();
        return;
      }

      run();
    }, [onAppActive, onlyWhenFocusedOnAppActive, run, runWhenFocused]),
  );
};
