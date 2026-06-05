/** @format */

import type { TextStyle, ViewStyle } from 'react-native';

import { borderRadius } from './borderRadius';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const layoutPresets = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  } satisfies ViewStyle,
  scrollContent: (gap: number = spacing.xl) =>
    ({
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      gap,
    } satisfies ViewStyle),
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } satisfies ViewStyle,
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
  } satisfies ViewStyle,
  cardLg: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
  } satisfies ViewStyle,
  linkButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  } satisfies ViewStyle,
} as const;

export const textPresets = {
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  } satisfies TextStyle,
  label: {
    ...typography.label,
    color: colors.textPrimary,
  } satisfies TextStyle,
  labelMuted: {
    ...typography.label,
    color: colors.textMuted,
  } satisfies TextStyle,
  heading: {
    ...typography.heading,
    color: colors.textPrimary,
  } satisfies TextStyle,
  displayTitle: {
    ...typography.display,
    color: colors.textPrimary,
  } satisfies TextStyle,
  accentButton: {
    ...typography.button,
    color: colors.accent,
  } satisfies TextStyle,
  searchInput: {
    ...typography.input,
    color: colors.textPrimary,
  } satisfies TextStyle,
  captionMuted: {
    ...typography.caption,
    color: colors.textMuted,
  } satisfies TextStyle,
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  } satisfies TextStyle,
  iconFallbackLg: {
    ...typography.iconFallback,
    color: colors.textPrimary,
  } satisfies TextStyle,
} as const;

export const iconBoxPresets = {
  sm: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.appIconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } satisfies ViewStyle,
  md: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.icon,
    backgroundColor: colors.appIconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } satisfies ViewStyle,
  lg: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.appIconBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } satisfies ViewStyle,
} as const;

export const switchTrackColors = {
  false: colors.switchTrackOff,
  true: colors.accent,
} as const;
