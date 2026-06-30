/** @format */

import type { AppLimits, AppLimitsByAppKey } from '@/store/types/appLimits';

export const pickLimitsForSelectedApps = (
  limitsByAppKey: AppLimitsByAppKey,
  selectedAppKeys: readonly string[],
): Record<string, AppLimits> => {
  const picked: Record<string, AppLimits> = {};

  for (const appKey of selectedAppKeys) {
    const limits = limitsByAppKey[appKey];

    if (limits) {
      picked[appKey] = limits;
    }
  }

  return picked;
};

export const pickUsageForSelectedApps = (
  usageByPackage: Record<string, number>,
  selectedAppKeys: readonly string[],
): Record<string, number> => {
  const picked: Record<string, number> = {};

  for (const appKey of selectedAppKeys) {
    picked[appKey] = usageByPackage[appKey] ?? 0;
  }

  return picked;
};
