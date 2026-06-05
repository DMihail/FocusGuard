/** @format */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import { getAppsUsageStats } from '@/specs/NativeUsageStats';
import {
  type AppLimits,
  appLimitsStore,
  DEFAULT_APP_LIMITS,
  LIMIT_SLIDER_BOUNDS,
  normalizeAppLimits,
  selectedAppsStore,
} from '@/store';

import type { UseConfigureLimitsResult } from '../types';

const MS_PER_MINUTE = 60_000;

/**
 * Loads draft limit settings and today's usage for a single tracked app.
 *
 * Syncs draft state when persisted limits change and refreshes usage on focus/foreground.
 */
export const useConfigureLimits = (packageName: string): UseConfigureLimitsResult => {
  const app = selectedAppsStore((state) => state.apps.find((item) => item.packageName === packageName));
  const storedLimits = appLimitsStore((state) => state.limitsByPackage[packageName] ?? DEFAULT_APP_LIMITS);
  const setStoredLimits = appLimitsStore((state) => state.setLimits);

  const [draft, setDraft] = useState<AppLimits>(storedLimits);
  const [usedMsToday, setUsedMsToday] = useState(0);

  const refreshUsage = useCallback(() => {
    const stats = getAppsUsageStats();
    const match = stats.find((item) => item.packageName === packageName);
    setUsedMsToday(match?.totalTimeForeground ?? 0);
  }, [packageName]);

  useFocusEffect(
    useCallback(() => {
      refreshUsage();
    }, [refreshUsage]),
  );

  useAppStateOnActive(refreshUsage);

  useEffect(() => {
    setDraft(storedLimits);
  }, [packageName, storedLimits]);

  const hardBlockMin = useMemo(
    () => Math.max(LIMIT_SLIDER_BOUNDS.hardBlock.min, draft.warningMinutes),
    [draft.warningMinutes],
  );

  const setWarningMinutes = useCallback((warningMinutes: number) => {
    setDraft((current) => {
      const next = { ...current, warningMinutes };
      if (next.hardBlockMinutes < warningMinutes) {
        next.hardBlockMinutes = warningMinutes;
      }
      return next;
    });
  }, []);

  const setHardBlockMinutes = useCallback((hardBlockMinutes: number) => {
    setDraft((current) => ({ ...current, hardBlockMinutes }));
  }, []);

  const setStrictMode = useCallback((strictMode: boolean) => {
    setDraft((current) => ({ ...current, strictMode }));
  }, []);

  const save = useCallback(() => {
    setStoredLimits(packageName, normalizeAppLimits(draft));
  }, [draft, packageName, setStoredLimits]);

  const limitMsToday = draft.hardBlockMinutes * MS_PER_MINUTE;

  return {
    app,
    draft,
    hardBlockMin,
    usedMsToday,
    limitMsToday,
    setWarningMinutes,
    setHardBlockMinutes,
    setStrictMode,
    save,
  };
};
