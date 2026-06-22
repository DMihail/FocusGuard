/** @format */

import { areColorPalettesEqual, interpolateColorPalette } from '@/theme/interpolateColorPalette';
import { darkColors, lightColors } from '@/theme/palettes';

describe('interpolateColorPalette', () => {
  it('returns source palette at progress 0', () => {
    expect(interpolateColorPalette(darkColors, lightColors, 0)).toEqual(darkColors);
  });

  it('returns target palette at progress 1', () => {
    expect(interpolateColorPalette(darkColors, lightColors, 1)).toEqual(lightColors);
  });

  it('returns target when palettes are equal', () => {
    expect(interpolateColorPalette(darkColors, darkColors, 0.5)).toEqual(darkColors);
  });
});

describe('areColorPalettesEqual', () => {
  it('detects identical palettes', () => {
    expect(areColorPalettesEqual(darkColors, darkColors)).toBe(true);
    expect(areColorPalettesEqual(darkColors, lightColors)).toBe(false);
  });
});
