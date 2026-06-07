/** @format */

import type { ManageApp } from '@/screen/ManageApps/types';
import { mapInstalledApps } from '@/screen/ManageApps/utils/mapInstalledApps';
import { getInstalledApplications } from '@/specs';
import { scheduleAfterInteractions } from '@/utils/scheduleAfterInteractions';

let cachedApps: ManageApp[] | null = null;
let loadPromise: Promise<ManageApp[]> | null = null;

const readInstalledApps = (): ManageApp[] => mapInstalledApps(getInstalledApplications());

export const getCachedInstalledApps = (): ManageApp[] | null => cachedApps;

export const invalidateInstalledAppsCache = (): void => {
  cachedApps = null;
  loadPromise = null;
};

export const loadInstalledApps = (force = false): Promise<ManageApp[]> => {
  if (!force && cachedApps) {
    return Promise.resolve(cachedApps);
  }

  if (!force && loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    scheduleAfterInteractions(() => {
      try {
        const apps = readInstalledApps();
        cachedApps = apps;
        resolve(apps);
      } catch (error) {
        cachedApps = [];
        resolve([]);
        if (__DEV__) {
          console.warn('[installedAppsCatalog] Failed to load installed apps', error);
        }
      } finally {
        loadPromise = null;
      }
    });
  });

  return loadPromise;
};

export const prefetchInstalledApps = (): void => {
  loadInstalledApps().catch(() => undefined);
};
