/** @format */

import { StyleSheet } from 'react-native';

import { layoutPresets, spacing, textPresets } from '@/theme';

export const trackedAppsStyles = StyleSheet.create({
  screen: layoutPresets.screen,
  content: {
    flex: 1,
    minHeight: 0,
    position: 'relative',
  },
  scrollContent: {
    ...layoutPresets.scrollContent(spacing.md),
    paddingBottom: spacing.xxxl,
  },
  emptyText: {
    ...textPresets.empty,
    paddingVertical: spacing.xl,
  },
});
