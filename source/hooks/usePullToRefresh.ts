/** @format */

import { useCallback, useState } from 'react';

import { logDevWarning } from '@/utils/logDevWarning';

/** Wraps a refresh handler for `RefreshControl` and keeps the spinner until async work finishes. */
export const usePullToRefresh = (refresh: () => void | Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.resolve(refresh())
      .catch(logDevWarning)
      .finally(() => {
        setRefreshing(false);
      });
  }, [refresh]);

  return { refreshing, onRefresh };
};
