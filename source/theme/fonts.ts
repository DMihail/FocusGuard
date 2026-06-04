/** @format */

import { Platform } from 'react-native';

import type { TextStyle } from 'react-native';

export type InterWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/** Family name from bundled Inter static fonts (see source/assets/fonts). */
const IOS_FAMILY = 'Inter';

const ANDROID_FAMILY: Record<InterWeight, string> = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

const NUMERIC_WEIGHT: Record<InterWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const resolveFontFamily = (weight: InterWeight = 'regular'): string =>
  Platform.OS === 'android' ? ANDROID_FAMILY[weight] : IOS_FAMILY;

/** Android uses one file per weight; iOS uses Inter + numeric fontWeight. */
export const resolveFontWeight = (weight: InterWeight): TextStyle['fontWeight'] =>
  Platform.OS === 'android' ? 'normal' : NUMERIC_WEIGHT[weight];
