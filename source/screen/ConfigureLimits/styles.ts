/** @format */

import { StyleSheet } from 'react-native';

import { borderRadius, colors, fontSize, layoutPresets, spacing, textPresets, typography } from '@/theme';

export const configureLimitsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: {
    ...layoutPresets.scrollContent(spacing.lg),
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  header: {
    ...layoutPresets.rowCenter,
    gap: spacing.md,
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
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
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
  appBadge: {
    ...layoutPresets.rowCenter,
    gap: spacing.md,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  appIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.appIconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  appIcon: {
    width: 48,
    height: 48,
  },
  appIconFallback: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  appName: {
    ...textPresets.sectionTitle,
    flex: 1,
    minWidth: 0,
  },
  dailyUsageCard: {
    ...layoutPresets.cardLg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dailyUsageTitle: {
    ...typography.label,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  dailyUsageValue: {
    ...typography.display,
    fontSize: fontSize.xl,
    lineHeight: 28,
    color: colors.textPrimary,
  },
  dailyUsageHint: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dailyUsageProgress: {
    marginTop: spacing.sm,
  },
  dailyUsagePercent: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dailyUsagePercentOver: {
    color: colors.overLimit,
  },
  cards: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  limitCard: {
    ...layoutPresets.cardLg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  limitCardHeader: {
    gap: spacing.xs,
  },
  limitCardHeaderTop: {
    ...layoutPresets.rowBetween,
    alignItems: 'center',
    gap: spacing.sm,
  },
  limitCardTitle: {
    ...textPresets.sectionTitle,
    flex: 1,
    minWidth: 0,
  },
  limitCardValue: {
    ...typography.sectionTitle,
    fontSize: fontSize.lg,
    lineHeight: 28,
    flexShrink: 0,
    minWidth: 56,
    textAlign: 'right',
  },
  limitCardDescription: {
    ...typography.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  sliderRow: {
    ...layoutPresets.rowCenter,
    gap: spacing.sm,
    marginTop: spacing.xs,
    minWidth: 0,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sliderButtonLabel: {
    ...typography.sectionTitle,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  sliderTrackTouch: {
    flex: 1,
    minWidth: 0,
    height: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 8,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.switchTrackOff,
    overflow: 'hidden',
  },
  sliderTrackInactive: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.cardBorder,
    opacity: 0.45,
  },
  sliderFill: {
    height: '100%',
    borderRadius: borderRadius.pill,
  },
  sliderThumbRail: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderThumbSpacer: {
    minWidth: 0,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    flexShrink: 0,
  },
  sliderBounds: {
    ...layoutPresets.rowBetween,
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  sliderBoundLabel: {
    ...typography.label,
    fontSize: fontSize.xs,
    color: colors.textDisabled,
    flexShrink: 1,
  },
  strictCard: {
    ...layoutPresets.cardLg,
    ...layoutPresets.rowBetween,
    alignItems: 'flex-start',
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  strictText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  strictTitle: {
    ...textPresets.sectionTitle,
  },
  strictDescription: {
    ...typography.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  footer: {
    marginTop: spacing.xxl,
  },
  saveButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonLabel: {
    ...typography.sectionTitle,
    color: colors.onSurface,
  },
});
