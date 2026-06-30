/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/createStylesHook';
import { borderRadius, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

export const createPermissionsStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets, iconBoxPresets } = presets;

  return StyleSheet.create({
    screen: layoutPresets.screen,
    scrollContent: {
      ...layoutPresets.scrollContent(spacing.lg),
      paddingHorizontal: 0,
    },
    header: {
      gap: spacing.md,
      paddingTop: spacing.sm,
    },
    title: textPresets.displayTitle,
    subtitle: {
      ...typography.body,
      color: colors.textMuted,
    },
    card: {
      borderRadius: borderRadius.xl,
      borderWidth: 2,
      padding: 26,
    },
    cardOverlayWrapper: {
      position: 'relative',
    },
    cardOverlayPending: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
    },
    cardOverlayGranted: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.successMuted,
      borderColor: colors.successBorder,
    },
    cardOverlayPadding: {
      padding: 26,
    },
    iconBoxWrapper: {
      position: 'relative',
    },
    iconBoxPending: {
      backgroundColor: colors.accentIconBg,
    },
    iconBoxGranted: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors.successIconBg,
    },
    cardRow: {
      ...layoutPresets.rowCenter,
      gap: spacing.lg,
    },
    iconBox: iconBoxPresets.lg,
    iconLayer: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      flex: 1,
      gap: spacing.sm,
    },
    cardTitleRow: {
      ...layoutPresets.rowCenter,
      gap: 10,
    },
    cardTitle: textPresets.heading,
    grantedBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.success,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardDescription: textPresets.captionMuted,
    grantButtonContainer: {
      overflow: 'hidden',
      alignSelf: 'flex-start',
    },
    grantButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: borderRadius.md,
      backgroundColor: colors.accentMuted,
    },
    grantButtonText: textPresets.accentButton,
    privacyBox: {
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.privacyBorder,
      backgroundColor: colors.privacyBackground,
      padding: 20,
    },
    privacyText: {
      ...textPresets.captionMuted,
      textAlign: 'center',
    },
    footer: {
      paddingBottom: spacing.sm,
      gap: 20,
    },
    continueButton: {
      height: 56,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.buttonDisabled,
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueButtonEnabled: {
      backgroundColor: colors.surface,
    },
    continueText: {
      ...textPresets.heading,
      color: colors.textDisabled,
    },
    continueTextEnabled: {
      color: colors.onPrimary,
    },
  });
};

export const usePermissionsStyles = createStylesHook(createPermissionsStyles);
