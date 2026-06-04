/** @format */

import React from 'react';

import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type TrackedAppsHeaderProps = {
  appCount: number;
  onBack: () => void;
};

export const TrackedAppsHeader = ({ appCount, onBack }: TrackedAppsHeaderProps) => (
  <ScreenBackHeader
    title="Tracked Apps"
    subtitle={`${appCount} ${appCount === 1 ? 'app' : 'apps'} monitored`}
    onBack={onBack}
    testID={testIds.trackedApps.header}
    backButtonTestID={testIds.trackedApps.backButton}
    subtitleTestID={testIds.trackedApps.appCount}
  />
);
