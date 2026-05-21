/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ScrollIndicatorProps } from '../types';
import { onboardingStyles } from '../styles';
import { testIds } from '@/testing/testIds';
import { ScrollIndicator } from './ScrollIndicator';

type OnboardingHeaderProps = {
  indicatorProps: ScrollIndicatorProps | null;
  onSkip?: () => void;
};

export const OnboardingHeader = ({ indicatorProps, onSkip }: OnboardingHeaderProps) => (
  <View style={onboardingStyles.header}>
    {indicatorProps ? <ScrollIndicator {...indicatorProps} variant="progress" /> : null}

    <Pressable
      testID={testIds.onboarding.skipButton}
      accessibilityRole="button"
      accessibilityLabel="Skip onboarding"
      hitSlop={8}
      style={onboardingStyles.skipButton}
      onPress={onSkip}
    >
      <Text style={onboardingStyles.skipText}>Skip</Text>
    </Pressable>
  </View>
);
