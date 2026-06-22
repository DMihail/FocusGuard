/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const CheckIcon = ({ stroke = darkColors.onPrimary, ...props }: SvgProps) => (
  <Svg width={12} height={9} viewBox="0 0 12 9" fill="none" {...props}>
    <Path
      d="M10.2074 0.874939L3.79132 7.29106L0.874908 4.37464"
      stroke={stroke}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
