/** @format */

import React from 'react';

import { selectedAppsStore } from '@/store';
import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type ManageAppsHeaderProps = {
  onBack: () => void;
};

export function ManageAppsHeader({ onBack }: ManageAppsHeaderProps) {
  const selectedCount = selectedAppsStore((state) => state.apps.length);

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
