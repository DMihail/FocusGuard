/** @format */

import { getLocales } from 'react-native-localize';

import type { AppLanguage, LanguagePreference } from './types';

export const resolveLanguage = (preference: LanguagePreference): AppLanguage => {
  if (preference === 'en' || preference === 'ru') {
    return preference;
  }

  const languageCode = getLocales()[0]?.languageCode?.toLowerCase() ?? 'en';

  return languageCode === 'ru' ? 'ru' : 'en';
};
