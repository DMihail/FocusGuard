/** @format */

import { useCallback, useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';

import { reportError } from '@/crashlytics/reportError';
import { useTheme } from '@/hooks/useTheme';

/** Shared pull-to-refresh wiring for screens that reload tracked usage. */
export const useTrackedAppsRefresh = (refreshUsage: (force?: boolean) => Promise<void>) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    Promise.resolve(refreshUsage(true))
      .catch(reportError)
      .finally(() => {
        setRefreshing(false);
      });
  }, [refreshUsage]);

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
