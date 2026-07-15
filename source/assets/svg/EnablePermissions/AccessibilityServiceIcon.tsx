/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const AccessibilityServiceIcon = ({ stroke = darkColors.accent, ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={4.5} r={2.5} stroke={stroke} strokeWidth={2} />
    <Path
      d="M7.5 9.5 9.5 14.5 12 11.5 14.5 14.5 16.5 9.5"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M5 20c1.8-2.2 4-3.3 7-3.3s5.2 1.1 7 3.3" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);
