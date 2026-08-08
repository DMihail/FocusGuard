/** @format */

import { useEffect, useEffectEvent } from 'react';

import { subscribePermissionsChanged } from '@/specs';

import { useRunOnFocusAndActive } from './useRunOnFocusAndActive';

/** Re-reads native permission state on focus, app resume, and Turbo Module permission events. */
export const useNativePermissionsChangedRefresh = (refresh: () => void): void => {
  useRunOnFocusAndActive(refresh);

  const onPermissionsChanged = useEffectEvent(refresh);

  useEffect(() => {
    const subscription = subscribePermissionsChanged(onPermissionsChanged);

    return () => subscription.remove();
  }, []);
};
