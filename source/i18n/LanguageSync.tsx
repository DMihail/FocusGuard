/** @format */

import { type ReactNode, useEffect } from 'react';
import { AppState } from 'react-native';

import { settingsStore } from '@/store';

import i18n from './i18n';
import { resolveLanguage } from './resolveLanguage';

type LanguageSyncProps = {
  children: ReactNode;
};

/** Keeps i18next in sync with settings and system locale changes. */
export const LanguageSync = ({ children }: LanguageSyncProps) => {
  const languagePreference = settingsStore((state) => state.languagePreference);

  useEffect(() => {
    i18n.changeLanguage(resolveLanguage(languagePreference)).catch(() => undefined);
  }, [languagePreference]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && settingsStore.getState().languagePreference === 'system') {
        i18n.changeLanguage(resolveLanguage('system')).catch(() => undefined);
      }
    });

    return () => subscription.remove();
  }, []);

  return children;
};
