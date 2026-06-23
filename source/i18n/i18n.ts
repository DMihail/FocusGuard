/** @format */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { settingsStore } from '@/store';

import { enUi } from './messages/en/ui';
import { ruUi } from './messages/ru/ui';
import { resolveLanguage } from './resolveLanguage';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enUi },
      ru: { translation: ruUi },
    },
    lng: resolveLanguage(settingsStore.getState().languagePreference),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
    react: {
      useSuspense: false,
    },
  })
  .catch(() => undefined);

export default i18n;
