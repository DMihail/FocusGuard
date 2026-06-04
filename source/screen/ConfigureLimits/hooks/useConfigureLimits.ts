/** @format */

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type AppLimits,
  appLimitsStore,
  DEFAULT_APP_LIMITS,
  LIMIT_SLIDER_BOUNDS,
  normalizeAppLimits,
  selectedAppsStore,
} from '@/store';

import type { UseConfigureLimitsResult } from '../types';

export const useConfigureLimits = (packageName: string): UseConfigureLimitsResult => {
  const app = selectedAppsStore((state) => state.apps.find((item) => item.packageName === packageName));
  const storedLimits = appLimitsStore((state) => state.limitsByPackage[packageName] ?? DEFAULT_APP_LIMITS);
  const setStoredLimits = appLimitsStore((state) => state.setLimits);

  const [draft, setDraft] = useState<AppLimits>(storedLimits);

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

  return {
    app,
    draft,
    hardBlockMin,
    setWarningMinutes,
    setHardBlockMinutes,
    setStrictMode,
    save,
  };
};
