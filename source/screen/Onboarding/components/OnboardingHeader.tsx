/** @format */

import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useOnboardingStyles } from '../styles';
import type { ScrollIndicatorProps } from '../types';
import { ScrollIndicator } from './ScrollIndicator';

type OnboardingHeaderProps = {
  indicatorProps: ScrollIndicatorProps | null;
  onSkip?: () => void;
};

export const OnboardingHeader = ({ indicatorProps, onSkip }: OnboardingHeaderProps) => {
  const styles = useOnboardingStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      {indicatorProps ? <ScrollIndicator {...indicatorProps} variant="progress" /> : null}

      <Pressable
        testID={testIds.onboarding.skipButton}
        accessibilityRole="button"
        accessibilityLabel={t('onboarding.skipA11y')}
        hitSlop={8}
        style={styles.skipButton}
        onPress={onSkip}
      >
        <Text style={styles.skipText}>{t('common.skip')}</Text>
      </Pressable>
    </View>
  );
};
