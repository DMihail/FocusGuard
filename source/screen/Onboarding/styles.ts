/** @format */

import { StyleSheet } from 'react-native';
import { borderRadius, colors, layoutPresets, spacing, textPresets, typography } from '@/theme';

export const onboardingStyles = StyleSheet.create({
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
    color: colors.onSurface,
  },
});
