/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const ChevronRightIcon = ({ stroke = darkColors.textDisabled, ...props }: SvgProps) => (
  <Svg width={8} height={12} viewBox="0 0 7 12" fill="none" {...props}>
    <Path
      d="M.833 10.832 5.833 5.833.833.833"
      stroke={stroke}
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
