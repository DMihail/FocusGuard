/** @format */

import type { UsageByPackage } from '@/domain/usageStatsCatalog';

export type TrackedUsageStore = {
  usageByPackage: UsageByPackage;
  isRefreshingUsage: boolean;
  seedUsageFromCache: () => void;
  refreshUsage: (packageNames: readonly string[], force?: boolean) => Promise<void>;
};
