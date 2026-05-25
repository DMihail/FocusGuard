/** @format */
import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export const Shield = ({ stroke = '#D0BCFF', ...props }: SvgProps) => {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none" {...props}>
      <Path
        d="M79.993 51.996c0 19.998-13.999 29.997-30.637 35.797a3.999 3.999 0 01-2.68-.04c-16.679-5.76-30.677-15.76-30.677-35.757V23.998a4 4 0 014-4c7.999 0 17.998-4.8 24.957-10.879a4.68 4.68 0 016.08 0C58.035 15.24 67.994 20 75.993 20a4 4 0 014 3.999v27.998z"
        stroke={stroke}
        strokeWidth={5.99949}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
