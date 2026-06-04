/** @format */

import { StyleSheet } from 'react-native';

import { layoutPresets, spacing, textPresets } from '@/theme';

export const trackedAppsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  scrollContent: layoutPresets.scrollContent(spacing.md),
  list: {
    gap: spacing.md,
  },
  emptyText: {
    ...textPresets.empty,
    paddingVertical: spacing.xl,
  },
});
