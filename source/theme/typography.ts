/** @format */

import type { TextStyle } from 'react-native';

export const FONT_FAMILY = {
  inter: 'Inter',
} as const;

export const fontFamily = FONT_FAMILY;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 36,
} as const;

export const fontSize = FONT_SIZES;

export const LINE_HEIGHT = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 36,
  display: 40,
} as const;

export const lineHeight = LINE_HEIGHT;

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontWeight = {
  regular: FONT_WEIGHTS.regular as TextStyle['fontWeight'],
  medium: FONT_WEIGHTS.medium as TextStyle['fontWeight'],
  semibold: FONT_WEIGHTS.semibold as TextStyle['fontWeight'],
  bold: FONT_WEIGHTS.bold as TextStyle['fontWeight'],
};

export const LETTER_SPACING = {
  tightXs: -0.15,
  tight: -0.05,
  tightMd: -0.31,
  tightLg: -0.53,
  normal: 0.1875,
  wide: 0.3828125,
} as const;

export const letterSpacing = LETTER_SPACING;

export const typography = {
  button: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.tight,
  },
  title: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.wide,
  },
  body: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  },
  sectionTitle: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.tight,
  },
  label: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.tight,
  },
  heading: {
    fontFamily: fontFamily.inter,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.tightMd,
  },
} as const satisfies Record<string, TextStyle>;
