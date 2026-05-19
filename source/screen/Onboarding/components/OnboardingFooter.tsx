/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ScrollIndicatorProps } from '../types';
import { onboardingStyles } from '../styles';
import { ScrollIndicator } from './ScrollIndicator';

type OnboardingFooterProps = {
  isLastStep: boolean;
  indicatorProps: ScrollIndicatorProps | null;
  onContinue: () => void;
};

export const OnboardingFooter = ({ isLastStep, indicatorProps, onContinue }: OnboardingFooterProps) => (
  <View style={onboardingStyles.footer}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isLastStep ? 'Get started' : 'Continue'}
      style={onboardingStyles.continueButton}
      onPress={onContinue}
    >
      <Text style={onboardingStyles.continueText}>{isLastStep ? 'Get Started' : 'Continue'}</Text>
    </Pressable>

    {indicatorProps ? <ScrollIndicator {...indicatorProps} variant="page" /> : null}
  </View>
);
