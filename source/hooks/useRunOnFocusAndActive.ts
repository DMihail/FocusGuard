/** @format */

import { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useAppStateOnActive } from './useAppStateOnActive';

/** Runs a synchronous callback when the screen is focused and when the app becomes active. */
export const useRunOnFocusAndActive = (callback: () => void): void => {
  const run = useCallback(() => {
    callback();
  }, [callback]);

  useFocusEffect(
    useCallback(() => {
      run();
    }, [run]),
  );

  useAppStateOnActive(run);
};
