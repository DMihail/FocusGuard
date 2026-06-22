/** @format */

import { interpolateColor } from 'react-native-reanimated';

import { areColorPalettesEqual } from './areColorPalettesEqual';
import { darkColors } from './palettes';
import type { ColorPalette } from './types';

const paletteKeys = Object.keys(darkColors) as (keyof ColorPalette)[];

export const interpolateColorPalette = (from: ColorPalette, to: ColorPalette, progress: number): ColorPalette => {
  if (progress <= 0) {
    return from;
  }

  if (progress >= 1 || areColorPalettesEqual(from, to)) {
    return to;
  }

  const colors = {} as ColorPalette;

  for (const key of paletteKeys) {
    colors[key] = interpolateColor(progress, [0, 1], [from[key], to[key]]);
  }

  return colors;
};
