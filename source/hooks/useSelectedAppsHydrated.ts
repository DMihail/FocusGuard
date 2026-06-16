/** @format */

import { useEffect, useState } from 'react';

import { selectedAppsStore } from '@/store';

const readSelectedAppsHydrated = (): boolean => selectedAppsStore.persist?.hasHydrated() ?? true;

/** True after persisted selected apps have been read from MMKV. */
export const useSelectedAppsHydrated = (): boolean => {
  const [hasHydrated, setHasHydrated] = useState(readSelectedAppsHydrated);

  useEffect(() => {
    if (readSelectedAppsHydrated()) {
      setHasHydrated(true);
      return;
    }

    return selectedAppsStore.persist?.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  return hasHydrated;
};
