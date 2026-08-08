import { useCallback } from 'react';

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
  const run = useCoalescedAsyncRunner(refresh);

  useFocusEffect(
    useCallback(() => {
      if (onFocus) {
        run();
      }
    }, [onFocus, run]),
  );

  useAppStateOnActive(() => {
    if (!onAppActive) {
      return;
    }

    if (onlyWhenFocusedOnAppActive && !isFocused) {
      return;
    }

    run();
  });
};
