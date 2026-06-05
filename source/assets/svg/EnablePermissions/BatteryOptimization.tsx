/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/theme';

export const BatteryOptimization = ({ stroke = colors.accent, ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M7 7H15V17H7V7Z" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
    <Path d="M17 10H19V14H17V10Z" fill={stroke} />
    <Path d="M9 4L11 7H13L15 4" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
