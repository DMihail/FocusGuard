import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const FocusModeSvg = (props: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M19.998 12.999c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.669-.01c-4.17-1.44-7.67-3.94-7.67-8.94v-7a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0c1.75 1.53 4.24 2.72 6.24 2.72a1 1 0 011 1v7z"
        stroke="#D0BCFF"
        strokeWidth={1.99983}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
