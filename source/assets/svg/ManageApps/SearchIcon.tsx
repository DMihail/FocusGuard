/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const SearchIcon = ({ stroke = darkColors.textSecondary, ...props }: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Circle cx={7.5} cy={7.5} r={5.5} stroke={stroke} strokeOpacity={0.5} strokeWidth={1.5} />
    <Path d="M11.5 11.5L14 14" stroke={stroke} strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);
