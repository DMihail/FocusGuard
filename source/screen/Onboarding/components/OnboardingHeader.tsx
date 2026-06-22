/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createOnboardingStyles } from '../styles';
import type { ScrollIndicatorProps } from '../types';
import { ScrollIndicator } from './ScrollIndicator';

type OnboardingHeaderProps = {
  indicatorProps: ScrollIndicatorProps | null;
  onSkip?: () => void;
};

export const OnboardingHeader = ({ indicatorProps, onSkip }: OnboardingHeaderProps) => {
  const styles = useThemedStyles(createOnboardingStyles);

  return (
    <View style={styles.header}>
      {indicatorProps ? <ScrollIndicator {...indicatorProps} variant="progress" /> : null}

      <Pressable
        testID={testIds.onboarding.skipButton}
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding"
        hitSlop={8}
        style={styles.skipButton}
        onPress={onSkip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>
    </View>
  );
};
