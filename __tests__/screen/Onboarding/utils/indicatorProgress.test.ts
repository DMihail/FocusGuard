/** @format */

import { getIndicatorInterpolationConfig } from '@/screen/Onboarding/utils/indicatorProgress';

describe('getIndicatorInterpolationConfig', () => {
  it('returns a fallback interpolation when page width is zero', () => {
    expect(getIndicatorInterpolationConfig(0, 0)).toEqual({
      inputRange: [0, 1, 1],
      outputRange: [1, 1, 1],
    });
    expect(getIndicatorInterpolationConfig(1, 0)).toEqual({
      inputRange: [0, 1, 1],
      outputRange: [0, 0, 0],
    });
  });

  it('builds interpolation around the active page offset', () => {
    expect(getIndicatorInterpolationConfig(1, 300)).toEqual({
      inputRange: [0, 300, 600],
      outputRange: [0, 1, 0],
    });
  });
});
