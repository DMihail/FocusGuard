/** @format */

import React, { memo } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { testIds } from '@/testing/testIds';

import { WALKTHROUGH_ICON_SIZE } from '../constants';
import type { WalkthroughStepData } from '../data/walkthroughSteps';
import { useOnboardingStyles } from '../styles';
import { Walkthrough } from './Walkthrough';

type WalkthroughPageProps = {
  item: WalkthroughStepData;
  width: number;
};

export const WalkthroughPage = memo(({ item, width }: WalkthroughPageProps) => {
  const styles = useOnboardingStyles();
  const { colors } = useTheme();
  const { Icon } = item;

  return (
    <View style={[styles.page, { width }]} testID={testIds.onboarding.walkthroughStep(item.id)}>
      <Walkthrough title={item.title} text={item.text}>
        <Icon stroke={colors.accent} width={WALKTHROUGH_ICON_SIZE} height={WALKTHROUGH_ICON_SIZE} />
      </Walkthrough>
    </View>
  );
});
