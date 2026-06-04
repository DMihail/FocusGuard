import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

export const RemainingSvg = (props: SvgProps) => {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <G clipPath="url(#clip0_3_672)">
        <Path
          d="M5.666 9.666a1.667 1.667 0 001.667-1.667c0-.92-.334-1.333-.667-2C5.951 4.571 6.516 3.297 8 2c.334 1.667 1.334 3.267 2.667 4.334 1.333 1.066 2 2.333 2 3.666a4.666 4.666 0 11-9.333 0c0-.768.289-1.53.667-2a1.667 1.667 0 001.666 1.667z"
          stroke="#FFC107"
          strokeWidth={1.33322}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3_672">
          <Path fill="#fff" d="M0 0H15.9986V15.9986H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
