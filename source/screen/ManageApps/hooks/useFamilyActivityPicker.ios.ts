/** @format */

import { useCallback, useState } from 'react';

import { invalidateInstalledAppsCache } from '@/domain/installedAppsCatalog';
import { mapInstalledApps } from '@/domain/mapInstalledApps';
import { presentFamilyActivityPicker } from '@/specs/keeptTurboModuleApi.ios';
import { selectedAppsStore } from '@/store';

/** Presents the iOS FamilyActivityPicker and replaces the tracked app selection. */
export const useFamilyActivityPicker = () => {
  const [isPicking, setIsPicking] = useState(false);

  const pickApps = useCallback(async () => {
    setIsPicking(true);

    try {
      const pickedApps = mapInstalledApps(await presentFamilyActivityPicker());
      selectedAppsStore.getState().replaceApps(pickedApps);
      invalidateInstalledAppsCache();
      return pickedApps;
    } finally {
      setIsPicking(false);
    }
  }, []);

  return { pickApps, isPicking };
};
