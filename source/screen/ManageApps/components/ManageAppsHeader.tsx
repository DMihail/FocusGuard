import React, { memo } from 'react';

import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type ManageAppsHeaderProps = {
  selectedCount: number;
  onBack: () => void;
};

export const ManageAppsHeader = memo(({ selectedCount, onBack }: ManageAppsHeaderProps) => (
  <ScreenBackHeader
    title="Select Apps"
    subtitle={`${selectedCount} selected`}
    onBack={onBack}
    testID={testIds.manageApps.header}
    backButtonTestID={testIds.manageApps.backButton}
    subtitleTestID={testIds.manageApps.selectedCount}
  />
));
