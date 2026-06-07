import React from 'react';

import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type ManageAppsHeaderProps = {
  selectedCount: number;
  onBack: () => void;
};

export function ManageAppsHeader({ selectedCount, onBack }: ManageAppsHeaderProps) {
  return (
    <ScreenBackHeader
      title="Select Apps"
      subtitle={`${selectedCount} selected`}
      onBack={onBack}
      testID={testIds.manageApps.header}
      backButtonTestID={testIds.manageApps.backButton}
      subtitleTestID={testIds.manageApps.selectedCount}
    />
  );
}
