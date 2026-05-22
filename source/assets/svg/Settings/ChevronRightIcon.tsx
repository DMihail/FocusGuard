/** @format */

import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const ChevronRightIcon = ({ stroke = 'rgba(147, 143, 153, 0.4)', ...props }: SvgProps) => (
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
