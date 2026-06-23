/** @format */

import { useTranslation as useI18nextTranslation } from 'react-i18next';

import type { AppLanguage } from './types';

export const useTranslation = () => {
  const { t, i18n } = useI18nextTranslation();

  return {
    t,
    language: i18n.language as AppLanguage,
    i18n,
  };
};
