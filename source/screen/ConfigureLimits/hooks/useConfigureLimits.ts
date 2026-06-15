import { useCallback, useEffect, useState } from 'react';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { findSelectedApp } from '@/domain/findSelectedApp';
import { useAppStateOnActive } from '@/hooks/useAppStateOnActive';
import {
  type AppLimits,
  appLimitsStore,
  DEFAULT_APP_LIMITS,
  LIMIT_SLIDER_BOUNDS,
  normalizeAppLimits,
  selectedAppsStore,
  trackedUsageStore,
} from '@/store';
import { MS_PER_MINUTE } from '@/utils/usage/constants';

import type { UseConfigureLimitsResult } from '../types';

export const useConfigureLimits = (appKey: string): UseConfigureLimitsResult => {
  const isFocused = useIsFocused();

  const app = selectedAppsStore((state) => findSelectedApp(state.apps, appKey));
  const { storedLimits, setStoredLimits } = appLimitsStore(
    useShallow((state) => ({
      storedLimits: state.limitsByPackage[appKey] ?? DEFAULT_APP_LIMITS,
      setStoredLimits: state.setLimits,
    })),
  );
  const usedMsToday = trackedUsageStore((state) => state.usageByPackage[appKey] ?? 0);

  const [draft, setDraft] = useState<AppLimits>(storedLimits);

  const refreshUsage = useCallback(() => {
    trackedUsageStore
      .getState()
      .refreshUsage([appKey])
      .catch(() => undefined);
  }, [appKey]);

  const refreshWhenActive = useCallback(() => {
    if (!isFocused) {
      return;
    }

    refreshUsage();
  }, [isFocused, refreshUsage]);

  useFocusEffect(
    useCallback(() => {
      refreshUsage();
    }, [refreshUsage]),
  );

  useAppStateOnActive(refreshWhenActive);

  useEffect(() => {
    setDraft(storedLimits);
  }, [appKey, storedLimits]);

  const hardBlockMin = Math.max(LIMIT_SLIDER_BOUNDS.hardBlock.min, draft.warningMinutes);

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
    setStoredLimits(appKey, normalizeAppLimits(draft));
  }, [appKey, draft, setStoredLimits]);

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
