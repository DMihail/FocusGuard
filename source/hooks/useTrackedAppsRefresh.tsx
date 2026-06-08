/** @format */

import { useCallback, useMemo } from 'react';
import { RefreshControl } from 'react-native';

import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { colors } from '@/theme';

/** Shared pull-to-refresh wiring for screens that reload tracked usage. */
export const useTrackedAppsRefresh = (refreshUsage: (force?: boolean) => Promise<void>) => {
  const handleRefresh = useCallback(() => refreshUsage(true), [refreshUsage]);
  const { refreshing, onRefresh } = usePullToRefresh(handleRefresh);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={colors.accent}
        colors={[colors.accent]}
        progressBackgroundColor={colors.surfaceDark}
      />
    ),
    [onRefresh, refreshing],
  );

  return { refreshing, onRefresh, refreshControl };
};
