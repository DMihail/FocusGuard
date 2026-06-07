/** @format */

import { useCallback, useState } from 'react';

/** Wraps a refresh handler for `RefreshControl` and keeps the spinner until async work finishes. */
export const usePullToRefresh = (refresh: () => void | Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.resolve(refresh()).finally(() => {
      setRefreshing(false);
    });
  }, [refresh]);

  return { refreshing, onRefresh };
};
