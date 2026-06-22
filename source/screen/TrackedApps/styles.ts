/** @format */

import { StyleSheet } from 'react-native';

import { spacing } from '@/theme';
import type { Theme } from '@/theme/types';

export const createTrackedAppsStyles = ({ presets }: Theme) => {
  const { layoutPresets, textPresets } = presets;

  return StyleSheet.create({
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
};
