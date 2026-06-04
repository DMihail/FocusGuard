import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

export const UsedSvg = (props: SvgProps) => {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <G
        clipPath="url(#clip0_3_662)"
        stroke="#4CAF50"
        strokeWidth={1.33322}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M8 14.665A6.666 6.666 0 108 1.333a6.666 6.666 0 000 13.332z" />
        <Path d="M8 4v4l2.666 1.332" />
      </G>
      <Defs>
        <ClipPath id="clip0_3_662">
          <Path fill="#fff" d="M0 0H15.9986V15.9986H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
