import { useLocalDayChangeRefresh } from '@/hooks/useLocalDayChangeRefresh';
import type { RefreshWhenVisibleOptions } from '@/hooks/useRefreshWhenVisible';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
import { useTrackedUsageChangeRefresh } from '@/hooks/useTrackedUsageChangeRefresh';

export type UseScreenRefreshOptions = RefreshWhenVisibleOptions & {
  /** When false, skips live usage native events while focused. Defaults to true. */
  trackedUsage?: boolean;
};

/** Soft refresh on focus/foreground; hard refresh on day change; optional live usage while focused. */
export const useScreenRefresh = (
  refreshSoft: () => void | Promise<void>,
  refreshHard: () => void | Promise<void> = refreshSoft,
  options?: UseScreenRefreshOptions,
): void => {
  const { trackedUsage = true, ...refreshWhenVisibleOptions } = options ?? {};

  useRefreshWhenVisible(refreshSoft, refreshWhenVisibleOptions);
  useLocalDayChangeRefresh(refreshHard);
  useTrackedUsageChangeRefresh(refreshSoft, trackedUsage);
};
