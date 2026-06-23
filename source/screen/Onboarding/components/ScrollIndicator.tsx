/** @format */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';
import { spacing } from '@/theme';

import type { ScrollIndicatorProps } from '../types';
import { AnimatedIndicatorDot, type IndicatorVariant } from './AnimatedIndicatorDot';

type ScrollIndicatorPropsWithVariant = ScrollIndicatorProps & {
  variant: IndicatorVariant;
};

export const ScrollIndicator = ({ count, scrollX, pageWidth, variant }: ScrollIndicatorPropsWithVariant) => {
  const { t } = useTranslation();

  return (
    <View
      style={[styles.container, variant === 'page' && styles.containerCentered]}
      testID={testIds.onboarding.stepIndicator}
      accessibilityRole="tablist"
      accessibilityLabel={t('onboarding.stepIndicatorA11y', { count })}
    >
      {Array.from({ length: count }, (_, index) => (
        <AnimatedIndicatorDot key={index} scrollX={scrollX} index={index} pageWidth={pageWidth} variant={variant} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  containerCentered: {
    justifyContent: 'center',
  },
});
