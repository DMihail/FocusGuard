/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createOnboardingStyles } from '../styles';
import type { ScrollIndicatorProps } from '../types';
import { ScrollIndicator } from './ScrollIndicator';

type OnboardingFooterProps = {
  isLastStep: boolean;
  indicatorProps: ScrollIndicatorProps | null;
  onContinue: () => void;
};

export const OnboardingFooter = ({ isLastStep, indicatorProps, onContinue }: OnboardingFooterProps) => {
  const styles = useThemedStyles(createOnboardingStyles);

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
