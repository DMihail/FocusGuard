/** @format */

import type { TextStyle } from 'react-native';

export const fontFamily = {
  inter: 'Inter',
} as const;

export const fontSize = {
  sm: 14,
  md: 16,
  xl: 28,
} as const;

export const lineHeight = {
  sm: 20,
  md: 24,
  xl: 36,
} as const;

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
};

export const letterSpacing = {
  tight: -0.05,
  normal: 0.1875,
  wide: 0.3828125,
} as const;

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
    fontSize: fontSize.xl,
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
} as const satisfies Record<string, TextStyle>;
