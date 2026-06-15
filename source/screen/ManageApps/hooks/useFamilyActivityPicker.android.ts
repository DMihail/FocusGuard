/** @format */

import { useCallback } from 'react';

import type { ManageApp } from '@/domain/types';

/** Android selects apps from the installed catalog — FamilyActivityPicker is iOS-only. */
export const useFamilyActivityPicker = () => {
  const pickApps = useCallback(async (): Promise<ManageApp[]> => [], []);

  return { pickApps, isPicking: false };
};
