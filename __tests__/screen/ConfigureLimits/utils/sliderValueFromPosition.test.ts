/** @format */

import { getSliderProgress, sliderValueFromPosition } from '@/screen/ConfigureLimits/utils/sliderValueFromPosition';

describe('sliderValueFromPosition', () => {
  const min = 15;
  const max = 180;
  const step = 5;
  const width = 200;

  it('returns min at the start of the track', () => {
    expect(sliderValueFromPosition(0, width, min, max, step)).toBe(15);
  });

  it('returns max at the end of the track', () => {
    expect(sliderValueFromPosition(width, width, min, max, step)).toBe(180);
  });

  it('snaps to the nearest step', () => {
    expect(sliderValueFromPosition(50, width, min, max, step)).toBe(55);
  });

  it('clamps positions outside the track', () => {
    expect(sliderValueFromPosition(-20, width, min, max, step)).toBe(15);
    expect(sliderValueFromPosition(500, width, min, max, step)).toBe(180);
  });

  it('returns min when track width is zero', () => {
    expect(sliderValueFromPosition(100, 0, min, max, step)).toBe(15);
  });

  it('maps touch only on the active segment when visual min is lower than clamp min', () => {
    const visualMin = 30;
    const clampMin = 60;
    const activeStart = ((clampMin - visualMin) / (max - visualMin)) * width;

    expect(sliderValueFromPosition(0, width, clampMin, max, step, visualMin)).toBe(60);
    expect(sliderValueFromPosition(activeStart, width, clampMin, max, step, visualMin)).toBe(60);
    expect(sliderValueFromPosition(width, width, clampMin, max, step, visualMin)).toBe(180);
  });
});

describe('getSliderProgress', () => {
  it('returns normalized progress across the visual range', () => {
    expect(getSliderProgress(60, 30, 240)).toBeCloseTo(30 / 210);
  });
});
