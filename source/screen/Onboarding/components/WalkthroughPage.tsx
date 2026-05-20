/** @format */

import React, { memo } from 'react';
import { View } from 'react-native';
import { colors } from '../../../theme';
import type { WalkthroughStepData } from '../data/walkthroughSteps';
import { WALKTHROUGH_ICON_SIZE } from '../constants';
import { onboardingStyles } from '../styles';
import { testIds } from '../../../testing/testIds';
import { Walkthrough } from './Walkthrough';

type WalkthroughPageProps = {
  item: WalkthroughStepData;
  width: number;
};

export const WalkthroughPage = memo(({ item, width }: WalkthroughPageProps) => {
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
});

WalkthroughPage.displayName = 'WalkthroughPage';
