/** @format */

import { useEffect, useEffectEvent } from 'react';

import { subscribeAppForeground } from '@/runtime/appForegroundBus';

/** Runs callback when the app returns to the foreground. */
export const useAppStateOnActive = (onActive: () => void): void => {
  const onActiveEvent = useEffectEvent(onActive);

  useEffect(
    () =>
      subscribeAppForeground(() => {
        onActiveEvent();
      }),
    [],
  );
};
