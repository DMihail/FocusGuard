/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const MoonIcon = ({ stroke = '#D0BCFF', ...props }: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M15.833 11.458a6.042 6.042 0 0 1-8.75-8.75 6.667 6.667 0 1 0 8.75 8.75Z"
      stroke={stroke}
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
