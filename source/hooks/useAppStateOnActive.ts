/** @format */

import { useEffect, useRef } from 'react';

import { subscribeAppForeground } from '@/runtime/appForegroundBus';

/** Runs callback when the app returns to the foreground. */
export const useAppStateOnActive = (onActive: () => void): void => {
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(
    () =>
      subscribeAppForeground(() => {
        onActiveRef.current();
      }),
    [],
  );
};
