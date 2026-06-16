/** @format */

import { useCallback } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { logDevWarning } from '@/utils/logDevWarning';

/** Refreshes data when the screen gains focus. */
export const useRefreshOnFocus = (refresh: () => void | Promise<void>): void => {
  const run = useCallback(() => {
    Promise.resolve(refresh()).catch(logDevWarning);
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      run();
    }, [run]),
  );
};
