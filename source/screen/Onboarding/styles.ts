/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/useThemedStyles';
import { borderRadius, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

export const createOnboardingStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets } = presets;

  return StyleSheet.create({
    screen: layoutPresets.screen,
    header: {
      ...layoutPresets.rowBetween,
      marginTop: spacing.sm,
      minHeight: 36,
      paddingHorizontal: spacing.xl,
    },
    skipButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
    },
    skipText: textPresets.accentButton,
    pagerContainer: {
      flex: 1,
    },
    page: {
      flex: 1,
    },
    footer: {
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.xl,
      gap: spacing.lg,
    },
    continueButton: {
      height: 52,
      borderRadius: borderRadius.pill,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1,
      shadowRadius: 3,
      elevation: 2,
    },
    continueText: {
      ...typography.button,
      color: colors.onPrimary,
    },
  });
};

export const useOnboardingStyles = createStylesHook(createOnboardingStyles);
