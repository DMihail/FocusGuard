/** @format */

import React from 'react';

import { testIds } from '@/testing/testIds';

import { ScreenBackHeader } from '@/components';

type SettingsHeaderProps = {
  onBack: () => void;
};

export const SettingsHeader = ({ onBack }: SettingsHeaderProps) => (
  <ScreenBackHeader
    title="Settings"
    subtitle="Customize your experience"
    onBack={onBack}
    testID={testIds.settings.header}
    backButtonTestID={testIds.settings.backButton}
  />
);
