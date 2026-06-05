/** @format */

import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const BellIcon = ({ stroke = '#D0BCFF', ...props }: SvgProps) => (
  <Svg width={20} height={20} viewBox="0 0 17 15" fill="none" {...props}>
    <Path
      d="M1.051 11.937C0.942 12.057 0.87 12.205 0.844 12.364c0.026.16.054.308.12.456.065.148.172.273.307.362.135.089.293.136.454.136h13.332c.161 0 .319-.047.454-.136.135-.089.242-.214.307-.362.066-.148.094-.296.068-.455-.026-.16-.098-.308-.207-.428C14.507 10.796 13.332 9.582 13.332 5.833c0-1.326-.527-2.598-1.465-3.535C10.93 1.36 9.658.833 8.332.833S5.734 1.36 4.797 2.298 3.332 4.507 3.332 5.833c0 3.749-1.175 4.963-2.281 6.104Z"
      stroke={stroke}
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
