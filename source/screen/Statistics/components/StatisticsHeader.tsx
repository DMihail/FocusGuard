/** @format */

import React, { memo } from 'react';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type StatisticsHeaderProps = {
  onBack: () => void;
};

export const StatisticsHeader = memo(({ onBack }: StatisticsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <ScreenBackHeader
      title={t('statistics.title')}
      subtitle={t('statistics.subtitle')}
      onBack={onBack}
      testID={testIds.statistics.header}
      backButtonTestID={testIds.statistics.backButton}
    />
  );
});

StatisticsHeader.displayName = 'StatisticsHeader';
