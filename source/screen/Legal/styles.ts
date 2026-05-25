/** @format */

import { StyleSheet } from 'react-native';
import { colors, fontSize, layoutPresets, spacing, textPresets, typography } from '@/theme';

export const legalStyles = StyleSheet.create({
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
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
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
  meta: {
    ...typography.caption,
    fontSize: fontSize.xs,
    color: colors.textDisabled,
    marginBottom: spacing.xl,
  },
  sections: {
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...textPresets.heading,
    fontSize: fontSize.md,
  },
  paragraph: {
    ...typography.body,
    fontSize: fontSize.sm,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
