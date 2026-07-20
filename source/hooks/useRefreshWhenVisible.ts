import { useCallback, useRef } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { useAppStateOnActive } from './useAppStateOnActive';
import { useCoalescedAsyncRunner } from './useCoalescedAsyncRunner';

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

  const run = useCoalescedAsyncRunner(() => refreshRef.current());

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
