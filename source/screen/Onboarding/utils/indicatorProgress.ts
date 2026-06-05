/** @format */

export type IndicatorInterpolationConfig = {
  inputRange: [number, number, number];
  outputRange: [number, number, number];
};

/** Builds scroll interpolation ranges for a pager dot at [index]. */
export const getIndicatorInterpolationConfig = (index: number, pageWidth: number): IndicatorInterpolationConfig => {
  if (pageWidth <= 0) {
    const active = index === 0 ? 1 : 0;
    return {
      inputRange: [0, 1, 1],
      outputRange: [active, active, active],
    };
  }

  return {
    inputRange: [(index - 1) * pageWidth, index * pageWidth, (index + 1) * pageWidth],
    outputRange: [0, 1, 0],
  };
};
