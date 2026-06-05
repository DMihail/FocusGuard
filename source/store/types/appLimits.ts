/** @format */

export type AppLimits = {
  warningMinutes: number;
  hardBlockMinutes: number;
  strictMode: boolean;
};

export type AppLimitsByPackage = Record<string, AppLimits>;
