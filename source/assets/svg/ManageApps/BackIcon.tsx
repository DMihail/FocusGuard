/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const BackIcon = ({ stroke = darkColors.textPrimary, ...props }: SvgProps) => (
  <Svg width={8} height={14} viewBox="0 0 8 14" fill="none" {...props}>
    <Path d="M7 13L1 7L7 1" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
