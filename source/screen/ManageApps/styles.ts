/** @format */

import { StyleSheet } from 'react-native';

import { createStylesHook } from '@/hooks/createStylesHook';
import { borderRadius, spacing } from '@/theme';
import type { Theme } from '@/theme/types';

import { SELECTED_CHIP_HEIGHT, SELECTED_CHIP_WIDTH } from './constants';

export const createManageAppsStyles = ({ colors, presets }: Theme) => {
  const { layoutPresets, textPresets, iconBoxPresets } = presets;

  return StyleSheet.create({
    screen: layoutPresets.screen,
    content: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },
    flatList: {
      flex: 1,
    },
    listWrapper: {
      flex: 1,
      minHeight: 0,
      position: 'relative',
    },
    listHeader: {
      gap: spacing.md,
      paddingBottom: spacing.md,
    },
    searchToolbar: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
      flexGrow: 0,
      flexShrink: 0,
    },
    scrollContent: {
      ...layoutPresets.scrollContent(spacing.md),
      paddingBottom: spacing.xxxl,
    },
    searchField: {
      ...layoutPresets.card,
      ...layoutPresets.rowCenter,
      gap: spacing.md,
      minHeight: 48,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.lg,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 0,
      ...textPresets.searchInput,
    },
    filters: {
      flexGrow: 0,
      flexShrink: 0,
    },
    filtersContent: {
      ...layoutPresets.rowCenter,
      gap: spacing.sm,
      paddingRight: spacing.sm,
    },
    filterChip: {
      ...layoutPresets.card,
      paddingHorizontal: spacing.lg,
      paddingVertical: 10,
      flexShrink: 0,
      borderRadius: borderRadius.pill,
    },
    filterChipActive: {
      backgroundColor: colors.accentMuted,
      borderColor: colors.accent,
    },
    filterChipText: {
      ...textPresets.label,
      color: colors.textSecondary,
    },
    filterChipTextActive: {
      color: colors.accent,
    },
    section: {
      gap: spacing.md,
      flexGrow: 0,
      flexShrink: 0,
    },
    selectedAppsSectionOuter: {
      flexGrow: 0,
      flexShrink: 0,
    },
    sectionTitle: textPresets.sectionTitle,
    selectedAppsScroll: {
      flexGrow: 0,
      flexShrink: 0,
      overflow: 'hidden',
    },
    selectedAppsChipRowWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      gap: spacing.sm,
    },
    selectedAppsChipColumnStrip: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      columnGap: spacing.sm,
      rowGap: spacing.sm,
    },
    selectedChip: {
      ...layoutPresets.card,
      ...layoutPresets.rowCenter,
      flexShrink: 0,
      width: SELECTED_CHIP_WIDTH,
      height: SELECTED_CHIP_HEIGHT,
      paddingLeft: spacing.md,
      paddingRight: spacing.xs,
      gap: spacing.xs,
    },
    selectedChipBody: {
      flex: 1,
      minWidth: 0,
    },
    selectedChipLabel: textPresets.label,
    selectedChipRemove: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
    },
    contentDimmed: {
      opacity: 0.45,
    },
    filterLoader: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    appItem: {
      ...layoutPresets.rowCenter,
      gap: spacing.lg,
      padding: spacing.lg,
      ...layoutPresets.cardLg,
    },
    appIconBox: iconBoxPresets.md,
    appIcon: {
      width: 48,
      height: 48,
    },
    appIconFallback: textPresets.iconFallbackLg,
    appInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    appName: textPresets.heading,
    appCategory: textPresets.labelMuted,
    selectionControl: {
      width: 28,
      height: 28,
      borderRadius: borderRadius.icon,
      borderWidth: 2,
      borderColor: colors.selectionBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectionControlSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    emptyText: {
      ...textPresets.empty,
      paddingVertical: spacing.xl,
    },
    iosPickAppsContainer: {
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.md,
    },
    iosPickAppsButton: {
      ...layoutPresets.cardLg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      backgroundColor: colors.accentMuted,
      borderColor: colors.accent,
    },
    iosPickAppsButtonPressed: {
      opacity: 0.85,
    },
    iosPickAppsButtonText: {
      ...textPresets.accentButton,
    },
    iosPickAppsHint: {
      ...textPresets.captionMuted,
      textAlign: 'center',
    },
  });
};

export const useManageAppsStyles = createStylesHook(createManageAppsStyles);
