/** @format */

import { Animated } from 'react-native';
import { createIndicatorProgress } from '../../../../source/screen/Onboarding/utils/indicatorProgress';

describe('createIndicatorProgress', () => {
  it('returns a fallback interpolation when page width is zero', () => {
    const scrollX = new Animated.Value(0);
    const first = createIndicatorProgress(scrollX, 0, 0);
    const second = createIndicatorProgress(scrollX, 1, 0);

    expect(first).toBeDefined();
    expect(second).toBeDefined();
  });

  it('builds interpolation around the active page offset', () => {
    const scrollX = new Animated.Value(300);
    const interpolateSpy = jest.spyOn(scrollX, 'interpolate');

    createIndicatorProgress(scrollX, 1, 300);

    expect(interpolateSpy).toHaveBeenCalledWith({
      inputRange: [0, 300, 600],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    interpolateSpy.mockRestore();
  });
});
