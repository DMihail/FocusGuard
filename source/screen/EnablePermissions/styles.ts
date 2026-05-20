/** @format */

import { StyleSheet } from 'react-native';
import { colors, fontFamily, fontSize, fontWeight, typography } from '../../theme';

export const permissionsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    gap: 12,
    paddingTop: 8,
  },
  title: {
    fontFamily: fontFamily.inter,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.53,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  cards: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 26,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.md,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.31,
    color: colors.textPrimary,
  },
  grantedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDescription: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: 23,
    letterSpacing: -0.15,
    color: colors.textMuted,
  },
  grantButtonContainer: {
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  grantButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.accentMuted,
  },
  grantButtonText: {
    ...typography.button,
    color: colors.accent,
  },
  privacyBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.privacyBorder,
    backgroundColor: colors.privacyBackground,
    padding: 20,
  },
  privacyText: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: 23,
    letterSpacing: -0.15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.buttonDisabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: colors.surface,
  },
  continueText: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.md,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.31,
    color: colors.textDisabled,
  },
  continueTextEnabled: {
    color: colors.onSurface,
  },
});
