/** @format */

import React, { memo } from 'react';
import { View } from 'react-native';

import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { WALKTHROUGH_ICON_SIZE } from '../constants';
import type { WalkthroughStepData } from '../data/walkthroughSteps';
import { onboardingStyles } from '../styles';
import { Walkthrough } from './Walkthrough';

type WalkthroughPageProps = {
  item: WalkthroughStepData;
  width: number;
};

const WalkthroughPageView = ({ item, width }: WalkthroughPageProps) => {
  const { Icon } = item;

  return (
    <View style={[onboardingStyles.page, { width }]} testID={testIds.onboarding.walkthroughStep(item.id)}>
      <Walkthrough
        title={item.title}
        text={item.text}
        icon={<Icon stroke={colors.accent} width={WALKTHROUGH_ICON_SIZE} height={WALKTHROUGH_ICON_SIZE} />}
      />
    </View>
  );
};

export const WalkthroughPage = memo(WalkthroughPageView);
