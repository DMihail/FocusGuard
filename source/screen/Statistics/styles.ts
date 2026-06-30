/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/createStylesHook';
import { borderRadius, fontSize, lineHeight, spacing, typography } from '@/theme';
import type { Theme } from '@/theme/types';

export const createStatisticsStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets } = presets;

  return StyleSheet.create({
    screen: layoutPresets.screen,
    content: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },
    scrollContent: {
      ...layoutPresets.scrollContent(spacing.xl),
      paddingHorizontal: 0,
      paddingBottom: spacing.xxxl,
    },
    periodToggle: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.xs,
      backgroundColor: colors.privacyBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.privacyBorder,
      borderRadius: borderRadius.icon,
    },
    periodButton: {
      flex: 1,
      minHeight: 40,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    periodButtonActive: {
      backgroundColor: colors.accent,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 4,
      elevation: 2,
    },
    periodButtonText: {
      ...typography.button,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textMuted,
      textAlign: 'center',
    },
    periodButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    summaryRow: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'stretch',
    },
    summaryCard: {
      flex: 1,
      minWidth: 0,
      ...layoutPresets.card,
      padding: spacing.md,
      gap: spacing.xs,
    },
    summaryCardAccent: {
      borderColor: colors.privacyHighlightBorder,
      backgroundColor: colors.privacyHighlightBg,
    },
    summaryCardSuccess: {
      borderColor: colors.successBorder,
      backgroundColor: colors.privacyHighlightBg,
    },
    summaryCardWarning: {
      borderColor: colors.overLimitMuted,
      backgroundColor: colors.privacyHighlightBg,
    },
    summaryValue: {
      fontSize: fontSize.xl,
      lineHeight: lineHeight.lg,
      color: colors.textPrimary,
      fontWeight: '400',
    },
    summaryLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '500',
      fontSize: 10,
      lineHeight: 15,
      letterSpacing: 0.37,
      textTransform: 'uppercase',
    },
    chartCard: {
      padding: spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.cardBorder,
      borderRadius: borderRadius.xxl,
      backgroundColor: colors.card,
      gap: spacing.md,
    },
    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    chartTitle: {
      ...typography.title,
      fontSize: fontSize.md,
      color: colors.textPrimary,
      flex: 1,
    },
    chartBody: {
      alignItems: 'center',
    },
    chartPlot: {
      marginBottom: spacing.xs,
    },
    customXAxisRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: spacing.sm,
    },
    customXAxisYAxisSpacer: {
      flexShrink: 0,
    },
    customXAxisLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.xs,
    },
    customXAxisLabel: {
      flex: 1,
      textAlign: 'center',
      fontSize: 10,
      lineHeight: 14,
      color: colors.textSecondary,
      paddingHorizontal: 1,
    },
    chartAxisText: {
      color: colors.textSecondary,
      fontSize: 11,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.lg,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: borderRadius.pill,
    },
    legendDotUsage: {
      backgroundColor: colors.danger,
    },
    legendDotSaved: {
      backgroundColor: colors.success,
    },
    legendText: {
      ...typography.body,
      fontSize: fontSize.sm,
      color: colors.textSecondary,
    },
    topAppsList: {
      gap: spacing.md,
    },
    topAppRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    topAppIcon: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.appIconBackground,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    topAppContent: {
      flex: 1,
      minWidth: 0,
      gap: spacing.sm,
    },
    topAppHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    topAppName: {
      ...typography.label,
      fontSize: fontSize.sm,
      color: colors.textPrimary,
      flex: 1,
    },
    topAppTime: {
      ...typography.label,
      fontSize: fontSize.sm,
      color: colors.textMuted,
    },
    emptyText: {
      ...textPresets.empty,
      textAlign: 'center',
      paddingVertical: spacing.xl,
    },
  });
};

export const useStatisticsStyles = createStylesHook(createStatisticsStyles);
