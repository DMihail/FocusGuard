/** @format */

import { StyleSheet } from 'react-native';

import { borderRadius, colors, iconBoxPresets, layoutPresets, spacing, textPresets, typography } from '@/theme';

export const dashboardStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: layoutPresets.scrollContent(),
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  greeting: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: layoutPresets.rowBetween,
  sectionTitle: textPresets.sectionTitle,
  viewAllButton: layoutPresets.linkButton,
  viewAllText: textPresets.accentButton,
  appsListSeparator: {
    height: spacing.md,
  },
  appItem: {
    ...layoutPresets.card,
    padding: spacing.md,
  },
  appRow: {
    ...layoutPresets.rowCenter,
    gap: spacing.md,
  },
  appIconBox: iconBoxPresets.sm,
  appIcon: {
    width: 40,
    height: 40,
  },
  appIconFallback: textPresets.label,
  appInfo: {
    flex: 1,
  },
  appName: textPresets.label,
  emptyText: {
    ...textPresets.empty,
    paddingVertical: spacing.lg,
  },
});
