/** @format */

import React from 'react';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type SettingsHeaderProps = {
  onBack: () => void;
};

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <ScreenBackHeader
      title={t('settings.title')}
      subtitle={t('settings.subtitle')}
      onBack={onBack}
      testID={testIds.settings.header}
      backButtonTestID={testIds.settings.backButton}
    />
  );
};
