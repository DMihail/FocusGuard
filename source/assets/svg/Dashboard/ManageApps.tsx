import * as React from 'react';

import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

import { darkColors } from '@/theme/palettes';

export const ManageAppsSvg = ({ stroke = darkColors.accentOnContainer, ...props }: SvgProps) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M3 3v15.998a2 2 0 002 2h15.998M17.998 17V9M12.999 16.998V5M8 16.999v-3"
        stroke={stroke}
        strokeWidth={1.99983}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
