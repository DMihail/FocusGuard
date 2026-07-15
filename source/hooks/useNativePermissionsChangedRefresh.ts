/** @format */

import { useEffect } from 'react';

import { subscribePermissionsChanged } from '@/specs';

import { useRunOnFocusAndActive } from './useRunOnFocusAndActive';

/** Re-reads native permission state on focus, app resume, and Turbo Module permission events. */
export const useNativePermissionsChangedRefresh = (refresh: () => void): void => {
  useRunOnFocusAndActive(refresh);

  useEffect(() => {
    const subscription = subscribePermissionsChanged(refresh);

    return () => subscription.remove();
  }, [refresh]);
};
