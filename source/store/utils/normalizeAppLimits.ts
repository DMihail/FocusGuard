/** @format */

import {
  HARD_BLOCK_MAX_MINUTES,
  HARD_BLOCK_MIN_MINUTES,
  WARNING_MAX_MINUTES,
  WARNING_MIN_MINUTES,
} from '../constants/appLimits';
import type { AppLimits } from '../types';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const normalizeAppLimits = (limits: AppLimits): AppLimits => {
  const warningMinutes = clamp(limits.warningMinutes, WARNING_MIN_MINUTES, WARNING_MAX_MINUTES);
  const hardBlockMinutes = clamp(
    Math.max(limits.hardBlockMinutes, warningMinutes),
    HARD_BLOCK_MIN_MINUTES,
    HARD_BLOCK_MAX_MINUTES,
  );

  return {
    warningMinutes,
    hardBlockMinutes,
    strictMode: limits.strictMode,
  };
};
