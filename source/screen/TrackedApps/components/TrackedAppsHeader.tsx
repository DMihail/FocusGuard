/** @format */

import React, { memo } from 'react';

import { useTranslation } from '@/i18n';
import { formatAppsMonitored } from '@/i18n/format';
import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type TrackedAppsHeaderProps = {
  appCount: number;
  onBack: () => void;
};

export const TrackedAppsHeader = memo(({ appCount, onBack }: TrackedAppsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <ScreenBackHeader
      title={t('trackedApps.title')}
      subtitle={formatAppsMonitored(t, appCount)}
      onBack={onBack}
      testID={testIds.trackedApps.header}
      backButtonTestID={testIds.trackedApps.backButton}
      subtitleTestID={testIds.trackedApps.appCount}
    />
  );
});
