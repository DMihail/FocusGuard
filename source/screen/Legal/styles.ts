/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/useThemedStyles';
import { fontSize, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

export const createLegalStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets } = presets;

  return StyleSheet.create({
    screen: layoutPresets.screen,
    scrollContent: {
      ...layoutPresets.scrollContent(spacing.xl),
      paddingTop: spacing.sm,
      paddingBottom: spacing.xxxl,
    },
    meta: {
      ...typography.caption,
      fontSize: fontSize.xs,
      color: colors.textDisabled,
      marginTop: spacing.lg,
      marginBottom: spacing.xl,
    },
    sectionSeparator: {
      height: spacing.xxl,
    },
    section: {
      gap: spacing.md,
    },
    sectionTitle: {
      ...textPresets.heading,
      fontSize: fontSize.md,
    },
    paragraph: {
      ...typography.body,
      fontSize: fontSize.sm,
      lineHeight: 22,
      color: colors.textMuted,
    },
  });
};

export const useLegalStyles = createStylesHook(createLegalStyles);
