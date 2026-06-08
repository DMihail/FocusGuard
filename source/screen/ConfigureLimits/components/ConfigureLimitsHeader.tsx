/** @format */

import React, { memo } from 'react';

import { testIds } from '@/testing/testIds';

import type { ConfigureLimitsHeaderProps } from '../types';

import { ScreenBackHeader } from '@/components';

export const ConfigureLimitsHeader = memo(({ appName, onBack }: ConfigureLimitsHeaderProps) => (
  <ScreenBackHeader
    title="Configure Limits"
    subtitle={appName}
    onBack={onBack}
    testID={testIds.configureLimits.header}
    backButtonTestID={testIds.configureLimits.backButton}
  />
));
