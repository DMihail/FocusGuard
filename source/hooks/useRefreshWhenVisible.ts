/** @format */

import { useCallback } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { logDevWarning } from '@/utils/logDevWarning';

import { useAppStateOnActive } from './useAppStateOnActive';

type RefreshWhenVisibleOptions = {
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

  const run = useCallback(() => {
    Promise.resolve(refresh()).catch(logDevWarning);
  }, [refresh]);

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
