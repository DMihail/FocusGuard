/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/createStylesHook';
import { borderRadius, fontSize, lineHeight, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

const CARD_MAX_WIDTH = 360;

export const createErrorFallbackStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets } = presets;

  return StyleSheet.create({
    screen: {
      ...layoutPresets.screen,
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
    },
    card: {
      width: '100%',
      maxWidth: CARD_MAX_WIDTH,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      borderRadius: borderRadius.xl,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
      gap: spacing.md,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 4,
    },
    brand: {
      ...typography.caption,
      color: colors.accent,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    iconBox: {
      width: 88,
      height: 88,
      borderRadius: borderRadius.xl,
      backgroundColor: colors.overLimitMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    title: {
      ...typography.title,
      fontSize: fontSize.xxl,
      lineHeight: lineHeight.xl,
      color: colors.textPrimary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    message: {
      ...typography.body,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    devDetails: {
      width: '100%',
      marginTop: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.surfaceDark,
      borderColor: colors.cardBorder,
      borderWidth: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    devDetailsLabel: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    devDetailsText: {
      ...typography.caption,
      color: colors.overLimit,
    },
    actions: {
      width: '100%',
      marginTop: spacing.lg,
      gap: spacing.md,
    },
    retryButton: {
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
    retryButtonPressed: {
      opacity: 0.88,
    },
    retryButtonLabel: {
      ...typography.button,
      color: colors.onPrimary,
    },
    hint: {
      ...typography.caption,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: lineHeight.sm,
    },
  });
};

export const useErrorFallbackStyles = createStylesHook(createErrorFallbackStyles);
