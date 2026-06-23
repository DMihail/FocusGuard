/** @format */

import React, { memo } from 'react';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import type { ConfigureLimitsHeaderProps } from '../types';

import { ScreenBackHeader } from '@/components';

export const ConfigureLimitsHeader = memo(({ appName, onBack }: ConfigureLimitsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <ScreenBackHeader
      title={t('configureLimits.title')}
      subtitle={appName}
      onBack={onBack}
      testID={testIds.configureLimits.header}
      backButtonTestID={testIds.configureLimits.backButton}
    />
  );
});
