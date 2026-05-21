/** @format */

import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const BackIcon = (props: SvgProps) => (
  <Svg width={8} height={14} viewBox="0 0 8 14" fill="none" {...props}>
    <Path d="M7 13L1 7L7 1" stroke="#E6E1E5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
