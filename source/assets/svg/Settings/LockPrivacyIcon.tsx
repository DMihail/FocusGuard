/** @format */

import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const LockPrivacyIcon = ({ stroke = '#4CAF50', ...props }: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 17 11" fill="none" {...props}>
    <Path
      d="M14.166.833H2.5A1.667 1.667 0 0 0 .833 2.5v5.833c0 .92.746 1.666 1.667 1.666h11.666c.92 0 1.666-.746 1.666-1.666V2.5A1.667 1.667 0 0 0 14.166.833Z"
      stroke={stroke}
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M.833 8.333V5c0-1.105.44-2.165 1.221-2.946A4.167 4.167 0 0 1 5 1.667c1.105 0 2.165.439 2.946 1.22.78.782 1.22 1.842 1.22 2.947v3.333"
      stroke={stroke}
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
