/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const CloseIcon = ({ stroke = darkColors.textSecondary, ...props }: SvgProps) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <Path d="M4 4L12 12M12 4L4 12" stroke={stroke} strokeOpacity={0.8} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);
