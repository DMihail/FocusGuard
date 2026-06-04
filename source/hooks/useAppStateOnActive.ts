/** @format */

import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/** Runs callback when the app returns to the foreground. */
export const useAppStateOnActive = (onActive: () => void): void => {
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        onActive();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [onActive]);
};
