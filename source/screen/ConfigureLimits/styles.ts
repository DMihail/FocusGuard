/** @format */

import { StyleSheet } from 'react-native';

import { borderRadius, colors, fontSize, layoutPresets, spacing, textPresets, typography } from '@/theme';

export const configureLimitsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: {
    ...layoutPresets.scrollContent(spacing.xl),
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
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
  },
  cards: {
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  limitCard: {
    ...layoutPresets.cardLg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  limitCardHeader: {
    ...layoutPresets.rowBetween,
    alignItems: 'flex-start',
  },
  limitCardTitleRow: {
    flex: 1,
    gap: spacing.xs,
    paddingRight: spacing.md,
  },
  limitCardTitle: {
    ...textPresets.sectionTitle,
  },
  limitCardValue: {
    ...typography.display,
    fontSize: fontSize.xl,
    lineHeight: 28,
  },
  limitCardDescription: {
    ...typography.body,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  sliderRow: {
    ...layoutPresets.rowCenter,
    gap: spacing.md,
    marginTop: spacing.sm,
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
  },
  sliderButtonLabel: {
    ...typography.sectionTitle,
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  sliderTrackTouch: {
    flex: 1,
    height: 48,
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
  sliderThumb: {
    position: 'absolute',
    top: 14,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: borderRadius.pill,
    borderWidth: 2,
    borderColor: colors.textPrimary,
  },
  sliderBounds: {
    ...layoutPresets.rowBetween,
    marginTop: spacing.xs,
  },
  sliderBoundLabel: {
    ...typography.label,
    fontSize: fontSize.xs,
    color: colors.textDisabled,
  },
  strictCard: {
    ...layoutPresets.cardLg,
    ...layoutPresets.rowBetween,
    padding: spacing.xl,
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  strictText: {
    flex: 1,
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
