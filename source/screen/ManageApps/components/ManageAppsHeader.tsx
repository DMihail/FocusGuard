import React, { memo } from 'react';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type ManageAppsHeaderProps = {
  selectedCount: number;
  onBack: () => void;
};

export const ManageAppsHeader = memo(({ selectedCount, onBack }: ManageAppsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <ScreenBackHeader
      title={t('manageApps.title')}
      subtitle={t('format.selectedCount', { count: selectedCount })}
      onBack={onBack}
      testID={testIds.manageApps.header}
      backButtonTestID={testIds.manageApps.backButton}
      subtitleTestID={testIds.manageApps.selectedCount}
    />
  );
});
