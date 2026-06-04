/** @format */

import type { AppLimits, AppLimitsByPackage } from './appLimits';

export type AppLimitsStore = {
  limitsByPackage: AppLimitsByPackage;
  getLimits: (packageName: string) => AppLimits;
  setLimits: (packageName: string, limits: AppLimits) => void;
};

export type LimitSliderBound = {
  min: number;
  max: number;
  step: number;
};

export type LimitSliderBounds = {
  warning: LimitSliderBound;
  hardBlock: LimitSliderBound;
};
