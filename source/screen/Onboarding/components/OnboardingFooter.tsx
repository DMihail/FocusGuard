/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useOnboardingStyles } from '../styles';
import type { ScrollIndicatorProps } from '../types';
import { ScrollIndicator } from './ScrollIndicator';

type OnboardingFooterProps = {
  isLastStep: boolean;
  indicatorProps: ScrollIndicatorProps | null;
  onContinue: () => void;
};

export const OnboardingFooter = ({ isLastStep, indicatorProps, onContinue }: OnboardingFooterProps) => {
  const styles = useOnboardingStyles();

  return (
    <View style={styles.footer}>
      <Pressable
        testID={testIds.onboarding.continueButton}
        accessibilityRole="button"
        accessibilityLabel={isLastStep ? 'Get started' : 'Continue'}
        style={styles.continueButton}
        onPress={onContinue}
      >
        <Text style={styles.continueText}>{isLastStep ? 'Get Started' : 'Continue'}</Text>
      </Pressable>

      {indicatorProps ? <ScrollIndicator {...indicatorProps} variant="page" /> : null}
    </View>
  );
};
