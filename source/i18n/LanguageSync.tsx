/** @format */

import { type ReactNode, useEffect } from 'react';

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { subscribeAppForeground } from '@/runtime/appForegroundBus';
import { settingsStore } from '@/store';

import i18n from './i18n';
import { resolveLanguage } from './resolveLanguage';

type LanguageSyncProps = {
  children: ReactNode;
};

/** Keeps i18next in sync with settings and system locale changes. */
export const LanguageSync = ({ children }: LanguageSyncProps) => {
  const hasSettingsHydrated = usePersistHydrated(settingsStore);
  const languagePreference = settingsStore((state) => state.languagePreference);
  const effectivePreference = hasSettingsHydrated ? languagePreference : 'system';

  useEffect(() => {
    i18n.changeLanguage(resolveLanguage(effectivePreference)).catch(() => undefined);
  }, [effectivePreference]);

  useEffect(() => {
    return subscribeAppForeground(() => {
      if (settingsStore.getState().languagePreference === 'system') {
        i18n.changeLanguage(resolveLanguage('system')).catch(() => undefined);
      }
    });
  }, []);

  return children;
};
