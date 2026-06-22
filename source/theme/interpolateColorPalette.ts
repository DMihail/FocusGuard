/** @format */

import { interpolateColor } from 'react-native-reanimated';

import { COLOR_PALETTE_KEYS } from './palettes';
import type { ColorPalette } from './types';

export const areColorPalettesEqual = (left: ColorPalette, right: ColorPalette): boolean =>
  COLOR_PALETTE_KEYS.every((key) => left[key] === right[key]);

export const interpolateColorPalette = (from: ColorPalette, to: ColorPalette, progress: number): ColorPalette => {
  if (progress <= 0) {
    return from;
  }

  if (progress >= 1 || areColorPalettesEqual(from, to)) {
    return to;
  }

  const colors = {} as ColorPalette;

  for (const key of COLOR_PALETTE_KEYS) {
    colors[key] = interpolateColor(progress, [0, 1], [from[key], to[key]]);
  }

  return colors;
};
