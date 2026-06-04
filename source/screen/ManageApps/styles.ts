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
  listFlex: {
    flex: 1,
  },
  scrollContent: {
    ...layoutPresets.scrollContent(spacing.md),
    paddingBottom: spacing.xxxl,
  },
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
  searchFieldContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    flexGrow: 0,
    flexShrink: 0,
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
    height: 96,
    overflow: 'hidden',
  },
  selectedAppsRows: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    height: 96,
    columnGap: spacing.sm,
    rowGap: spacing.sm,
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
  appsListContainer: {
    position: 'relative',
    minHeight: 120,
  },
  appsListDimmed: {
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
