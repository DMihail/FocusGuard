import { useLocalDayChangeRefresh } from '@/hooks/useLocalDayChangeRefresh';
import type { RefreshWhenVisibleOptions } from '@/hooks/useRefreshWhenVisible';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';

/** Soft refresh on focus/foreground; hard refresh when the local calendar day changes. */
export const useScreenRefresh = (
  refreshSoft: () => void | Promise<void>,
  refreshHard: () => void | Promise<void> = refreshSoft,
  options?: RefreshWhenVisibleOptions,
): void => {
  useRefreshWhenVisible(refreshSoft, options);
  useLocalDayChangeRefresh(refreshHard);
};
