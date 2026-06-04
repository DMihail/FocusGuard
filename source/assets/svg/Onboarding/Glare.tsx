/** @format */
import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Glare = (props: SvgProps) => {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none" {...props}>
      <Path
        d="M47.996 87.992c22.09 0 39.996-17.907 39.996-39.996 0-22.09-17.907-39.997-39.996-39.997C25.906 8 7.999 25.906 7.999 47.996s17.907 39.996 39.997 39.996z"
        stroke="#D0BCFF"
        strokeWidth={5.99949}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M47.996 71.994c13.254 0 23.998-10.744 23.998-23.998 0-13.254-10.744-23.998-23.998-23.998-13.254 0-23.998 10.744-23.998 23.998 0 13.254 10.744 23.998 23.998 23.998z"
        stroke="#D0BCFF"
        strokeWidth={5.99949}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M47.996 55.995a8 8 0 100-15.998 8 8 0 000 15.998z"
        stroke="#D0BCFF"
        strokeWidth={5.99949}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
