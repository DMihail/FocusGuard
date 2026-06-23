/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const GlobeIcon = ({ stroke = darkColors.accentOnContainer, ...props }: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Circle cx={10} cy={10} r={8.33} stroke={stroke} strokeWidth={1.67} />
    <Path
      d="M1.67 10h16.66M10 1.67c2.5 2.78 2.5 14.88 0 16.66M10 1.67c-2.5 2.78-2.5 14.88 0 16.66"
      stroke={stroke}
      strokeWidth={1.67}
      strokeLinecap="round"
    />
  </Svg>
);
