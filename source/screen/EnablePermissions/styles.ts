/** @format */

import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  iconBoxPresets,
  layoutPresets,
  letterSpacing,
  lineHeight,
  spacing,
  textPresets,
  typography,
} from '../../theme';

export const permissionsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: layoutPresets.scrollContent(spacing.lg),
  header: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    fontFamily: typography.title.fontFamily,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.tightLg,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  cards: {
    gap: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    padding: 26,
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
  cardDescription: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: 23,
    letterSpacing: letterSpacing.tightXs,
    color: colors.textMuted,
  },
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
    fontFamily: typography.body.fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: 23,
    letterSpacing: letterSpacing.tightXs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
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
    color: colors.onSurface,
  },
});
