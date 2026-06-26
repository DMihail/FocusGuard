/** @format */
import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const Clock = ({ stroke = darkColors.accent, ...props }: SvgProps) => {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none" {...props}>
      <Path
        d="M47.996 87.992c22.09 0 39.997-17.907 39.997-39.996 0-22.09-17.908-39.997-39.997-39.997C25.906 8 7.999 25.906 7.999 47.996s17.907 39.996 39.997 39.996z"
        stroke={stroke}
        strokeWidth={5.99949}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M47.996 23.998v23.998l15.998 8"
        stroke={stroke}
        strokeWidth={5.99949}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
