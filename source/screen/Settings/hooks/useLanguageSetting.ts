/** @format */

import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { useShallow } from 'zustand/react/shallow';

import { useTranslation } from '@/i18n';
import type { LanguagePreference } from '@/i18n/types';
import { settingsStore } from '@/store';

const languageOptionKey: Record<LanguagePreference, string> = {
  system: 'settings.language.optionSystem',
  en: 'settings.language.optionEn',
  ru: 'settings.language.optionRu',
};

const languageDescriptionKey: Record<LanguagePreference, string> = {
  system: 'settings.language.descriptionSystem',
  en: 'settings.language.descriptionEn',
  ru: 'settings.language.descriptionRu',
};

const languageOrder: LanguagePreference[] = ['system', 'en', 'ru'];

export const useLanguageSetting = () => {
  const { t } = useTranslation();
  const { languagePreference, setLanguagePreference } = settingsStore(
    useShallow((state) => ({
      languagePreference: state.languagePreference,
      setLanguagePreference: state.setLanguagePreference,
    })),
  );

  const description = useMemo(() => t(languageDescriptionKey[languagePreference]), [languagePreference, t]);

  const openLanguagePicker = useCallback(() => {
    Alert.alert(
      t('settings.language.title'),
      undefined,
      languageOrder.map((preference) => ({
        text: t(languageOptionKey[preference]),
        onPress: () => setLanguagePreference(preference),
      })),
      { cancelable: true },
    );
  }, [setLanguagePreference, t]);

  return {
    languagePreference,
    description,
    openLanguagePicker,
  };
};
