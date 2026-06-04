/** @format */

import { useCallback, useState } from 'react';

/** Wraps a sync refresh handler for `RefreshControl` with a short `refreshing` pulse. */
export const usePullToRefresh = (refresh: () => void) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refresh();
    requestAnimationFrame(() => {
      setRefreshing(false);
    });
  }, [refresh]);

  return { refreshing, onRefresh };
};
