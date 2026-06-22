/** @format */

import { darkColors } from './palettes';
import type { ColorPalette } from './types';

const paletteKeys = Object.keys(darkColors) as (keyof ColorPalette)[];

export const areColorPalettesEqual = (left: ColorPalette, right: ColorPalette): boolean =>
  paletteKeys.every((key) => left[key] === right[key]);
