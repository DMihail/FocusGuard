/** @format */

import type { TextStyle } from 'react-native';

import { type InterWeight, resolveFontFamily, resolveFontWeight } from './fonts';

const inter = (weight: InterWeight): Pick<TextStyle, 'fontFamily' | 'fontWeight'> => ({
  fontFamily: resolveFontFamily(weight),
  fontWeight: resolveFontWeight(weight),
});

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 36,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 36,
  caption: 23,
  display: 40,
} as const;

const letterSpacing = {
  tightXs: -0.15,
  tight: -0.05,
  tightMd: -0.31,
  tightLg: -0.53,
  normal: 0.1875,
  wide: 0.3828125,
} as const;

export const typography = {
  button: {
    ...inter('medium'),
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.tight,
  },
  title: {
    ...inter('regular'),
    fontSize: fontSize.xxxl,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.wide,
  },
  display: {
    ...inter('bold'),
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    letterSpacing: letterSpacing.tightLg,
  },
  body: {
    ...inter('regular'),
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  },
  sectionTitle: {
    ...inter('medium'),
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.tight,
  },
  label: {
    ...inter('medium'),
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.tight,
  },
  heading: {
    ...inter('semibold'),
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.tightMd,
  },
  input: {
    ...inter('medium'),
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.tight,
  },
  caption: {
    ...inter('regular'),
    fontSize: fontSize.sm,
    lineHeight: lineHeight.caption,
    letterSpacing: letterSpacing.tightXs,
  },
  iconFallback: {
    ...inter('medium'),
    fontSize: fontSize.xxl,
  },
} as const satisfies Record<string, TextStyle>;
