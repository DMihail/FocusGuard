/** @format */

export type AppLimits = {
  warningMinutes: number;
  hardBlockMinutes: number;
  strictMode: boolean;
};

export type AppLimitsByAppKey = Record<string, AppLimits>;
