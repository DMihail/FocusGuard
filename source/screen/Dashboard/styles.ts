/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/createStylesHook';
import { borderRadius, fontSize, lineHeight, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

export const createDashboardStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets } = presets;

  return StyleSheet.create({
    screen: layoutPresets.screen,
    content: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },
    scrollContent: {
      ...layoutPresets.scrollContent(spacing.lg),
      paddingBottom: spacing.xxl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingTop: spacing.sm,
      gap: spacing.md,
    },
    headerText: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xs,
    },
    greeting: {
      ...typography.title,
      color: colors.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      fontSize: fontSize.sm,
      lineHeight: 20,
    },
    settingsButton: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.xxl,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    focusCard: {
      ...layoutPresets.card,
      padding: spacing.lg,
      gap: spacing.md,
    },
    focusCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    focusIconBadge: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    focusCardLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '500',
      letterSpacing: 0.5,
      flex: 1,
      minWidth: 0,
    },
    focusScoreBlock: {
      gap: spacing.sm,
    },
    focusScoreValue: {
      fontSize: 45,
      lineHeight: 52,
      color: colors.textPrimary,
      fontWeight: '400',
    },
    focusBudgetPill: {
      alignSelf: 'stretch',
      backgroundColor: colors.successIconBg,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    focusBudgetText: {
      ...typography.caption,
      color: colors.success,
      fontWeight: '500',
      fontSize: fontSize.xs,
      lineHeight: 16,
    },
    focusProgress: {
      marginTop: spacing.xs,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'stretch',
    },
    statCard: {
      flex: 1,
      minWidth: 0,
      ...layoutPresets.card,
      padding: spacing.md,
      gap: spacing.sm,
    },
    statIconBadge: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statIconUsed: {
      backgroundColor: colors.successIconBg,
    },
    statIconRemaining: {
      backgroundColor: colors.overLimitMuted,
    },
    statLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '500',
      fontSize: 11,
      letterSpacing: 0.56,
    },
    statValueBlock: {
      gap: 2,
    },
    statValueMain: {
      fontSize: fontSize.xl,
      lineHeight: 28,
      color: colors.textPrimary,
      fontWeight: '400',
    },
    statValueUnit: {
      fontSize: fontSize.xs,
      lineHeight: 16,
      color: colors.textSecondary,
      fontWeight: '400',
    },
    section: {
      ...layoutPresets.card,
      padding: spacing.lg,
      gap: spacing.md,
    },
    sectionHeader: {
      ...layoutPresets.rowBetween,
      alignItems: 'center',
      gap: spacing.sm,
    },
    sectionTitle: {
      ...textPresets.sectionTitle,
      flex: 1,
      minWidth: 0,
    },
    viewAllButton: {
      ...layoutPresets.linkButton,
      flexShrink: 0,
    },
    viewAllText: textPresets.accentButton,
    appsList: {
      gap: spacing.md,
    },
    emptyText: {
      ...textPresets.empty,
      paddingVertical: spacing.lg,
    },
    quickActions: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: spacing.md,
    },
    quickActionCard: {
      flex: 1,
      minWidth: 0,
      ...layoutPresets.card,
      padding: spacing.lg,
      gap: spacing.xs,
    },
    quickActionCardActive: {
      borderColor: colors.accent,
    },
    quickActionCardDisabled: {
      opacity: 0.5,
    },
    quickActionIconBadge: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.accentIconBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    quickActionIconMuted: {
      backgroundColor: colors.accentMuted,
    },
    quickActionTitle: {
      ...typography.sectionTitle,
      color: colors.accent,
      minHeight: lineHeight.md * 2,
    },
    quickActionTitleMuted: {
      ...typography.sectionTitle,
      color: colors.textPrimary,
      minHeight: lineHeight.md * 2,
    },
    quickActionSubtitle: {
      ...typography.caption,
      color: colors.textSecondary,
      fontSize: fontSize.xs,
      lineHeight: 16,
    },
    quickActionSubtitleMuted: {
      ...typography.caption,
      color: colors.textSecondary,
      fontSize: fontSize.xs,
      lineHeight: 16,
    },
  });
};

export const useDashboardStyles = createStylesHook(createDashboardStyles);
