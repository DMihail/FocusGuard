/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const UsageAccess = ({ stroke = darkColors.accent, ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 22 16" fill="none" {...props}>
    <Path
      d="M1.06241 7.65074C0.979075 7.87524 0.979075 8.12218 1.06241 8.34668C1.87404 10.3147 3.25173 11.9973 5.02083 13.1814C6.78993 14.3654 8.87077 14.9975 10.9995 14.9975C13.1283 14.9975 15.2091 14.3654 16.9782 13.1814C18.7473 11.9973 20.125 10.3147 20.9367 8.34668C21.02 8.12218 21.02 7.87524 20.9367 7.65074C20.125 5.68277 18.7473 4.0001 16.9782 2.81606C15.2091 1.63202 13.1283 0.999939 10.9995 0.999939C8.87077 0.999939 6.78993 1.63202 5.02083 2.81606C3.25173 4.0001 1.87404 5.68277 1.06241 7.65074Z"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.9999 10.9999C12.6568 10.9999 13.9999 9.65679 13.9999 7.99994C13.9999 6.34308 12.6568 4.99994 10.9999 4.99994C9.34305 4.99994 7.99991 6.34308 7.99991 7.99994C7.99991 9.65679 9.34305 10.9999 10.9999 10.9999Z"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
