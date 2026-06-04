/** @format */

import { getSliderInactiveRatio, getSliderLayout } from '@/screen/ConfigureLimits/utils/sliderLayout';

describe('sliderLayout', () => {
  it('computes inactive ratio when clamp min is above visual min', () => {
    expect(getSliderInactiveRatio(60, 30, 240)).toBeCloseTo(30 / 210);
  });

  it('returns layout dimensions for thumb and fill', () => {
    const layout = getSliderLayout(60, 30, 30, 240);

    expect(layout.progress).toBeCloseTo(30 / 210);
    expect(layout.showInactiveZone).toBe(false);
  });
});
