import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

export const FocusScoreSvg = (props: SvgProps) => {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <G
        clipPath="url(#clip0_3_638)"
        stroke="#D0BCFF"
        strokeWidth={1.66653}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M5 7.5H3.75a2.083 2.083 0 110-4.167H5M14.999 7.5h1.25a2.083 2.083 0 100-4.167h-1.25M3.333 18.332h13.332M8.333 12.216v1.95c0 .458-.392.816-.809 1.008-.983.45-1.691 1.691-1.691 3.158M11.666 12.216v1.95c0 .458.391.816.808 1.008.983.45 1.691 1.691 1.691 3.158" />
        <Path d="M14.999 1.667h-10v5.832a5 5 0 1010 0V1.667z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3_638">
          <Path fill="#fff" d="M0 0H19.9983V19.9983H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
