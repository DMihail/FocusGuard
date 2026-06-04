/** @format */

import type { AppLimits, LimitSliderBounds } from '../types';

export const DEFAULT_APP_LIMITS: AppLimits = {
  warningMinutes: 45,
  hardBlockMinutes: 60,
  strictMode: false,
};

export const WARNING_MIN_MINUTES = 15;
export const WARNING_MAX_MINUTES = 180;
export const HARD_BLOCK_MIN_MINUTES = 30;
export const HARD_BLOCK_MAX_MINUTES = 240;

export const LIMIT_SLIDER_BOUNDS: LimitSliderBounds = {
  warning: { min: WARNING_MIN_MINUTES, max: WARNING_MAX_MINUTES, step: 5 },
  hardBlock: { min: HARD_BLOCK_MIN_MINUTES, max: HARD_BLOCK_MAX_MINUTES, step: 5 },
};
