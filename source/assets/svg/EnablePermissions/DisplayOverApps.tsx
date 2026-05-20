/** @format */

import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { colors } from '../../../theme';

export const DisplayOverApps = ({ stroke = colors.accent, ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 18 22" fill="none" {...props}>
    <Path
      d="M16.9985 11.9994C16.9985 16.999 13.4988 19.4987 9.33918 20.9486C9.12136 21.0224 8.88476 21.0189 8.66924 20.9386C4.4996 19.4987 0.999908 16.999 0.999908 11.9994V5.00001C0.999908 4.73481 1.10526 4.48048 1.29278 4.29296C1.4803 4.10544 1.73463 4.0001 1.99982 4.0001C3.99965 4.0001 6.49943 2.8002 8.23927 1.28033C8.45111 1.09935 8.72059 0.999908 8.99921 0.999908C9.27783 0.999908 9.54731 1.09935 9.75914 1.28033C11.509 2.8102 13.9988 4.0001 15.9986 4.0001C16.2638 4.0001 16.5181 4.10544 16.7056 4.29296C16.8932 4.48048 16.9985 4.73481 16.9985 5.00001V11.9994Z"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
