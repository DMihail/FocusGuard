/** @format */

import type { TextStyle } from 'react-native';

import type { InterWeight } from './fonts.types';

const IOS_FAMILY = 'Inter';

const NUMERIC_WEIGHT: Record<InterWeight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export type { InterWeight } from './fonts.types';

export const resolveFontFamily = (_weight: InterWeight = 'regular'): string => IOS_FAMILY;

export const resolveFontWeight = (weight: InterWeight): TextStyle['fontWeight'] => NUMERIC_WEIGHT[weight];
