import { useCallback, useOptimistic } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { findSelectedApp } from '@/domain/findSelectedApp';
import { useRefreshWhenVisible } from '@/hooks/useRefreshWhenVisible';
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
  const app = selectedAppsStore((state) => findSelectedApp(state.apps, appKey));
  const { storedLimits, setStoredLimits } = appLimitsStore(
    useShallow((state) => ({
      storedLimits: state.limitsByAppKey[appKey] ?? DEFAULT_APP_LIMITS,
      setStoredLimits: state.setLimits,
    })),
  );
  const usedMsToday = trackedUsageStore((state) => state.usageByPackage[appKey] ?? 0);

  const [draft, setDraft] = useOptimistic(storedLimits, (_stored, next: AppLimits) => next);

  const refreshUsage = useCallback(() => trackedUsageStore.getState().refreshUsage([appKey]), [appKey]);

  useRefreshWhenVisible(refreshUsage);

  const hardBlockMin = Math.max(LIMIT_SLIDER_BOUNDS.hardBlock.min, draft.warningMinutes);

  const setWarningMinutes = useCallback(
    (warningMinutes: number) => {
      const next = { ...draft, warningMinutes };
      if (next.hardBlockMinutes < warningMinutes) {
        next.hardBlockMinutes = warningMinutes;
      }
      setDraft(next);
    },
    [draft, setDraft],
  );

  const setHardBlockMinutes = useCallback(
    (hardBlockMinutes: number) => {
      setDraft({ ...draft, hardBlockMinutes });
    },
    [draft, setDraft],
  );

  const setStrictMode = useCallback(
    (strictMode: boolean) => {
      setDraft({ ...draft, strictMode });
    },
    [draft, setDraft],
  );

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
