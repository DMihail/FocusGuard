/** @format */

import { getSliderLayout } from '@/screen/ConfigureLimits/utils/sliderLayout';

describe('sliderLayout', () => {
  it('returns layout dimensions for thumb and fill', () => {
    const layout = getSliderLayout(60, 30, 30, 240);

    expect(layout.progress).toBeCloseTo(30 / 210);
    expect(layout.showInactiveZone).toBe(false);
  });
});
