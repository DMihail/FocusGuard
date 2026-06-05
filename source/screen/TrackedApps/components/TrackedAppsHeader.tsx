/** @format */

import React, { memo } from 'react';

import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type TrackedAppsHeaderProps = {
  appCount: number;
  onBack: () => void;
};

const TrackedAppsHeaderView = ({ appCount, onBack }: TrackedAppsHeaderProps) => (
  <ScreenBackHeader
    title="Tracked Apps"
    subtitle={`${appCount} ${appCount === 1 ? 'app' : 'apps'} monitored`}
    onBack={onBack}
    testID={testIds.trackedApps.header}
    backButtonTestID={testIds.trackedApps.backButton}
    subtitleTestID={testIds.trackedApps.appCount}
  />
);

export const TrackedAppsHeader = memo(TrackedAppsHeaderView);
