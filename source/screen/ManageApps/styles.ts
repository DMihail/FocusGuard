/** @format */

import { StyleSheet } from 'react-native';
import {
  borderRadius,
  colors,
  fontSize,
  iconBoxPresets,
  layoutPresets,
  lineHeight,
  spacing,
  textPresets,
  typography,
} from '@/theme';

export const manageAppsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: layoutPresets.scrollContent(),
  header: {
    ...layoutPresets.rowCenter,
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    ...layoutPresets.card,
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: textPresets.heading,
  subtitle: {
    ...typography.body,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    color: colors.textMuted,
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
  sectionTitle: textPresets.sectionTitle,
  selectedAppsScroll: {
    flexGrow: 0,
    flexShrink: 0,
    maxHeight: 96,
  },
  selectedAppsScrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.md,
  },
  selectedAppsRows: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  selectedAppsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  selectedChip: {
    ...layoutPresets.card,
    ...layoutPresets.rowCenter,
    flexShrink: 0,
    width: 148,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedChipLabel: textPresets.label,
  appsList: {
    gap: spacing.md,
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
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionControlSelected: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  emptyText: {
    ...textPresets.empty,
    paddingVertical: spacing.xl,
  },
});
