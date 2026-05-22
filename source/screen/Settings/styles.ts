/** @format */

import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, layoutPresets, spacing, textPresets, typography } from '@/theme';

export const settingsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: {
    ...layoutPresets.scrollContent(spacing.xxl),
    paddingTop: spacing.sm,
  },
  header: {
    ...layoutPresets.rowCenter,
    gap: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.display,
    fontSize: fontSize.xxl,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  sections: {
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.3,
    paddingLeft: spacing.xs,
    textTransform: 'uppercase',
  },
  card: {
    ...layoutPresets.cardLg,
    overflow: 'hidden',
  },
  row: {
    ...layoutPresets.rowBetween,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowLeading: {
    ...layoutPresets.rowCenter,
    flex: 1,
    gap: spacing.lg,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: textPresets.heading,
  rowDescription: {
    ...typography.caption,
    fontSize: fontSize.xs,
    lineHeight: 16,
    color: colors.textMuted,
  },
  privacyBanner: {
    borderWidth: 1,
    borderColor: colors.privacyHighlightBorder,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.privacyHighlightBg,
    padding: spacing.xl,
    gap: spacing.md,
    flexDirection: 'row',
  },
  privacyIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.privacyHighlightIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTextBlock: {
    flex: 1,
    gap: spacing.sm,
  },
  privacyTitle: textPresets.heading,
  privacyBody: {
    ...typography.caption,
    color: 'rgba(147, 143, 153, 0.8)',
  },
  footer: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  version: {
    ...typography.label,
    color: colors.textDisabled,
  },
  termsLink: textPresets.accentButton,
});
