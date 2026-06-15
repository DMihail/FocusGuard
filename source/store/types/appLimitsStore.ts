/** @format */

import type { AppLimits, AppLimitsByAppKey } from './appLimits';

export type AppLimitsStore = {
  limitsByAppKey: AppLimitsByAppKey;
  getLimits: (appKey: string) => AppLimits;
  setLimits: (appKey: string, limits: AppLimits) => void;
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
