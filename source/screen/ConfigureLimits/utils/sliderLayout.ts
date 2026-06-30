/** @format */

import type { DimensionValue } from 'react-native';

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const toPercentDimension = (ratio: number): DimensionValue => `${clamp01(ratio) * 100}%` as DimensionValue;

const getSliderProgress = (valueMinutes: number, progressMinMinutes: number, maxMinutes: number): number => {
  if (maxMinutes <= progressMinMinutes) {
    return 1;
  }

  return (valueMinutes - progressMinMinutes) / (maxMinutes - progressMinMinutes);
};

const getSliderInactiveRatio = (minMinutes: number, progressMinMinutes: number, maxMinutes: number): number => {
  if (maxMinutes <= progressMinMinutes || minMinutes <= progressMinMinutes) {
    return 0;
  }

  return clamp01((minMinutes - progressMinMinutes) / (maxMinutes - progressMinMinutes));
};

export const getSliderLayout = (
  valueMinutes: number,
  minMinutes: number,
  progressMinMinutes: number,
  maxMinutes: number,
) => {
  const progress = clamp01(getSliderProgress(valueMinutes, progressMinMinutes, maxMinutes));
  const inactiveRatio = getSliderInactiveRatio(minMinutes, progressMinMinutes, maxMinutes);

  return {
    progress,
    progressPercent: toPercentDimension(progress),
    inactivePercent: toPercentDimension(inactiveRatio),
    showInactiveZone: inactiveRatio > 0,
  };
};
