/** @format */

import { useCallback, useMemo } from 'react';
import { RefreshControl } from 'react-native';

import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useTheme } from '@/hooks/useTheme';

/** Shared pull-to-refresh wiring for screens that reload tracked usage. */
export const useTrackedAppsRefresh = (refreshUsage: (force?: boolean) => Promise<void>) => {
  const { colors } = useTheme();
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
    [colors.accent, colors.surfaceDark, onRefresh, refreshing],
  );

  return { refreshing, refreshControl };
};
