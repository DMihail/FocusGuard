/** @format */

import type { TextStyle } from 'react-native';

import type { InterWeight } from './fonts.types';

const ANDROID_FAMILY: Record<InterWeight, string> = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export type { InterWeight } from './fonts.types';

export const resolveFontFamily = (weight: InterWeight = 'regular'): string => ANDROID_FAMILY[weight];

export const resolveFontWeight = (_weight: InterWeight): TextStyle['fontWeight'] => 'normal';
